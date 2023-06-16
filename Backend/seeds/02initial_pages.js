const pages = require("../random_data/pages.json");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("pages").del();
  await knex("pages").insert(pages);
};
