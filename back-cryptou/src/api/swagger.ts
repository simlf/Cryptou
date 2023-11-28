import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const swaggerConfig = require('../../swagger/swaggerConfig.json');
const specs = swaggerJsdoc(swaggerConfig);

const router = express.Router();

router.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
);

export default router;