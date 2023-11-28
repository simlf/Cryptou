# Cryptou

## Quick Start

Versions

```
yarn -v
 -> 1.22.19
node -v
 -> v16.17.0
```

Developpement

```
# install (new) packages
yarn

# launch server front
yarn dev
 -> Local: http://127.0.0.1:5173/

# launch server back
yarn start
 -> Local: http://localhost:3000/
```

## Environment Configuration

Before running the application, you need to set up the environment variables:

1. Take a look at the `.env.template` file in the `documentations/` directory which contains a sample configuration. Review the file to understand the required environment variables.

2. Create a new `.env` file by copying the `.env.template` file:

```bash
   cp doc/.env.template .env
```

3. Edit the .env file with your specific configurations.

## Swagger/OpenAPI Documentation

You can access Swagger-UI at : <YOUR-BASE-API-URL>/api-docs

When you add new routes to the application, it's important to document them using Swagger/OpenAPI annotations. This ensures that our API documentation stays up-to-date and is easily accessible through Swagger UI.
How to Document Routes :

1. Use @openapi Annotations: Each route should be documented with @openapi comments directly above the route handler. These comments should describe the endpoint, its parameters, request body (if applicable), and response structure.

2. Parameters and Responses: Clearly define all parameters (path, query, body, etc.) and possible response types, including success and error responses. Use the appropriate schema types.

3. Maintain Consistency: Follow the existing documentation style for consistency. Refer to already documented routes for examples.

4. Testing: After adding annotations, test the route documentation by running the application and accessing the Swagger UI to ensure that the route appears correctly and the documentation is accurate.


## Documentations

- [Project setup 🔗](./documentation/setup.md)
