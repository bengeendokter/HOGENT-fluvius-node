const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.template, (table) => {
      table.uuid('id');
        //.primary();

        table.integer('category_id')
        .notNullable();
      table.foreign('category_id', 'fk_template_categorie').references(`${tables.categorie}.CATEGORIEID`);
     // table.primary('category_id')
       table.string('rol', 255)
        .notNullable();
      table.foreign('rol', 'fk_template_rol').references(`${tables.rol}.NAAM`);
        table.primary(['id','category_id','rol']);
      table.boolean('is_visible').notNullable()
      .defaultTo(1);
       
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.template);
  },
};