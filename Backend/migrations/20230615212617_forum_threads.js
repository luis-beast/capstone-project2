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
    table.timestamp(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
