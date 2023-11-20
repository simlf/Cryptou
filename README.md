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

## Documentations

- [Project setup 🔗](./documentation/setup.md)
