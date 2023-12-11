// types.ts

export interface CryptoChartData {
    time: number;
    high: number;
    low: number;
    open: number;
    volumefrom: number;
    volumeto: number;
    close: number;
    conversionType: string;
    conversionSymbol: string;
}

export interface CryptoGraphData {
    Aggregated: boolean;
    TimeFrom: number;
    TimeTo: number;
    Data: CryptoChartData[];
}

export interface CryptoApiResponse {
    Response: string;
    Message: string;
    HasWarning: boolean;
    Type: number;
    RateLimit: object;
    Data: CryptoGraphData;
}

export interface CryptoDataSql {
    id: number;
    fullName: string;
    slugName: string;
    imageUrl: string;
}

export interface CryptoData {
    cryptoName: string;
    currentPrice: number;
    openingPrice: number;
    lowestPrice: number;
    highestPrice: number;
    volume: number;
    change: number;
    imageUrl: string;
}
