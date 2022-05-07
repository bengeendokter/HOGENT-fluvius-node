
const { tables  } = require('../../src/data');
const { withServer, login } = require('../supertest.setup.js');

const data = {
	categories: [{
		CATEGORIEID: 1,
		ICON: 'file:src/images/peace.png',
		NAAM: 'Sociaal',
	},
	{
		CATEGORIEID: 2,
		ICON: 'file:src/images/people.png',
		NAAM: 'Economie',
	},
	{
		CATEGORIEID: 3,
		ICON: 'file:src/images/planet.png',
		NAAM: 'Ecologie',
	},
  {
		CATEGORIEID: 4,
		ICON: 'file:src/images/planet.png',
		NAAM: 'Omgeving',
	},]
  
}

const dataToDelete = {
	categories: [
		'1',
		'2',
		'3',
    '4',
	],
}

describe('categories', ()=>{
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


	const url = '/api/categories';

  describe('GET /api/categories', () => {

    beforeAll(async () => {
	
			await knex(tables.categorie).insert(data.categories);
		});

    afterAll(async () => {
			await knex(tables.categorie).whereIn('CATEGORIEID', dataToDelete.categories).delete();
		});
		
   test('should 200 and return all transactions', async () => {
			const response = await request.get(url).set('Authorization', loginHeader);
			expect(response.status).toBe(200);
			expect(response.body.limit).toBe(100);
			expect(response.body.offset).toBe(0);
			expect(response.body.data.length).toBe(4);
    });
			
		test('it should 200 and paginate the list of transactions', async () => {
      const response = await request.get(`${url}?limit=2&offset=1`).set('Authorization', loginHeader);
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
      expect(response.body.limit).toBe(2);
      expect(response.body.offset).toBe(1);
      expect(response.body.data[0]).toEqual({
				CATEGORIEID: 2,
				ICON: 'file:src/images/people.png',
				NAAM: 'Economie',
			});
      expect(response.body.data[1]).toEqual(	{
				CATEGORIEID: 3,
				ICON: 'file:src/images/planet.png',
				NAAM: 'Ecologie',
			});
    });
  });
			
	describe('GET /api/categories/:id', () => {
			beforeAll(async () => {
	
				await knex(tables.categorie).insert(data.categories);
			});
	
			afterAll(async () => {
				await knex(tables.categorie).whereIn('CATEGORIEID', dataToDelete.categories).delete();
			});


			test('it should 200 and return the requested transaction', async () => {
				const response = await request.get(`${url}/${1}`).set('Authorization', loginHeader);
	
				expect(response.status).toBe(200);
				expect(response.body[0]).toEqual({
					CATEGORIEID: 1,
					ICON: 'file:src/images/peace.png',
					NAAM: 'Sociaal',
				});

		});
	});

	});
