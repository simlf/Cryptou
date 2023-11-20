const bodyParser = require("body-parser");
import express from 'express';
const app = express();

import CryptoFetcher from './cryptoInfo/fetcher/cryptoFetcher';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 3000;

function respondWithJson(res: express.Response, code: number, payload: any) {
  const response = JSON.stringify(payload);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(code).send(response);
}

app.get('/crypto', async (req: any, res: any) => {
  console.log('crypto route call');
  try {
    const cryptoFetcher = new CryptoFetcher();
    const cryptoData = await cryptoFetcher.callApi('ETH', 100);
    respondWithJson(res, 200, cryptoData.Data.Data);
  } catch (error) {
    console.error(`Error fetching crypto data: ${error}`);
    respondWithJson(res, 500, { error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
