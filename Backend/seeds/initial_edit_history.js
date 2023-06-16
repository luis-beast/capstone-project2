const edit_history = require("../random_data/edit_history.json");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("edit_history").del();
  await knex("edit_history").insert(edit_history);
};
