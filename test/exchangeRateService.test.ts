import { IExchangeRateService } from "../src/exchangeRateService";



describe('Rate test', () => {

    let iExchangeRateService: IExchangeRateService;

    beforeEach(() => {
        iExchangeRateService= new IExchangeRateService();
    })

    it('should return the rate', () => {
        // Arrange
        const fromCurrency = "EUR";
        const toCurrency = "HUF";
        const expected = 365.27; 

        // Act
        const result = iExchangeRateService.getExchangeRate(fromCurrency,toCurrency);

        // Assert
        expect(result).toBe(expected);
    })

    it('should return an error', () => {
        // Arrange
        const fromCurrency = "GBP";
        const toCurrency = "HUF";
        
        // Act
        //const result = iExchangeRateService.getExchangeRate(fromCurrency,toCurrency);

        // Assert
        expect(() => iExchangeRateService.getExchangeRate(fromCurrency,toCurrency)).toThrow();
    })


})