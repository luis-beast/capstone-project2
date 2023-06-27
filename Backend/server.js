const express = require("express");
const server = express();
const port = 8080;
const cors = require("cors");
const knex = require("knex")(
  require("./knexfile")[process.env.NODE_ENV || "development"]
);

server.use(express.json());
server.use(cors());
//Each edited page looks like {id: page id, token: user token, timestamp: time created}
const activePageLocks = []; //If this app is ever deployed, this needs to be replaced with an ES6 set for faster queries.
const millisecondsToEditPage = 3600000;
const removePageLock = (lockToRemove) => {
  let indexToRemove = activePageLocks.findIndex(
    (lock) =>
      lockToRemove.token === lock.token &&
      lockToRemove.id === lock.id &&
      lockToRemove.timestamp === lock.timestamp
  );
  console.log(indexToRemove);
  if (indexToRemove >= 0) {
    activePageLocks.splice(indexToRemove, 1);
  }
};

//Do not call server.listen() in this file, see index.js

//Shows the server is running
server.get("/", (req, res) => {
  res.status(200).send("Server is running.");
});

//users
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
  knex("pages AS p")
    .select(
      "p.id",
      "p.title",
      "p.body",
      "p.updated_at",
      "p.created_at",
      knex.raw("array_agg(t.id) as tag_ids"),
      knex.raw("array_agg(t.name) as tag_names")
    )
    .leftJoin("page_tags AS pt", "p.id", "pt.page_id")
    .leftJoin("tags AS t", "pt.tag_id", "t.id")
    .groupBy("p.id")
    .then((data) => {
      const sendData = data.map((page) => {
        let tagArray = page.tag_ids
          .filter((id) => id !== null)
          .map((id, index) => ({
            id: id,
            name: page.tag_names[index],
          }));
        return {
          id: page.id,
          title: page.title,
          body: page.body,
          tags: tagArray,
          created_at: page.created_at,
          updated_at: page.updated_at,
        };
      });
      res.status(200).json(sendData);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(404)
        .json({ Error: "This data cannot be retrieved right now..." });
    });
});

// Post pages
// TODO - parse and insert tag data
//TODO - parse and insert this as first entry in edit history
server.post("/pages", (req, res) => {
  const { title, body, user_id, tags } = req.body;

  knex.transaction((trx) => {
    return trx("pages")
      .insert({ title, body })
      .returning("id")
      .then((data) => {
        let page_id = data[0].id;
        let editHistoryPromise = trx("edit_history")
          .insert({ user_id, body, page_id, comment: "Page created" })
          .returning("page_id");

        let tagTransactionPromise = tags?.length
          ? trx("tags")
              .then((dbTags) => {
                let tagsInsertPromiseArray = [];
                tags.forEach((tagName) => {
                  let foundDbTag = dbTags.find(
                    (dbTag) => dbTag.name === tagName
                  );
                  if (foundDbTag) {
                    tagsInsertPromiseArray.push({ id: foundDbTag.id });
                  } else {
                    tagsInsertPromiseArray.push(
                      trx("tags").insert({ name: tagName }).returning("id")
                    );
                  }
                });
                return Promise.all(tagsInsertPromiseArray);
              })
              .then((tagIds) => {
                let pageTagEntries = tagIds.map((tagId) => ({
                  tag_id: tagId.id,
                  page_id: page_id,
                }));
                return trx("page_tags").insert(pageTagEntries);
              })
          : "No tags";

        return Promise.all([
          page_id,
          editHistoryPromise,
          tagTransactionPromise,
        ]);
      })
      .then((resolvedTransactions) => {
        res.status(201).send([resolvedTransactions[0]]);
      })
      .catch((err) => {
        res.status(406).json({ Error: `No page was created: ${err}` });
      });
  });
});

// Gets page by ID
server.get("/pages/:id", (req, res) => {
  knex("pages AS p")
    .select(
      "p.id",
      "p.title",
      "p.body",
      "p.updated_at",
      "p.created_at",
      knex.raw("array_agg(t.id) as tag_ids"),
      knex.raw("array_agg(t.name) as tag_names")
    )
    .leftJoin("page_tags AS pt", "p.id", "pt.page_id")
    .leftJoin("tags AS t", "pt.tag_id", "t.id")
    .where("p.id", req.params.id)
    .groupBy("p.id")
    .then((data) => {
      const sendData = data.map((page) => {
        let tagArray = page.tag_ids
          .filter((id) => id !== null)
          .map((id, index) => ({
            id: id,
            name: page.tag_names[index],
          }));
        return {
          id: page.id,
          title: page.title,
          body: page.body,
          tags: tagArray,
          created_at: page.created_at,
          updated_at: page.updated_at,
        };
      });
      res.status(200).json(sendData);
    })
    .catch((err) => {
      console.error(err);
      res.status(404).json({ Error: `No such page with id ${req.params.id}` });
    });
});

