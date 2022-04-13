
const Router = require('@koa/router');
const rollenService = require('../service/rol.js');

const getAllRollen = async (ctx) => {
  const rollen = await rollenService.getAll(
    ctx.query.limit && Number(ctx.query.limit),
    ctx.query.offset && Number(ctx.query.offset),
  );
  ctx.body = rollen;
};

/**
 * Install rol routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
 module.exports = function installRolRoutes(app) {
  const router = new Router({
    prefix: '/rollen',
  });

  router.get('/', getAllRollen);

  app
    .use(router.routes())
    .use(router.allowedMethods());
  };