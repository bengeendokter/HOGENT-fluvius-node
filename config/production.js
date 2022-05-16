module.exports = {
	log: {
		level: 'info',
		disabled: false,
	},

	cors: {
		origins: ['http://localhost:3000'],
		maxAge: 3 * 60 * 60,
	},
	database: {
    client: 'mysql2',
    host: 'ID372119_g10.db.webhosting.be',
    port: 3306,
    name: 'ID372119_g10',
  },
	pagination: {
    limit: 100,
    offset: 0,
  },
	auth: {
		argon: {
			saltLength: 16,
			hashLength: 32,
			timeCost: 3,
			memoryCost: 64 * 1024
		},
    jwt: {
      secret: 'eenveeltemoeilijksecretdatniemandooitzalradenandersisdesitegehacked',
      expirationInterval: 60 * 60 * 1000, // ms (1 hour)
      issuer: 'mvo.fluvius.be',
      audience: 'mvo.fluvius.be',
    },
	}
};