import { mock, mockReset } from "jest-mock-extended";
import { CurrencyConverter } from "../src/currencyConverter";
import { IExchangeRateService } from "../src/exchangeRateService";
import { MyError } from "../src/errors/myError";

/*jest.mock('../src/exchangeRateService', () => {
    return {
        IExchangeRateService: jest.fn().mockImplementation(() => {
            return {
                getExchangeRate: jest.fn().mockReturnValue(365.27)
            }
        })
    }
});*/

describe('Currency Converter test', () => {
    let sut: CurrencyConverter;
    const mockedIExchangeRateService = mock<IExchangeRateService>();

    beforeEach(()=>{
        mockReset(mockedIExchangeRateService);
        sut = new CurrencyConverter(mockedIExchangeRateService);
    })

    describe('Happy path', ()=> {
        it('should return the rate', () => {
            // Arrange
            mockedIExchangeRateService.getExchangeRate.mockReturnValue(365.27);    
            // Act
            const result = sut.Convert(100,"EUR","HUF");
    
            // Assert

            expect(mockedIExchangeRateService.getExchangeRate).toHaveBeenCalledTimes(1);
            expect(mockedIExchangeRateService.getExchangeRate).toHaveBeenCalledWith("EUR","HUF");
        })

        it('should return the conversion report tests', () => {
            // Arrange
            mockedIExchangeRateService.getExchangeRate.mockReturnValue(365.27); 

            // Act
            const result = sut.GenerateConversionReport("EUR","HUF", new Date('2024-04-01'), new Date('2024-04-04'));

            // Assert
            expect(result).toMatchSnapshot();
        })


    })
    
    describe('Error path', ()=> {
        it('should throw a Invalid amount input error if the amount does not a number', () => {
            // Arrange
            const errorMessage = "Invalid amount input.";
            const expectedError = new Error(errorMessage);
            mockedIExchangeRateService.getExchangeRate.mockImplementation(() => { throw expectedError });

            // Act
            expect(() => sut.Convert(100,"EUR","HUF")).toThrow(expectedError);
            expect(mockedIExchangeRateService.getExchangeRate).toHaveBeenCalledTimes(1);
            expect(mockedIExchangeRateService.getExchangeRate).toHaveBeenCalledWith("EUR","HUF");
        })

        it('should throw an Unable to fetch exchange rate error if the rate is empty', () => {
            // Arrange
            const errorMessage = "Unable to fetch exchange rate.";
            const expectedError = new Error(errorMessage);
            mockedIExchangeRateService.getExchangeRate.mockImplementation(() => { throw expectedError });

            // Act
            expect(() => sut.Convert(100,"GBP","HUF")).toThrow(expectedError);
            expect(mockedIExchangeRateService.getExchangeRate).toHaveBeenCalledTimes(1);
            expect(mockedIExchangeRateService.getExchangeRate).toHaveBeenCalledWith("GBP","HUF");
        })

        it('should throw an Exchange rate not found error if the rate is empty', () => {
            // Arrange
            const errorMessage = 'Rate error.';
            const expectedError = new Error(errorMessage);
            const myErrorMessage = 'Exchange rate not found.';
            const myExpectedError = new MyError(myErrorMessage, expectedError);
            mockedIExchangeRateService.getExchangeRate.mockImplementation(() => { throw expectedError });

            // Act
            expect(() => sut.Convert(100,"GBP","HUF")).toThrow(myExpectedError);
            expect(mockedIExchangeRateService.getExchangeRate).toHaveBeenCalledTimes(1);
            expect(mockedIExchangeRateService.getExchangeRate).toHaveBeenCalledWith("GBP","HUF");
            
        })


    })
})