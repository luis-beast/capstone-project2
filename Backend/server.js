const express = require("express");
const server = express();
const port = 8080;
const knex = require("knex")(
  require("./knexfile")[process.env.NODE_ENV || "development"] // Backend
);

server.use(express.json());

//Do not call server.listen() in this file, see index.js

server.get("/users", (req, res) => {
  res.status(200);
});
