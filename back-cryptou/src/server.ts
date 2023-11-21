import RssFetcher from "./rss/rssFetcher";

const bodyParser = require("body-parser");
const express = require("express");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const PORT: string | number = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});

async function startApplication() {
  console.log('Starting application...')
  const rssFetcher = new RssFetcher();
  await rssFetcher.fetchAllFeeds();
  console.log('Fetch finished application...')

}

startApplication().catch(console.error);