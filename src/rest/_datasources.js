
const Router = require('@koa/router');
const datasourceService = require('../service/datasource.js');
const { requireAuthentication} = require('../core/auth.js');

const getAlldatasources = async (ctx) => {
  const datasources = await datasourceService.getAll(
    ctx.query.limit && Number(ctx.query.limit),
    ctx.query.offset && Number(ctx.query.offset),
  );
  ctx.body = datasources;
};


const updateDatasource = async (ctx) => {
	ctx.body = await datasourceService.updateById(ctx.params.id, {
		...ctx.request.body
	}
	);
};


/**
 * Install datasource routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
 module.exports = function installdatasourceRoutes(app) {
  const router = new Router({
    prefix: '/datasources',
  });

  router.get('/',requireAuthentication, getAlldatasources);
  router.put('/:id',requireAuthentication, updateDatasource);

  app
    .use(router.routes())
    .use(router.allowedMethods());
  };