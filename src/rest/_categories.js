
const Router = require('@koa/router');
const categorieService = require('../service/categorie.js');

const getAllCategories = async (ctx) => {
  const categories = await categorieService.getAll(
    ctx.query.limit && Number(ctx.query.limit),
    ctx.query.offset && Number(ctx.query.offset),
  );
  ctx.body = categories;
};

/**
 * Install categorie routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
 module.exports = function installCategorieRoutes(app) {
  const router = new Router({
    prefix: '/categories',
  });

  router.get('/', getAllCategories);

  app
    .use(router.routes())
    .use(router.allowedMethods());
  };