import swaggerRoutes from "./api/swagger";
import articlesRoutes from "./api/articles";
import userRoutes from "./api/user";
import feedsRoutes from "./api/feeds";
const bodyParser = require("body-parser");
const express = require("express");
const router = require("express").Router();
import RssFetcher from "./rss/rssFetcher";
import cryptoRoutes from "./api/crypto";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT: string | number = process.env.PORT || 3000;

// routes
app.use(cryptoRoutes);
app.use(articlesRoutes);
app.use(userRoutes);
app.use(feedsRoutes);
app.use(swaggerRoutes);

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});

async function startApplication() {
  console.log("Starting application...");
  const rssFetcher = new RssFetcher();
  await rssFetcher.fetchAllFeeds();
  console.log("Fetch finished application...");
}

startApplication().catch(console.error);

app.on("close", () => {
  prisma.$disconnect();
});
