const bodyParser = require("body-parser");
const express = require("express");
import userRoutes from "./api/user";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const PORT: string | number = process.env.PORT || 3000;

// routes
app.use(userRoutes);

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
