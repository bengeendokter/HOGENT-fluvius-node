const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.alterTable(tables.template, (table) => {
      table.integer('order');
      table.boolean('is_costumisable');
    })
  },
  down: (knex) => {
    return knex.schema.alterTable(tables.template, (table) => {
      table.dropColumn('order');
      table.dropColumn('is_costumisable');
    })
  },
};