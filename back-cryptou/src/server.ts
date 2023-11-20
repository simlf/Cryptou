import { PrismaClient } from '@prisma/client'
const bodyParser = require("body-parser");
const express = require("express");

const app = express();
const prisma = new PrismaClient()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const PORT: string | number = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});