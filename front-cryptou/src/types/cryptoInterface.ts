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
    RateLimit: object; // You may want to create a specific interface for RateLimit if needed
    Data: CryptoGraphData;
}
