
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

const createTemplate = async (ctx) => {
  console.log(ctx.request.body);
	const newTemplate = await templateService.create({
		...ctx.request.body
	});
	ctx.body = newTemplate;
	ctx.status=201;
};

const updateTemplate = async (ctx) => {
	ctx.body = await templateService.updateById(ctx.params.id, {
		...ctx.request.body
	});
};

const deleteTemplate = async (ctx) => {
	await templateService.deleteById(ctx.params.id);
	ctx.status = 204;
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
  router.post('/', createTemplate);
  router.put('/:id', updateTemplate);
  router.delete('/:id', deleteTemplate);

  app
    .use(router.routes())
    .use(router.allowedMethods());
  };