/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("page_tags", (table) => {
    table.increments("id");
    table.integer("tag_id");
    table.foreign("tag_id").references("tags.id");
    table.integer("page_id");
    table.foreign("page_id").references("pages.id");
    table.timestamps();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .alterTable("page_tags", (table) => {
      table.dropForeign("page_id");
    })
    .alterTable("page_tags", (table) => {
      table.dropForeign("tag_id");
    })
    .then(function () {
      return knex.schema.dropTableIfExists("page_tags");
    });
};
