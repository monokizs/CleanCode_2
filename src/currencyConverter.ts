import { UnknownError } from "./errors/unknownError";
import { EndDateError } from "./errors/endDateError";
import { ServiceNotAvailableError } from "./errors/serviceNotAvailableError";

import { IExchangeRateService } from "./exchangeRateService"; 


export class CurrencyConverter {
    private readonly FIXED_AMOUNT = 100;
    
    constructor(private exchangeRateService: IExchangeRateService) { }
    
    public Convert(amount: number, fromCurrency: string, toCurrency: string): number{
        this.validateAmount(amount);
        const exchangeRate = this.getExchangeRate(fromCurrency, toCurrency); 
        //this.validateExchangeRate(exchangeRate);
        return amount * exchangeRate;
    }
    
    public GenerateConversionReport(fromCurrency: string, toCurrency: string, startDate: Date, endDate: Date): string {
        const conversions: number[] = [];
        const currentDate = new Date(startDate);
        
        if (endDate<startDate){
            throw new EndDateError('The enddate less than startdate.');
        } else {

            while (currentDate <= endDate) { 
                    let exchangeRate=0;
                    try {
                        exchangeRate = this.exchangeRateService.getExchangeRate(fromCurrency, toCurrency);
                    } catch (error) {
                        if (error instanceof ServiceNotAvailableError){
                            throw error;
                        }
                        throw new UnknownError('Unknown service error happened.', error as Error);
                    }
                    //this.validateExchangeRate(exchangeRate); 
                    this.calculateConversion(exchangeRate, conversions, currentDate);
            }
            
            return `Conversion Report:\n${conversions.join('\n')}`;
        }
    }
    
    private getExchangeRate(fromCurrency: string, toCurrency: string) {
        try {
            return this.exchangeRateService.getExchangeRate(fromCurrency, toCurrency);
        } catch (error) {
            if (error instanceof ServiceNotAvailableError){
                throw error;
            }
            
            throw new UnknownError('Unknown service error happened.', error as Error);
        }
        
    }
    
    private calculateConversion(exchangeRate: number, conversions: number[], currentDate: Date) {
        const convertedAmount = this.FIXED_AMOUNT * exchangeRate; // Assume a fixed amount for simplicity
        conversions.push(convertedAmount); 
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    /*private validateExchangeRate(exchangeRate: number) { 
        if (!exchangeRate) {
            throw new Error('Unable to fetch exchange rate.');
        }
    
        if (isNaN(exchangeRate)) {
            throw new Error('Invalid exchange rate.');
        }
    }*/
    
    private validateAmount(amount: number) { 
        if (isNaN(amount) || amount<0) {
            throw new Error('Invalid amount input.');
        }
    }

}
    