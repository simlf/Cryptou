import axios from 'axios';
import { CryptoApiResponse, CryptoGraphData, CryptoChartData } from '../../types/cryptoInterface'

class CryptoFetcher {

  public async callApi(curency: string, limite: number): Promise<CryptoApiResponse> {
    const apiKey: string = "f86d68f5c626a0398a7d78c66a4555acef091e742e5f00b2fb6d1e8e131755b2";
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
}

export default CryptoFetcher;
