const { shutdownData, getKnex, tables } = require('../src/data');

module.exports = async () => {
  // Remove any leftover data
  await getKnex()(tables.user).delete();
  await getKnex()(tables.template).delete();
  await getKnex()(tables.formule).delete();
  await getKnex()(tables.datasource).delete();
  await getKnex()(tables.categorie).delete();
  await getKnex()(tables.doelstelling).delete();
  await getKnex()(tables.sdg).delete();

  // Close database connection
  await shutdownData();
};