const page_tags = require("../random_data/page_tags.json");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("page_tags").del();
  await knex("page_tags").insert(page_tags);
};
