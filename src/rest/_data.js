
const Router = require('@koa/router');
const dataService = require('../service/data.js');

const getAllData = async (ctx) => {
  const data = await dataService.getAll(
    ctx.query.limit && Number(ctx.query.limit),
    ctx.query.offset && Number(ctx.query.offset),
  );
  ctx.body = data;
};

/**
 * Install data routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
 module.exports = function installCategorieRoutes(app) {
  const router = new Router({
    prefix: '/data',
  });

  router.get('/', getAllData);

  app
    .use(router.routes())
    .use(router.allowedMethods());
  };