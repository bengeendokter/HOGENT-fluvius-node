const supertest = require('supertest');
const createServer = require('../../src/createServer');
const { getKnex, tables  } = require('../../src/data');

//TODO add bewerkingen

const data = {
	mvodoelstellingen: [{
		DOELSTELLINGID: 1,
		Soort: 'COMP',
		DOELWAARDE: 0,
    ICON: 'file:src/images/planet.jpg',
    JAAR: 2020,
    NAAM: 'CO2-uitstoot transport',
    PARENTCOMPONENT_DOELSTELLINGID: null,
    SDGOAL_idSDG: null,
    FORMULE_ID: 1,
    DATASOURCE_DATASOURCEID: null,
	},
	{
		DOELSTELLINGID: 2,
		Soort: 'LEAF',
		DOELWAARDE: 50,
    ICON: 'file:src/images/planet.jpg',
    JAAR: 2020,
    NAAM: 'CO2 vrachtwagens',
    PARENTCOMPONENT_DOELSTELLINGID: 1,
    SDGOAL_idSDG: null,
    FORMULE_ID: 1,
    DATASOURCE_DATASOURCEID: null,
	},
	{
    DOELSTELLINGID: 3,
		Soort: 'LEAF',
		DOELWAARDE: 40,
    ICON: 'file:src/images/planet.jpg',
    JAAR: 2020,
    NAAM: 'CO2 camionette',
    PARENTCOMPONENT_DOELSTELLINGID: 1,
    SDGOAL_idSDG: null,
    FORMULE_ID: 2,
    DATASOURCE_DATASOURCEID: null,
	},
  {
    DOELSTELLINGID: 4,
		Soort: 'LEAF',
		DOELWAARDE: 30,
    ICON: 'file:src/images/peace.png',
    JAAR: 2020,
    NAAM: 'Aantal klanten klachten',
    PARENTCOMPONENT_DOELSTELLINGID: null,
    SDGOAL_idSDG: null,
    FORMULE_ID: 1,
    DATASOURCE_DATASOURCEID: null,
	},]
  
}

const dataToDelete = {
	mvodoelstellingen: [
		'1',
		'2',
		'3',
    '4',
	],
}

//router.get('/', getAlldoelstellingen);
//router.get('/rol/:naam', getDoelstellingByRolId);
//router.get('/categorie/:id', getDoelstellingByCategorieId);
//router.get('/categorie/:id/rol/:naam', getDoelstellingByCategorieIdAndRol);

describe('mvodoelstellingen', ()=>{
    let server;
    let request;
    let knex;

    beforeAll(async () => {
      server = await createServer();
      request = supertest(server.getApp().callback());
      knex = getKnex();
    })

    
    afterAll(async () => {
      await server.stop();
    });
    

    const url = '/api/doelstellingen';

    describe('GET /api/doelstellingen', () => {
        beforeAll(async () => {
    
          await knex(tables.doelstelling).insert(data.mvodoelstellingen);
        });
    
        afterAll(async () => {
          await knex(tables.doelstelling).whereIn('DOELSTELLINGID', dataToDelete.mvodoelstellingen).delete();
        });

        test('should 200 and return all transactions', async () => {
          const response = await request.get(url);
          expect(response.status).toBe(200);
          expect(response.body.limit).toBe(100);
          expect(response.body.offset).toBe(0);
          expect(response.body.data.length).toBe(4);
        });

    });
	});