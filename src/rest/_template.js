
const Router = require('@koa/router');
const templateService = require('../service/template.js');

const getAllTemplates = async (ctx) => {
  const templates = await templateService.getAll(
    ctx.query.limit && Number(ctx.query.limit),
    ctx.query.offset && Number(ctx.query.offset),
  );
  ctx.body = templates;
};

const getAllTemplatesByRol = async (ctx) => {
  const templates = await templateService.getAllByRolNaam(
    ctx.params.naam
  );
  ctx.body = templates;
};


const getIsVisible = async (ctx) => {
  const templates = await templateService.getIsVisible(
    ctx.params.naam, ctx.params.id
  );
  ctx.body = templates;
};



/**
 * Install categorie routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
 module.exports = function installCategorieRoutes(app) {
  const router = new Router({
    prefix: '/templates',
  });

  router.get('/', getAllTemplates);
  router.get('/rol/:naam', getAllTemplatesByRol);
  router.get('/rol/:naam/categorie/:id', getIsVisible);

  app
    .use(router.routes())
    .use(router.allowedMethods());
  };