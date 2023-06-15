/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {};
return knex.schema.createTable("pages", (table) => {
  table.increments("id");
  table.string("title");
  table.string("body");
  table.timestamps(true, true);
});
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("pages");
};
