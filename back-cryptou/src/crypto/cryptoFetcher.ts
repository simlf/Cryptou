import axios from 'axios';
import {CryptoApiResponse, CryptoGraphData, CryptoChartData, CryptoData, CryptoDataSql} from '../types/cryptoInterface';

export class CryptoFetcher {

    public static async callApi(curency: string, limite: number): Promise<CryptoApiResponse> {
        const apiKey: string = process.env.CRYPTO_API_KEY || "";
        try {
            const response = await axios.get(`https://min-api.cryptocompare.com/data/v2/histohour?fsym=${curency}&tsym=USD&limit=${limite}&api_key=${apiKey}`);
            const rawData = response.data;
            const parsedData: CryptoGraphData = {
                Aggregated: rawData.Data.Aggregated,
                TimeFrom: rawData.Data.TimeFrom,
                TimeTo: rawData.Data.TimeTo,
                Data: rawData.Data.Data as CryptoChartData[],
            };

            return {
                Response: rawData.Response,
                Message: rawData.Message,
                HasWarning: rawData.HasWarning,
                Type: rawData.Type,
                RateLimit: rawData.RateLimit,
                Data: parsedData,
            };
        } catch (error) {
            console.error(`Error fetching crypto data: ${error}`);
            throw error;
        }
    }

    public static async getCryptoGenralInfo(crypto: CryptoDataSql, currency: string): Promise<CryptoData> {
        const apiKey: string = process.env.CRYPTO_API_KEY || "";
        try {
            const cryptoSlug = crypto.slugName;
            const response = await axios.get(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptoSlug}&tsyms=${currency}&api_key=${apiKey}`);
            const rawData = response.data;
            const parsedData: CryptoData = {
                cryptoName: crypto.fullName,
                currentPrice: rawData.DISPLAY[cryptoSlug][currency].PRICE,
                openingPrice: rawData.DISPLAY[cryptoSlug][currency].OPENDAY,
                lowestPrice: rawData.DISPLAY[cryptoSlug][currency].LOWDAY,
                highestPrice: rawData.DISPLAY[cryptoSlug][currency].HIGHDAY,
                imageUrl: crypto.imageUrl,
            };

            return parsedData;
        } catch (error) {
            console.error(`Error fetching crypto data: ${error}`);
            throw error;
        }
    }

    public static async getCryptoPriceInfo (crypto: CryptoDataSql, currency: string, period: string): Promise<CryptoChartData[]> {
        const apiKey: string = process.env.CRYPTO_API_KEY || "";
        const cryptoListPrice: CryptoChartData[] = [];
        switch (period) {
            case "daily": {
                const response = await axios.get(`https://min-api.cryptocompare.com/data/v2/histoday?fsym=${crypto.slugName}&tsym=${currency}&limit=60&api_key=${apiKey}`);
                const rawData: CryptoChartData[] = response.data.Data.Data;

                rawData.forEach((element: CryptoChartData) => {
                    cryptoListPrice.push({
                        time: element.time,
                        high: element.high,
                        low: element.low,
                        open: element.open,
                        volumefrom: element.volumefrom,
                        volumeto: element.volumeto,
                        close: element.close,
                        conversionType: element.conversionType,
                        conversionSymbol: element.conversionSymbol,
                    });
                });
                return cryptoListPrice;
            }
            case "hourly": {
                const response = await axios.get(`https://min-api.cryptocompare.com/data/v2/histohour?fsym=${crypto.slugName}&tsym=${currency}&limit=48&api_key=${apiKey}`);
                const rawData: CryptoChartData[] = response.data.Data.Data;

                rawData.forEach((element: CryptoChartData) => {
                    cryptoListPrice.push({
                        time: element.time,
                        high: element.high,
                        low: element.low,
                        open: element.open,
                        volumefrom: element.volumefrom,
                        volumeto: element.volumeto,
                        close: element.close,
                        conversionType: element.conversionType,
                        conversionSymbol: element.conversionSymbol,
                    });
                });
                return cryptoListPrice;
            }
            case "minute": {
                const response = await axios.get(`https://min-api.cryptocompare.com/data/v2/histominute?fsym=${crypto.slugName}&tsym=${currency}&limit=120&api_key=${apiKey}`);
                const rawData: CryptoChartData[] = response.data.Data.Data;

                rawData.forEach((element: CryptoChartData) => {
                    cryptoListPrice.push({
                        time: element.time,
                        high: element.high,
                        low: element.low,
                        open: element.open,
                        volumefrom: element.volumefrom,
                        volumeto: element.volumeto,
                        close: element.close,
                        conversionType: element.conversionType,
                        conversionSymbol: element.conversionSymbol,
                    });
                });
                return cryptoListPrice;
            }
            default: {
                // Handle unexpected period values, or just return an empty array
                console.error(`Unexpected period: ${period}`);
                return [];
            }
        }
    }
}
