/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  table.increments("id");
  table.string("body");
  table.string("comment");
  table.timestamp(true, true);
  //   Add in foreign keys for user_id and page_id
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
