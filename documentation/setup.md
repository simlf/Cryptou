## Setup

Sources

- [💻 express](https://medium.com/@tharindugimras/typescript-setup-with-nodejs-yarn-package-manager-nodemon-fa9fb2275655)
- [💻 tailwindcss](https://tailwindcss.com/docs/installation)
- [💻 vite](https://vitejs.dev/guide/)

```
cd back-cryptou
yarn add express body-parser dotenv
yarn add typescript
yarn add -D @types/node
yarn tsc src/server.ts
yarn tsc init # tsconfig.json
yarn tsc # build
yarn add -D nodemon
# -> add start script in package.json
yarn start

yarn create vite # front-cryptou
yarn init
yarn add -D tailwindcss@latest postcss@latest autoprefixer@latest
yarn tailwindcss init
yarn add pinia
```
