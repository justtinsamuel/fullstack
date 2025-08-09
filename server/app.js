const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded((extended = true)));

const routes = require("./routes");
app.use(routes);

app.listen(prototype, () => console.log(`app is running on ${port}`));