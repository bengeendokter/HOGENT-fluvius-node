const { tables  } = require('../../src/data');
const { withServer, login } = require('../supertest.setup.js');

//TODO add bewerkingen

const data = {
	mvodoelstellingen: [{
		DOELSTELLINGID: 1,
		Soort: 'COMP',
		DOELWAARDE: 0,
    ISMAX: true,
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
    ISMAX: true,
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
    ISMAX: true,
    ICON: 'file:src/images/planet.jpg',
    JAAR: 2020,
    NAAM: 'CO2 camionette',
    PARENTCOMPONENT_DOELSTELLINGID: null,
    SDGOAL_idSDG: 1,
    FORMULE_ID: 2,
    DATASOURCE_DATASOURCEID: null,
	},
  {
    DOELSTELLINGID: 4,
		Soort: 'LEAF',
		DOELWAARDE: 30,
    ISMAX: false,
    ICON: 'file:src/images/peace.png',
    JAAR: 2020,
    NAAM: 'Aantal klanten klachten',
    PARENTCOMPONENT_DOELSTELLINGID: null,
    SDGOAL_idSDG: 1,
    FORMULE_ID: 1,
    DATASOURCE_DATASOURCEID: null,
	},]
  
  ,bewerkingen:[
    {
      ID : 1,
      Soort : 'AVG'
    },
    {
      ID : 2,
      Soort : 'SOM'
    }
  ],
  
  doelstelling_rollen : [
    {
      Component_DOELSTELLINGID : "4",
      rollen_NAAM : 'MANAGER'
    }
  ],
   
  sdgs : [
    {
      idSDG : 1,
      AFBEELDINGNAAM : 9,
      ICON: "file:src/images/9.jpg",
      NAAM:'Industrie, innovatie en infrastructuur',
      PARENTSDG_idSDG: null,
      CATID: 1,
    }
  ],

  categories : [
    {
      CATEGORIEID : 1,
      ICON : 'file:src/images/peace.png',
      NAAM : 'Economie'
    }
  ]
}


const dataToDelete = {
	mvodoelstellingen: [
		'1',
		'2',
		'3',
    '4',
	],
  bewerkingen: [
		'1',
		'2',
	],
  rollen : [
    'MANAGER'
  ],
  sdgs : [
    '1'
  ],
  categories : [
    1
  ]
}


