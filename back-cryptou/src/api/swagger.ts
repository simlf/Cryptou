import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const swaggerConfig = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "Crypto News Feed API",
            version: "1.0.0",
            description: "This API provides access to cryptocurrency news articles, including functionality to fetch, parse, and store articles from various RSS feeds. It's built using Express and integrates with Prisma for database operations.",
            contact: {
                name: "GitHub Repository",
                url: "https://github.com/tistech0/Cryptou",
            },
        },
        tags: [
            {
                name: "Articles",
                description: "Operation related to Articles.",
            },
            {
                name: "Feeds",
                description: "Endpoints for fetching, parsing, and storing RSS feeds.",
            },
            {
                name: "Cryptocurrencies",
                description: "Endpoints for fetching, parsing, and storing cryptocurrency data.",
            },
            {
                name: "Keywords",
                description: "Endpoints for fetching keywords.",
            },
            {
                name: "User",
                description: "Endpoints for user authentication.",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./src/api/*.ts"],
};

const specs = swaggerJsdoc(swaggerConfig);

const router = express.Router();

router.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
);

export default router;