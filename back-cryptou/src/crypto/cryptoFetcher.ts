import axios from 'axios';
import { CryptoChartData, CryptoData, CryptoDataSql} from '../types/cryptoInterface';

export class CryptoFetcher {

    public static async getCryptoGenralInfo(crypto: CryptoDataSql, currency: string): Promise<CryptoData> {
        const apiKey: string = process.env.CRYPTO_API_KEY || "";
        try {
            const cryptoSlug = crypto.slugName;
            const response = await axios.get(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptoSlug}&tsyms=${currency}&api_key=${apiKey}`);
            const rawData = response.data;
            const parsedData: CryptoData = {
                id: crypto.id,
                cryptoName: crypto.fullName,
                currentPrice: rawData.DISPLAY[cryptoSlug][currency].PRICE.split(" ").slice(1).join(" ").replace(/,/g, "."),
                openingPrice: rawData.DISPLAY[cryptoSlug][currency].OPENDAY.split(" ").slice(1).join(" ").replace(/,/g, "."),
                lowestPrice: rawData.DISPLAY[cryptoSlug][currency].LOWDAY.split(" ").slice(1).join(" ").replace(/,/g, "."),
                highestPrice: rawData.DISPLAY[cryptoSlug][currency].HIGHDAY.split(" ").slice(1).join(" ").replace(/,/g, "."),
                volume: rawData.DISPLAY[cryptoSlug][currency].VOLUME24HOUR.split(" ").slice(1).join(" ").replace(/,/g, "."),
                change: rawData.DISPLAY[cryptoSlug][currency].CHANGEPCT24HOUR,
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

    private static getLimit (max: number, min: number, unit: string): number {
        const diff = max - min;
        switch (unit) {
            case "day": {
                return Math.round(diff / 86400);
            }
            case "hour": {
                return Math.round(diff / 3600);
            }
            case "minute": {
                return Math.round(diff / 60);
            }
            default: {
                console.error(`Unexpected unit: ${unit}`);
                return 0;
            }
        }
    }

    public static async getCryptoGraphData (slugName: string, currency: string, max: number, min: number, unit: string): Promise<CryptoChartData[]> {
        const apiKey: string = process.env.CRYPTO_API_KEY || "";
        const cryptoListPrice: CryptoChartData[] = [];
        let limit = CryptoFetcher.getLimit(max, min, unit);
        if (limit > 2000 || limit < 0) limit = 2000;
        const response  = await axios.get(`https://min-api.cryptocompare.com/data/v2/histo${unit}?fsym=${slugName}&tsym=${currency}&toTs=${max}&limit=${limit}&api_key=${apiKey}`);
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
}
