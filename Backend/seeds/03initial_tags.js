const tags = require("../random_data/tags.json");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("tags").del();
  await knex("tags").insert(tags);
};
