
const Router = require('@koa/router');
const datasourceService = require('../service/datasource.js');

const getAlldatasources = async (ctx) => {
  const datasources = await datasourceService.getAll(
    ctx.query.limit && Number(ctx.query.limit),
    ctx.query.offset && Number(ctx.query.offset),
  );
  ctx.body = datasources;
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

  router.get('/', getAlldatasources);

  app
    .use(router.routes())
    .use(router.allowedMethods());
  };