const Router = require('@koa/router');
const installCategorieRouter = require('./_categories.js');
const installSdgRouter = require('./_sdgs.js');
const installDoelstellingRouter = require('./_doelstellingen.js');
const installRollenRouter = require('./_rollen.js');
const installDatasourceRouter = require('./_datasources.js');
const installDataRouter = require('./_data.js');

/**
 * Install all routes in the given Koa application.
 *
 * @param {Koa} app - The Koa application.
 */
module.exports = (app) => {
	const router = new Router({
		prefix: '/api',
	});

	installCategorieRouter(router);
	installSdgRouter(router);
	installDoelstellingRouter(router);
	installRollenRouter(router);
	installDatasourceRouter(router);
	installDataRouter(router);

	app.use(router.routes()).use(router.allowedMethods());
};