import { PrismaClient } from '@prisma/client'
const bodyParser = require("body-parser");
const express = require("express");
const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerConfig = require('../swagger/swaggerConfig.json');
const app = express();
const prisma = new PrismaClient()

const specs = swaggerJsdoc(swaggerConfig);

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const PORT: string | number = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});