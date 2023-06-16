const express = require("express");
const server = express();
const port = 8080;
const knex = require("knex")(
  require("./knexfile")[process.env.NODE_ENV || "development"]
);

server.use(express.json());

//Do not call server.listen() in this file, see index.js

server.get("/", (req, res) => {
  res.status(200).send("Application up and running. You better go catch it!");
});

server.get("/users", (req, res) => {
  knex("users")
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      console.error(err);
      res
        .status(404)
        .json({ Error: "This data cannot be retrieved right now..." });
    });
});

server.post("/users", (req, res) => {
  const body = req.body;

  knex("users")
    .then((data) =>
      res.status(201).json({ message: `the user ${body} has been added` })
    )
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({
          message: `There was an error adding ${body}. Please try again later.`,
        });
    });
});

server.listen(port, () => {
  console.log(`Express server listening on port ${port}.`);
});

server.get("/pages", (req, res) => {
  knex("pages")
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      console.error(err);
      res
        .status(404)
        .json({ Error: "This data cannot be retrieved right now..." });
    });
});
