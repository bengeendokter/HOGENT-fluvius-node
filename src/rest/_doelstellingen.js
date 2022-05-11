
const Router = require('@koa/router');
const doelstellingService = require('../service/doelstelling.js');
const { requireAuthentication} = require('../core/auth.js');

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


const getDoelstellingByCategorieId = async (ctx) => {
  const doelstellingen = await doelstellingService.getByCategorieId(ctx.params.id);
  ctx.body = doelstellingen;
};

const getDoelstellingByCategorieIdAndRol = async (ctx) => {
  const doelstellingen = await doelstellingService.getByCategorieIdAndRol(ctx.params.id, ctx.params.naam);
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

  router.get('/',requireAuthentication, getAlldoelstellingen);
  router.get('/rol/:naam',requireAuthentication, getDoelstellingByRolId);
  router.get('/categorie/:id',requireAuthentication, getDoelstellingByCategorieId);
  router.get('/categorie/:id/rol/:naam',requireAuthentication, getDoelstellingByCategorieIdAndRol);

  app
    .use(router.routes())
    .use(router.allowedMethods());
  };