import { CurrencyConverter } from "../src/currencyConverter";
import { IExchangeRateService } from "../src/exchangeRateService";

jest.mock('../src/exchangeRateService', () => {
    return {
        IExchangeRateService: jest.fn().mockImplementation(() => {
            return {
                getExchangeRate: jest.fn().mockReturnValue(365.27)
            }
        })
    }
});

describe('Rate test', () => {
    let currencyConverter: CurrencyConverter;
    const mockedIExchangeRateService = new IExchangeRateService();

    beforeEach(()=>{
        currencyConverter = new CurrencyConverter(mockedIExchangeRateService)
    })

    it('should return the rate', () => {
        // Arrange

        // Act
        currencyConverter.Convert(100,"EUR","HUF");

        // Assert
        expect(mockedIExchangeRateService.getExchangeRate).toHaveBeenCalledTimes(1);
        expect(mockedIExchangeRateService.getExchangeRate).toHaveBeenCalledWith("EUR","HUF");
    })
})