const forum_comments = require("../random_data/forum_comments.json");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("forum_comments").del();

  await knex("forum_comments").insert(forum_comments);
};
