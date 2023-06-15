const express = require("express");
const knex = require("knex")(
  require("./knexfile")[process.env.NODE_ENV || "development"]
);
const server = express();
const port = 8080;

server.use(express.json());

//Do not call server.listen() in this file, see index.js
