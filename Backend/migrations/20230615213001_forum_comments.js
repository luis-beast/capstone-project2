/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("forum_comments", (table) => {
    table.increments("id");
    table.integer("user_id");
    table
      .foreign("user_id")
      .references("users.id")
      .onUpdate("CASCADE")
      .onDelete("SET NULL");
    table.integer("forum_id");
    table
      .foreign("forum_id")
      .references("forum_threads.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.integer("replies_to");
    table
      .foreign("replies_to")
      .references("forum_comments.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table.text("body");
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .alterTable("forum_comments", (table) => {
      table.dropForeign("forum_id");
    })
    .alterTable("forum_comments", (table) => {
      table.dropForeign("user_id");
    })
    .then(function () {
      return knex.schema.dropTableIfExists("forum_comments");
    });
};
