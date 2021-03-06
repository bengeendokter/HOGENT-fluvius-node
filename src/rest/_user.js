
const Router = require('@koa/router');
const userService = require('../service/user.js');
const { requireAuthentication, makeRequireRole } = require('../core/auth.js');
const Role = require('../core/roles.js');

const getAllUsers = async (ctx) => {
  const users = await userService.getAll(
    ctx.query.limit && Number(ctx.query.limit),
    ctx.query.offset && Number(ctx.query.offset),
  );
  ctx.body = users;
};

const getUserById = async (ctx) => {
  const user = await userService.getById(
    ctx.params.id
  );
  ctx.body = user;
};

const login = async (ctx) => {
  const {GEBRUIKERSNAAM,WACHTWOORD} = ctx.request.body;
  const response = await userService.login(
    GEBRUIKERSNAAM,
    WACHTWOORD
  );
  ctx.body = response;
};


/**
 * Install categorie routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
 module.exports = function installCategorieRoutes(app) {
  const router = new Router({
    prefix: '/users',
  });

  const requireMvoCoordinator = makeRequireRole(Role.MVOCOORDINATOR);

  router.post('/login', login);

  router.get('/',requireAuthentication,requireMvoCoordinator,  getAllUsers);
  router.get('/:id',requireAuthentication,requireMvoCoordinator,  getUserById);

  app
    .use(router.routes())
    .use(router.allowedMethods());
  };