
const Router = require('@koa/router');
const { getLogger } = require('../core/logging.js');
const sdgService = require('../service/sdg.js');

const getAllSdgs = async (ctx) => {
  const sdgs = await sdgService.getAll(
    ctx.query.limit && Number(ctx.query.limit),
    ctx.query.offset && Number(ctx.query.offset),
  );
  ctx.body = sdgs;
};

const getSdgsByCategorieId = async (ctx) => {
  const sdgs = await sdgService.getByCategorieId(ctx.params.id);
  ctx.body = sdgs;
};


/**
 * Install sdg routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
 module.exports = function installSdgRoutes(app) {
  const router = new Router({
    prefix: '/sdgs',
  });

  router.get('/', getAllSdgs);
  router.get('/categorie/:id',getSdgsByCategorieId);

  app
    .use(router.routes())
    .use(router.allowedMethods());
  };