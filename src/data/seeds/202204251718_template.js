const { tables } = require('..');

module.exports = {
  seed: async (knex) => {
    // first delete all entries
    await knex(tables.template).delete();
    
    await knex(tables.template).insert([
      {
        id: '1',
        category_id: '1',
        rol : 'Manager',
        is_visible : '1'
      },
      {
        id: '2',
        category_id: '2',
        rol : 'Manager',
        is_visible : '1'
      }
    ]);
  },
};