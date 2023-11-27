import { PrismaClient } from '@prisma/client'
import swaggerRoutes from './api/swagger';
const bodyParser = require("body-parser");
const express = require("express");
const router = require('express').Router();
const app = express();
const prisma = new PrismaClient()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(swaggerRoutes);

const PORT: string | number = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});