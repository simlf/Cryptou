import { PrismaClient } from "@prisma/client";
// import swaggerRoutes from "./api/swagger";
// const swaggerRoutes = require("./api/swagger");
import userRoutes from "./api/user";
// const userRoutes = require("./api/user");
const bodyParser = require("body-parser");
// import cors from "cors";
const express = require("express");
const router = require("express").Router();
import RssFetcher from "./rss/rssFetcher";
const PORT: string | number = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(swaggerRoutes);
// routes
app.use("/", userRoutes);

// app.use(cors({credentials:true, origin: process.env.CLIENT_URL}))
// app.use(cookieParser())

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
