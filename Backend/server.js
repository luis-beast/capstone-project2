const express = require("express");
const server = express();
const port = 8080;
const cors = require("cors");
const knex = require("knex")(
  require("./knexfile")[process.env.NODE_ENV || "development"]
);

server.use(express.json());
server.use(cors());

//Do not call server.listen() in this file, see index.js

//Shows the server is running
server.get("/", (req, res) => {
  res.status(200).send("Application up and running. You better go catch it!");
});

//Users
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
    .insert(body)
    .then((data) => {
      res.status(201).json({
        message: `the user ${body.email} has been added.`,
      });
      console.log("data: ", data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        message: `There was an error adding ${body.email}. Please try again later.`,
      });
    });
});

server.get("/users/:id", (req, res) => {
  const input = req.params.id;
  knex("users")
    .where("id", input)
    .then((data) => {
      if (data.length > 0) {
        res.status(200).json(data);
      } else {
        res.status(404).json({ message: `User not found at ${input}.` });
      }
    });
});
server.delete("/users/:id", (req, res) => {
  const body = req.body;
  const queryValue = req.params.id;
  knex("users")
    .where("id", queryValue)
    .del()
    .then(() => {
      res.status(200).json({ message: `${queryValue} has been deleted.` });
    })
    .catch((err) => {
      res.status(500).json({
        message: `Unable to delete ${queryValue}, please try again later. Error: ${err}`,
      });
    });
});

server.put("/users/:id", (req, res) => {
  const { email, first_name, last_name } = req.body;
  let queryValue = req.params.id;
  knex("users")
    .where("id", queryValue)
    .update({ email, first_name, last_name })
    .then(() => res.status(201).json({ message: "You updated the data!" }))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "There was an error updating!" });
    });
});

//Gets pages
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

// Post pages
server.post("/pages", (req, res) => {
  const input = req.body;

  knex("pages")
    .insert(input)
    .then((data) => res.status(201).json(data))
    .catch((err) => {
      res.status(406).json({ Error: `No page was created: ${err}` });
    });
});

// Gets page by ID
server.get("/pages/:id", (req, res) => {
  knex("pages")
    .where("id", req.params.id)
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      console.error(err);
      res.status(404).json({ Error: `No such page with id ${req.params.id}` });
    });
});

// Deletes page
server.delete("/pages/id", (req, res) => {
  knex("pages")
    .where("id", req.params.id)
    .del()
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      res.status(202).json({
        Error: `Unable to delete event: ${req.params.id}. Error: ${err}`,
      });
    });
});

// TODO still
server.post("/login", async (req, res) => {
  const { email } = req.body;
  const user = await knex
    .from("users")
    .select("users.id", "users.email")
    .where("email", email)
    .then((data) => {
      // chekck to see if the response is one.
      if (data.length > 0) {
        return res.status(201).json(data);
      } else {
        res.status(500).json({ message: `There was an error adding ${email}` });
      }
    });
});

// Register
// server.post("/register");

// Retrieves all tags
server.get("/tags", (req, res) => {
  knex("tags")
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      console.error(err);
      res.status(404).json({ Error: `There was an error adding ${body}` });
    });
});

// Searches tags and returns results -- TODO
server.get("/tags", (req, res) => {
  let response = [];

  knex("tags").then((data) => {
    data.filter((tag) => {
      if (tag.name === req.query.name) {
        response.push(tag);
      }
    });
    res.json(response);
  });
});

// Retrieves tag by id
server.get("/tags/:id", (req, res) => {
  const input = req.params.id;

  knex("tags")
    .where("id", input)
    .then((data) => {
      if (data.length > 0) {
        return res.status(200).json(data);
      } else {
        return res.status(404).json({
          message: `Tags not found at id: ${input}. Please try again with a new id.`,
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(404).json({
        message: `Tag cannot be retrieved right now, try again later. Error: ${err}`,
      });
    });
});

// Adds new tag
server.post("/tags", (req, res) => {
  const body = req.body;

  knex("tags")
    .insert(body)
    .then(() => res.status(201).json({ message: `You added ${body.name}!` }))
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({ message: `There was an error adding ${body.name}` });
    });
});

// Updates tag by id
server.put("/tags/:id", (req, res) => {
  const { name } = req.body;
  let queryValue = req.params.id;

  knex("tags")
    .where("id", queryValue)
    .update({ name })
    .then(() => res.status(201).json({ message: "You updated the data!" }))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "There was an error updating!" });
    });
});

// Deleted tag by id
server.delete("/tags/:id", (req, res) => {
  const body = req.body;
  let queryValue = req.params.id;

  knex("tags")
    .where("id", queryValue)
    .del()
    .then(() => res.status(200).json({ message: `You deleted a tag!` }))
    .catch((err) => {
      res.status(500).json({
        message: `Cannot be deleted right now, try again later. Error: ${err}`,
      });
    });
});

module.exports = server;