// Updates page
server.put("/pages/:id", (req, res) => {
  let { id, title, body, userId, comment, tags, lock } = req.body; //Note: tags is an array of strings
  let found = activePageLocks.find(
    (pageLock) =>
      lock.token === pageLock.token &&
      lock.id === pageLock.id &&
      lock.timestamp === pageLock.timestamp
  );

  if (found && id == req.params.id) {
    knex
      .transaction((trx) => {
        let pageTransactionPromise = trx("pages")
          .where("id", req.params.id)
          .update({ id, title, body });

        let editHistoryTransactionPromise = trx("edit_history").insert({
          page_id: id,
          user_id: userId,
          body: body,
          comment: comment,
        });

        let tagsTransactionPromise = trx("tags")
          .then((dbTags) => {
            let tagsInsertPromiseArray = [];
            tags.forEach((tagName) => {
              if (!dbTags.find((dbTag) => dbTag.name === tagName)) {
                tagsInsertPromiseArray.push(
                  trx("tags").insert({ name: tagName })
                );
              }
            });
            return Promise.all(tagsInsertPromiseArray);
          })
          .then(() => {
            return trx("page_tags")
              .where("page_id", id)
              .del()
              .then(() => {
                let pageTagsInsertPromiseArray = tags.map((tagName) => {
                  return trx("tags")
                    .where("name", tagName)
                    .then((dbTagsArray) => {
                      return trx("page_tags").insert({
                        page_id: id,
                        tag_id: dbTagsArray[0].id,
                      });
                    });
                });
                return Promise.all(pageTagsInsertPromiseArray);
              });
          });

        return Promise.all([
          pageTransactionPromise,
          editHistoryTransactionPromise,
          tagsTransactionPromise,
        ]);
      })
      .then((inserts) => {
        removePageLock(lock);
        return res.status(201).json({ message: "Your page was updated." });
      })
      .catch((err) => {
        console.log(err);
        return res
          .status(500)
          .json({ message: "There was an error updating this page!" });
      });
  } else {
    return res.status(401).json({ message: "Invalid lock, page not updated." });
  }
});

// Deletes page
server.delete("/pages/:id", (req, res) => {
  knex("pages")
    .where("id", req.params.id)
    .del()
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      console.error(err);
      res.status(202).json({
        Error: `Unable to delete event: ${req.params.id}. Error: ${err}`,
      });
    });
});

//Requests permission to edit the page, does not access database.
server.post("/pages/:id/edit-request", (req, res) => {
  if (req.body && req.body.id === req.params.id) {
    const { id, token, timestamp } = req.body;
    let found = activePageLocks.find(
      (pageLock) =>
        token === pageLock.token &&
        id === pageLock.id &&
        timestamp === pageLock.timestamp
    );
    if (found) {
      //Found a valid lock, stop execution and send it back.
      return res
        .status(200)
        .send({ message: "Edit access granted", lock: found });
    }
  }
  //No valid user authentication found, proceeding to check for new requests:
  let lock = activePageLocks.find((pageLock) => pageLock.id === req.params.id);
  if (lock) {
    return res.status(423).send({ message: "Access denied, resource locked" });
  } else {
    let token = Math.floor(Math.random() * 10000);
    let newLock = { id: req.params.id, token: token, timestamp: Date.now() };
    activePageLocks.push(newLock);
    res.status(201).send({ message: "Edit access granted", lock: newLock });
    //Delete lock after 1 hour
    setTimeout(removePageLock, millisecondsToEditPage, newLock);
  }
});

//User has finished editing the page
server.delete("/pages/:id/edit-request", (req, res) => {
  if (req.body && req.body.id === req.params.id) {
    removePageLock(req.body);
    return res.status(200).send({ message: "Lock removed" });
  } else {
    return res
      .status(403)
      .send({ message: "No request body, cannot authenticate." });
  }
});