describe('mvodoelstellingen', ()=>{
  let request;
	let knex;
	let loginHeader;

	withServer(({ knex: k, supertest:s }) => {
		knex = k;
		request = s;
	});

	beforeAll(async () => {
		loginHeader = await login(request);
	})

    const url = '/api/doelstellingen';

    describe('GET /api/doelstellingen', () => {
        beforeAll(async () => {
          await knex(tables.formule).insert(data.bewerkingen);
          await knex(tables.doelstelling).insert(data.mvodoelstellingen);
        });
    
        afterAll(async () => {
          await knex(tables.doelstelling).whereIn('DOELSTELLINGID', dataToDelete.mvodoelstellingen).delete();
          await knex(tables.formule).whereIn('ID', dataToDelete.bewerkingen).delete();
        });

        test('should 200 and return all doelstellingen', async () => {
          const response = await request.get(url).set('Authorization', loginHeader);
          expect(response.status).toBe(200);
          expect(response.body.limit).toBe(100);
          expect(response.body.offset).toBe(0);
          expect(response.body.data.length).toBe(3);
        });

        test('it should 200 and paginate the list of doelstellingen', async () => {
          const response = await request.get(`${url}?limit=1&offset=3`).set('Authorization', loginHeader);
          expect(response.status).toBe(200);
          expect(response.body.data.length).toBe(1);
          expect(response.body.limit).toBe(1);
          expect(response.body.offset).toBe(3);
          expect(response.body.data[0]).toEqual({
              id: 4,
              soort: 'LEAF',
              doelwaarde: 30,
              isMax: false,
              icon: 'file:src/images/peace.png',
              jaar: 2020,
              naam: 'Aantal klanten klachten',
              parent_doelstelling: { id: null },
              sdg_goal: { id: 1 },
              formule: { id: 1, naam: 'AVG' },
              categorie: { id: null, naam: null },
              datasource: { id: null }
            
          });
        });
    });
    		
    
      describe('GET /api/rol/:naam', () => {
        beforeAll(async () => {
          await knex(tables.doelstelling_rol).insert(data.doelstelling_rollen);
          await knex(tables.formule).insert(data.bewerkingen);
          await knex(tables.doelstelling).insert(data.mvodoelstellingen);
        });

        afterAll(async () => {
          await knex(tables.doelstelling_rol).whereIn('rollen_NAAM', dataToDelete.rollen).delete();
          await knex(tables.doelstelling).whereIn('DOELSTELLINGID', dataToDelete.mvodoelstellingen).delete();
          await knex(tables.formule).whereIn('ID', dataToDelete.bewerkingen).delete();
        });



        test('it should 200 and return the requested doelstellingen', async () => {
          const response = await request.get(`${url}/rol/${'Manager'}`).set('Authorization', loginHeader);

          expect(response.status).toBe(200);
          expect(response.body[0]).toEqual({
            id: 4,
            soort: 'LEAF',
            doelwaarde: 30,
            isMax: false,
            icon: 'file:src/images/peace.png',
            jaar: 2020,
            naam: 'Aantal klanten klachten',
            parent_doelstelling: { id: null },
            sdg_goal: { id: 1 },
            formule: { id: 1, naam: 'AVG' },
            categorie: { id: null, naam: null },
            datasource: { id: null }
          });
          

      });

      
    });

    describe('GET /api/categorie/:id', () => {
      beforeAll(async () => {
        await knex(tables.categorie).insert(data.categories);
        await knex(tables.sdg).insert(data.sdgs);
        await knex(tables.formule).insert(data.bewerkingen);
        await knex(tables.doelstelling).insert(data.mvodoelstellingen);
      });

      afterAll(async () => {
        await knex(tables.categorie).whereIn('CATEGORIEID', dataToDelete.categories).delete();
        await knex(tables.sdg).whereIn('idSDG', dataToDelete.sdgs).delete();
        await knex(tables.doelstelling).whereIn('DOELSTELLINGID', dataToDelete.mvodoelstellingen).delete();
        await knex(tables.formule).whereIn('ID', dataToDelete.bewerkingen).delete();
      });



      test('it should 200 and return the requested doelstellingen', async () => {
        const response = await request.get(`${url}/categorie/${'1'}`).set('Authorization', loginHeader);

        expect(response.status).toBe(200);
        expect(response.body[0]).toEqual({
              id: 4,
              soort: 'LEAF',
              doelwaarde: 30,
              isMax: false,
              icon: 'file:src/images/peace.png',
              jaar: 2020,
              naam: 'Aantal klanten klachten',
              parent_doelstelling: { id: null },
              sdg_goal: { id: 1 },
              formule: { id: 1, naam: 'AVG' },
              categorie: { id: 1, naam: 'Economie'  },
              datasource: { id: null }
        });
        expect(response.body[1]).toEqual({
          id: 3,
          soort: 'LEAF',
          doelwaarde: 40,
          isMax: true,
          icon: 'file:src/images/planet.jpg',
          jaar: 2020,
          naam: 'CO2 camionette',
          parent_doelstelling: { id: null },
          sdg_goal: { id: 1 },
          formule: { id: 2, naam: 'SOM' },
          categorie: { id: 1, naam: 'Economie'  },
          datasource: { id: null }
    });

    });

    });

    describe('GET /api/categorie/:id/rol/:naam', () => {
      beforeAll(async () => {
        await knex(tables.doelstelling_rol).insert(data.doelstelling_rollen);
        await knex(tables.categorie).insert(data.categories);
        await knex(tables.sdg).insert(data.sdgs);
        await knex(tables.formule).insert(data.bewerkingen);
        await knex(tables.doelstelling).insert(data.mvodoelstellingen);
      });

      afterAll(async () => {
        await knex(tables.doelstelling_rol).whereIn('rollen_NAAM', dataToDelete.rollen).delete();
        await knex(tables.categorie).whereIn('CATEGORIEID', dataToDelete.categories).delete();
        await knex(tables.sdg).whereIn('idSDG', dataToDelete.sdgs).delete();
        await knex(tables.doelstelling).whereIn('DOELSTELLINGID', dataToDelete.mvodoelstellingen).delete();
        await knex(tables.formule).whereIn('ID', dataToDelete.bewerkingen).delete();
      });



      test('it should 200 and return the requested doelstellingen', async () => {
        const response = await request.get(`${url}/categorie/${'1'}/rol/${'Manager'}`).set('Authorization', loginHeader);

        expect(response.status).toBe(200);
        expect(response.body[0]).toEqual({
              id: 4,
              soort: 'LEAF',
              doelwaarde: 30,
              isMax: false,
              icon: 'file:src/images/peace.png',
              jaar: 2020,
              naam: 'Aantal klanten klachten',
              parent_doelstelling: { id: null },
              sdg_goal: { id: 1 },
              formule: { id: 1, naam: 'AVG' },
              categorie: { id: 1, naam: 'Economie'  },
              datasource: { id: null }
        });
        
    });

    });

	});