const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.alterTable(tables.template, (table) => {
      table.dropPrimary()
      table.primary('id')
    })
  },
  down: (knex) => {
    return knex.schema.alterTable(tables.template, (table) => {
      table.dropPrimary()
      table.primary(['id','category_id','rol'])
    })
  },
};