// Gets the history of a page
server.get("/pages/:id/history", (req, res) => {
  knex("edit_history AS e")
    .select(
      "e.id",
      "e.user_id",
      "e.page_id",
      "e.body",
      "e.created_at",
      "e.comment",
      "u.email",
      "u.first_name",
      "u.last_name",
      "u.is_admin"
    )
    .leftJoin("users AS u", "e.user_id", "u.id")
    .where("page_id", req.params.id)
    .orderBy("e.created_at", "desc")
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      console.error(err);
      res.status(404).json({
        message: `Page ${req.params.id} does not have a history. Error: ${err}`,
      });
    });
});

// Gets all users edits
server.get("/users/:id/history", (req, res) => {
  knex("edit_history AS e")
    .select(
      "e.id",
      "e.user_id",
      "e.page_id",
      "e.body",
      "e.created_at",
      "e.updated_at",
      "e.comment",
      "u.email",
      "u.first_name",
      "u.last_name",
      "u.is_admin"
    )
    .leftJoin("users AS u", "e.user_id", "u.id")
    .where("user_id", req.params.id)
    .orderBy("e.created_at", "desc")
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      console.error(err);
      res.status(404).json({
        message: `Page ${req.params.id} does not have a history. Error: ${err}`,
      });
    });
});

// Gets a single iteration of a page from the edit history
server.get("/pages/:id/history/:edit_id", (req, res) => {
  knex("edit_history AS e")
    .select(
      "e.id",
      "e.user_id",
      "e.page_id",
      "e.body",
      "e.created_at",
      "e.comment",
      "u.email",
      "u.first_name",
      "u.last_name",
      "u.is_admin",
      "p.title"
    )
    .innerJoin("pages AS p", "e.page_id", "=", "p.id")
    .leftJoin("users AS u", "e.user_id", "u.id")
    .where("e.id", req.params.edit_id)
    .andWhere("e.page_id", req.params.id)
    .then((data) => {
      if (data.length === 1) {
        res.status(200).json(data);
      } else {
        throw new Error(
          `History entry ${req.params.edit_id} does not match page ${req.params.id}`
        );
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(404).json({
        message: `${err}`,
      });
    });
});

// Gets a single iteration of a users edit history
server.get("/users/:id/history/:edit_id", (req, res) => {
  knex("edit_history AS e")
    .select(
      "e.id",
      "e.user_id",
      "e.page_id",
      "e.body",
      "e.created_at",
      "e.updated_at",
      "e.comment",
      "u.email",
      "u.first_name",
      "u.last_name",
      "u.is_admin",
      "p.title"
    )
    .innerJoin("pages AS p", "e.page_id", "=", "p.id")
    .leftJoin("users AS u", "e.user_id", "u.id")
    .where("e.id", req.params.edit_id)
    .andWhere("u.id", req.params.id)
    .then((data) => {
      if (data.length === 1) {
        res.status(200).json(data);
      } else {
        throw new Error(
          `History entry ${req.params.edit_id} does not match page ${req.params.id}`
        );
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(404).json({
        message: `${err}`,
      });
    });
});

server.post("/login", async (req, res) => {
  const { email } = req.body;
  const user = await knex
    .from("users")
    .select("*")
    .where("email", email)
    .then((data) => {
      // check to see if there is exactly one user fitting this email.
      if (data.length > 0) {
        return res.status(201).json(data);
      } else {
        res.status(404).json({ message: `No such user with email ${email}` });
      }
    });
});

// Register
server.post("/register", (req, res) => {
  const { email, first_name, last_name } = req.body;
  knex("users")
    .insert({ email, first_name, last_name })
    .returning([
      "id",
      "email",
      "first_name",
      "last_name",
      "is_admin",
      "password_hash",
    ])
    .then((userData) => {
      return res.status(201).send(userData);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ message: `Could not create user: ${err}` });
    });
});

// Retrieves all tags
server.get("/tags", (req, res) => {
  knex("tags")
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      console.error(err);
      res.status(404).json({ Error: `There was an error retrieving tags` });
    });
});

