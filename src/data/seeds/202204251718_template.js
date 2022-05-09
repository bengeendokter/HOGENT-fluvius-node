const { tables } = require("..");

module.exports = {
  seed: async (knex) => {
    // first delete all entries
    await knex(tables.template).delete();

    await knex(tables.template).insert([
      //Manager
      {
        id: "1",
        category_id: "1",
        rol: "Manager",
        is_visible: "1",
        is_costumisable: "1",
      },
      {
        id: "2",
        category_id: "2",
        rol: "Manager",
        is_visible: "1",
        is_costumisable: "1",
      },
      {
        id: "3",
        category_id: "3",
        rol: "Manager",
        is_visible: "1",
        is_costumisable: "1",
      },
      {
        id: "4",
        category_id: "4",
        rol: "Manager",
        is_visible: "1",
        is_costumisable: "1",
      },
      //Directie
      {
        id: "5",
        category_id: "1",
        rol: "Directie",
        is_visible: "1",
        is_costumisable: "1",
      },
      {
        id: "6",
        category_id: "2",
        rol: "Directie",
        is_visible: "1",
        is_costumisable: "1",
      },
      {
        id: "7",
        category_id: "3",
        rol: "Directie",
        is_visible: "1",
        is_costumisable: "1",
      },
      {
        id: "8",
        category_id: "4",
        rol: "Directie",
        is_visible: "1",
        is_costumisable: "1",
      },
      //MVO Coördinator
      {
        id: "9",
        category_id: "1",
        rol: "MVO Coördinator",
        is_visible: "1",
        is_costumisable: "1",
      },
      {
        id: "10",
        category_id: "2",
        rol: "MVO Coördinator",
        is_visible: "1",
        is_costumisable: "1",
      },
      {
        id: "11",
        category_id: "3",
        rol: "MVO Coördinator",
        is_visible: "1",
        is_costumisable: "1",
      },
      {
        id: "12",
        category_id: "4",
        rol: "MVO Coördinator",
        is_visible: "1",
        is_costumisable: "1",
      },
      //Stakeholder
      {
        id: "13",
        category_id: "1",
        rol: "Stakeholder",
        is_visible: "1",
        is_costumisable: "0",
      },
      {
        id: "14",
        category_id: "2",
        rol: "Stakeholder",
        is_visible: "1",
        is_costumisable: "0",
      },
      {
        id: "15",
        category_id: "3",
        rol: "Stakeholder",
        is_visible: "1",
        is_costumisable: "0",
      },
      {
        id: "16",
        category_id: "4",
        rol: "Stakeholder",
        is_visible: "1",
        is_costumisable: "0",
      },
    ]);
  },
};
