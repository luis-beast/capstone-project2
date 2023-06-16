/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("edit_history", (table) => {
    table.increments("id");
    table.string("user_id");
    table.foreign("user_id").references("users.id");
    table.string("page_id");
    table.foreign("page_id").references("pages.id");
    table.string("body");
    table.string("comment");
    table.timestamp(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .alterTable("edit_history", (table) => {
      table.dropForeign("page_id");
    })
    .alterTable("edit_history", (table) => {
      table.dropForeign("user_id");
    })
    .then(function () {
      return knex.schema.dropTableIfExists("edit_history");
    });
};
dsfg;