// Searches tags and returns results -- TODO
server.get("/tags", (req, res) => {
  let response = [];

  knex("tags").then((data) => {
    data.filter((tag) => {
      if (tag.name === req.query.name) {
        console.log("tag.name: ", tag.name);
        console.log(req.query.name);
        console.log("adding to tags response array");
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
// Forum_threads
server.get("/forum", (req, res) => {
  knex("forum_threads")
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      console.error(err);
      res.status(404).json({
        Error:
          "The forums cannot be retrieved right now. Please try again later.",
      });
    });
});

server.post("/forum", (req, res) => {
  const body = req.body;
  knex("forum_threads")
    .insert(body)
    .then(() =>
      res
        .status(201)
        .json({ message: `You've successfully added ${body.name}` })
    )
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        message: `Forum cannot be added right now. Please try again later. Error: ${err}`,
      });
    });
});
server.get("/forum/:id", (req, res) => {
  const input = req.params.id;
  knex("forum_threads")
    .where("id", input)
    .then((data) => {
      if (data.length > 0) {
        res.status(200).json(data);
      } else {
        res.status(404).json({ message: `Forum not found at id: ${input}.` });
      }
    })
    .catch((err) => res.status(500).json({ message: `Error: ${err}` }));
});

server.delete("/forum/:id", (req, res) => {
  const body = req.body;
  const queryValue = req.params.id;
  knex("forum_threads")
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

server.put("/forum/:id", (req, res) => {
  const { page_id, name } = req.body;
  let queryValue = req.params.id;
  knex("forum_threads")
    .where("id", queryValue)
    .update({ page_id, name })
    .then(() => res.status(201).json({ message: "You've updated the forum." }))
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        message:
          "There was an error updating the forum, please try again later.",
      });
    });
});

// Forum comments
// Are these :id's supposed to be the forum:id or the comments id?
server.get("/forum/comment/:id", (req, res) => {
  const input = req.params.id;
  knex("forum_threads")
    .where("id", input)
    .then((data) => {
      if (data.length > 0) {
        res.status(200).json(data);
      } else {
        res.status(404).json({ message: `Forum not found at id: ${input}.` });
      }
    });
});

server.put("/forum/comment/:id", (req, res) => {
  const { page_id, name } = req.body;
  let queryValue = req.params.id;
  knex("forum_threads")
    .where("id", queryValue)
    .update({ page_id, name })
    .then(() => res.status(201).json({ message: "You've updated the forum." }))
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        message:
          "There was an error updating the forum, please try again later.",
      });
    });
});
server.post("/forum/comment/:id", (req, res) => {
  const { user_id, body } = req.body;
  let queryValue = req.params.id;
  knex("forum_threads")
    .where("id", queryValue)
    .insert({ user_id: 2, body })
    .then(() =>
      res.status(201).json({ message: "You've posted to the forum." })
    )
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        message:
          "There was an error posting to the forum, please try again later.",
      });
    });
});

server.get("/forum/:id/comments", (req, res) => {
  const input = req.params.id;
  knex("forum_comments AS c")
    .select(
      "c.id",
      "c.user_id",
      "c.forum_id",
      "c.body",
      "c.created_at",
      "c.updated_at",
      "c.replies_to",
      "u.email",
      "u.last_name",
      "u.is_admin"
    )
    .leftJoin("users AS u", "c.user_id", "u.id")
    .where("forum_id", input)
    .then((data) => {
      if (data.length > 0) {
        res.status(200).json(data);
      }
    })
    .catch((err) => res.status(404).json({ message: `Error: ${err}` }));
});

// Where would the corelation between the user that's posting. ✅context already setup to handle logged in user✅
server.post("/forum/:id/comments", (req, res) => {
  const { user_id, body, replies_to } = req.body;
  let threadId = req.params.id;
  knex("forum_comments")
    .insert({ user_id: user_id, forum_id: threadId, body, replies_to })
    .then(() =>
      res.status(201).json({ message: "You've posted to the forum." })
    )
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        message:
          "There was an error posting to the forum, please try again later.",
      });
    });
});

server.delete("/forum/comment/:id", (req, res) => {
  const body = req.body;
  const queryValue = req.params.id;
  knex("forum_threads")
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

// User edits
server.get("/", (req, res) => {
  const input = req.params.id;
  knex("forum_threads")
    .where("id", input)
    .then((data) => {
      if (data.length > 0) {
        res.status(200).json(data);
      } else {
        res.status(404).json({ message: `Forum not found at id: ${input}.` });
      }
    })
    .catch((err) => res.status(500).json({ message: `Error: ${err}` }));
});

module.exports = server;
