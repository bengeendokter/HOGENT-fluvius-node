
const Router = require('@koa/router');
const doelstellingService = require('../service/doelstelling.js');

const getAlldoelstellingen = async (ctx) => {
  const doelstellingen = await doelstellingService.getAll(
    ctx.query.limit && Number(ctx.query.limit),
    ctx.query.offset && Number(ctx.query.offset),
  );
  ctx.body = doelstellingen;
};

const getDoelstellingByRolId = async (ctx) => {
  const doelstellingen = await doelstellingService.getByRolNaam(ctx.params.naam);
  ctx.body = doelstellingen;
};


/**
 * Install doelstelling routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
 module.exports = function installCategorieRoutes(app) {
  const router = new Router({
    prefix: '/doelstellingen',
  });

  router.get('/', getAlldoelstellingen);
  router.get('/rol/:naam', getDoelstellingByRolId);

  app
    .use(router.routes())
    .use(router.allowedMethods());
  };