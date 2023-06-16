const forum_threads = require("../random_data/forum_threads.json");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("forum_threads").del();
  await knex("forum_threads").insert(forum_threads);
};
