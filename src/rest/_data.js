
const Router = require('@koa/router');
const dataService = require('../service/data.js');
const { requireAuthentication} = require('../core/auth.js');

const getAllData = async (ctx) => {
  const data = await dataService.getAll(
    ctx.query.limit && Number(ctx.query.limit),
    ctx.query.offset && Number(ctx.query.offset),
  );
  ctx.body = data;
};

const getDataByDoelstellingId = async (ctx) => {
  const data = await dataService.getByDoelstellingId(ctx.params.id);
  ctx.body = data;
};

const getDataByDoelstellingIdAndYear = async (ctx) => {
  const data = await dataService.getByDoelstellingIdAndYear(ctx.params.id,ctx.params.jaar);
  ctx.body = data;
};

const getAllDataByDoelstellingId = async (ctx) => {
  const data = await dataService.getAllByDoelstellingId(ctx.params.id);
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
  router.get('/doelstelling/:id', getDataByDoelstellingId);
  router.get('/doelstelling/:id/:jaar', getDataByDoelstellingIdAndYear);
  router.get('/all/doelstelling/:id',requireAuthentication, getAllDataByDoelstellingId);

  app
    .use(router.routes())
    .use(router.allowedMethods());
  };