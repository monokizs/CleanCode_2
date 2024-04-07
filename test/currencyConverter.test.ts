import { mock, mockReset } from "jest-mock-extended";
import { CurrencyConverter } from "../src/currencyConverter";
import { IExchangeRateService } from "../src/exchangeRateService";
import { ServiceNotAvailableError } from "../src/errors/serviceNotAvailableError";
import { EndDateError } from "../src/errors/endDateError";
import { UnknownError } from "../src/errors/unknownError";



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
            expect(() => sut.Convert(NaN,"EUR","HUF")).toThrow(expectedError);
            //expect(mockedIExchangeRateService.getExchangeRate).toHaveBeenCalledTimes(1);
            //expect(mockedIExchangeRateService.getExchangeRate).toHaveBeenCalledWith("EUR","HUF");
        })

        it('should throw a Invalid amount input error if the amount less than 0', () => {
            // Arrange
            const errorMessage = "Invalid amount input.";
            const expectedError = new Error(errorMessage);
            mockedIExchangeRateService.getExchangeRate.mockImplementation(() => { throw expectedError });

            // Act
            expect(() => sut.Convert(-100,"EUR","HUF")).toThrow(expectedError);
            //expect(mockedIExchangeRateService.getExchangeRate).toHaveBeenCalledTimes(1);
            //expect(mockedIExchangeRateService.getExchangeRate).toHaveBeenCalledWith("EUR","HUF");
        })

        it('should throw an Unable to fetch exchange rate error if the rate is empty', () => {
            // Arrange
            const errorMessage = "Exchange rate not found.";
            const expectedError = new ServiceNotAvailableError(errorMessage);
            mockedIExchangeRateService.getExchangeRate.mockImplementation(() => { throw expectedError });

            // Act
            expect(() => sut.Convert(100,"GBP","HUF")).toThrow(expectedError);
            expect(mockedIExchangeRateService.getExchangeRate).toHaveBeenCalledTimes(1);
            expect(mockedIExchangeRateService.getExchangeRate).toHaveBeenCalledWith("GBP","HUF");
        })

       
        it('should throw an Unknown error', () => {
            // Arrange
            const errorMessage = 'Some error happened.';
            const error = new Error(errorMessage);
            const expectedErrorMessage = 'Unknown service error happened.';
            const expectedError = new UnknownError(expectedErrorMessage, error);
            mockedIExchangeRateService.getExchangeRate.mockImplementation(() => { throw error });

            // Act
            expect(() => sut.Convert(100,"10","20")).toThrow(expectedError);
            expect(mockedIExchangeRateService.getExchangeRate).toHaveBeenCalledTimes(1);
            expect(mockedIExchangeRateService.getExchangeRate).toHaveBeenCalledWith("10","20");
            
        })


        it('should throw an error if the enddate < startdate', () => {
            // Arrange
            const errorMessage = "The enddate less than startdate.";
            const expectedError = new EndDateError(errorMessage);
            
            // Act
            expect(() => sut.GenerateConversionReport("EUR","HUF", new Date('2024-04-04'), new Date('2024-04-01'))).toThrow(expectedError);
            //expect(mockedIExchangeRateService.getExchangeRate).toHaveBeenCalledTimes(1);
            //expect(mockedIExchangeRateService.getExchangeRate).toHaveBeenCalledWith("EUR","HUF");
        })

        it('should throw an error if the rate is empty', () => {
            // Arrange
            const errorMessage = "Exchange rate not found.";
            const expectedError = new ServiceNotAvailableError(errorMessage);
            mockedIExchangeRateService.getExchangeRate.mockImplementation(() => { throw expectedError });

            // Act
            expect(() => sut.GenerateConversionReport("GBP","HUF", new Date('2024-04-01'), new Date('2024-04-04'))).toThrow(expectedError);
        })

        it('should throw an Unknown error', () => {
            // Arrange
            const errorMessage = 'Some error happened.';
            const error = new Error(errorMessage);
            const expectedErrorMessage = 'Unknown service error happened.';
            const expectedError = new UnknownError(expectedErrorMessage, error);
            mockedIExchangeRateService.getExchangeRate.mockImplementation(() => { throw error });

            // Act
            expect(() => sut.GenerateConversionReport("10","20", new Date('2024-04-01'), new Date('2024-04-04'))).toThrow(expectedError);
            expect(mockedIExchangeRateService.getExchangeRate).toHaveBeenCalledTimes(1);
            expect(mockedIExchangeRateService.getExchangeRate).toHaveBeenCalledWith("10","20");
            
        })

    })
})