import { ServiceNotAvailableError } from "./errors/serviceNotAvailableError";

export class IExchangeRateService{
    public getExchangeRate(fromCurrency: string, toCurrency: string): number {
        const exchangeRates: { [key: string]: { [key: string]: number } } = {
            "USD": {
                "EUR": 0.85,
                "HUF": 311.72
            },
            "EUR": {
                "USD": 1.18,
                "HUF": 365.27
            },
            "HUF": {
                "USD": 0.0032,
                "EUR": 0.0027
            }
        };

        try {
            return exchangeRates[fromCurrency][toCurrency];
        } catch (error) {
            throw new ServiceNotAvailableError("Exchange rate not found.");
        }
    }

}