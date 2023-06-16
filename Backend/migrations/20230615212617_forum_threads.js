/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("forum_threads", (table) => {
    table.increments("id");
    table.integer("page_id");
    table.foreign("page_id").references("pages.id");
    table.string("name");
    table.timestamps();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .alterTable("forum_threads", (table) => {
      table.dropForeign("page_id");
    })
    .then(function () {
      return knex.schema.dropTableIfExists("forum_threads");
    });
};
