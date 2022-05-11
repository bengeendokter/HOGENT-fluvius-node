
const config = require('config');

const { initializeData, getKnex, tables } = require('../src/data');
const { initializeLogger } = require('../src/core/logging');
const Role = require('../src/core/roles');

module.exports = async () => {
  // Create a database connection
  initializeLogger({
    level: config.get('log.level'),
    disabled: config.get('log.disabled'),
  });
  await initializeData();

  const knex = getKnex();
  // Insert test users with password 123456789
  await knex(tables.user).insert([{
    GEBRUIKERID: 1,
    GEBRUIKERSNAAM: 'User',
    ROL: Role.STAKEHOLDER,
    STATUS:
      "ACTIEF",
    WACHTWOORD: "$argon2id$v=19$m=65536,t=3,p=1$k+X+QvC0W53T8azFgugEVQ$Whrnh6r3lnJ//Y2KYGpHqUcJeMY8bSmTBkgYrHkdtRw",
  },
  {
    GEBRUIKERID: 2,
    GEBRUIKERSNAAM: 'Coordinator',
    ROL: Role.MVOCOORDINATOR,
    STATUS:
    'ACTIEF',
    WACHTWOORD: "$argon2id$v=19$m=65536,t=3,p=1$k+X+QvC0W53T8azFgugEVQ$Whrnh6r3lnJ//Y2KYGpHqUcJeMY8bSmTBkgYrHkdtRw",
  }]);
};