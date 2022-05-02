
const { getChildLogger } = require('../core/logging');
const userRepository = require('../repository/user.js');
const { verifyPassword, hashPassword } = require('../core/password');
const { generateJWT, verifyJWT } = require('../core/jwt');
const Role = require('../core/roles');
const ServiceError = require('../core/serviceError');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('user-service');
	this.logger.debug(message, meta);
};

/**
 * Get all `limit` user, skip the first `offset`.
 *
 * @param {number} [limit] - Nr of user to fetch.
 * @param {number} [offset] - Nr of user to skip.
 */
 const getAll = async (
  limit = 100,
  offset = 0,
) => {
  debugLog('Fetching all users', { limit, offset });
  const data = await userRepository.findAll({ limit, offset });
  const totalCount = await userRepository.findCount();
  return {
    data,
    count: totalCount,
    limit,
    offset,
  };
};

/**
 * Get the user with the given user id.
 *
 * @param {string} id - Id of the user to get.
 *
 * @throws {ServiceError} One of:
 * - NOT_FOUND: No user with the given user id could be found.
 */
 const getById = async (id) => {
  debugLog(`Fetching users with user id ${id}`);
  const user = await userRepository.findById(id);

  if (!user) {
    throw new Error(`No users with user id ${id} exists`, { id });
  }

  return user;
};


/**
 * Try to login a user with the given username and password.
 *
 * @param {string} name - The name to try.
 * @param {string} password - The password to try.
 *
 * @returns {Promise<object>} - Promise whichs resolves in an object containing the token and signed in user.
 */
 const login = async (name, password) => {
  const user = await userRepository.findByName(name);

  if (!user) {
    // DO NOT expose we don't know the user
    throw ServiceError.unauthorized('The given username and password do not match');
  }

  const passwordValid = await verifyPassword(password, user.WACHTWOORD);

  if (!passwordValid) {
    // DO NOT expose we know the user but an invalid password was given
    throw ServiceError.unauthorized('The given username and password do not match');
  }

  return await makeLoginData(user);
};

/**
 * Create the returned information after login.
 */
 const makeLoginData = async (user) => {
  const token = await generateJWT(user);

  return {
    user: makeExposedUser(user),
    token,
  };
};

/**
 * Only return the public information about the given user.
 */
 const makeExposedUser = ({
  GEBRUIKERID,
  GEBRUIKERSNAAM,
  ROL,
  STATUS,
}) => ({
  GEBRUIKERID,
  GEBRUIKERSNAAM,
  ROL,
  STATUS,
});

/**
 * Check and parse a JWT from the given header into a valid session
 * if possible.
 *
 * @param {string} authHeader - The bare 'Authorization' header to parse
 *
 * @throws {ServiceError} One of:
 * - UNAUTHORIZED: Invalid JWT token provided, possible errors:
 *   - no token provided
 *   - incorrect 'Bearer' prefix
 *   - expired JWT
 *   - other unknown error
 */
 const checkAndParseSession = async (authHeader) => {
  if (!authHeader) {
    throw ServiceError.unauthorized('You need to be signed in');
  }

  if (!authHeader.startsWith('Bearer ')) {
    throw ServiceError.unauthorized('Invalid authentication token');
  }

  const authToken = authHeader.substr(7);
  try {
    const {
      roles, userId,
    } = await verifyJWT(authToken);

    return {
      userId,
      roles,
      authToken,
    };
  } catch (error) {
    const logger = getChildLogger('user-service');
    logger.error(error.message, { error });
    throw ServiceError.unauthorized(error.message);
  }
};

/**
 * Check if the given roles include the given required role.
 *
 * @param {string} role - Role to require.
 * @param {string[]} roles - Roles of the user.
 *
 * @returns {void} Only throws if role not included.
 *
 * @throws {ServiceError} One of:
 * - UNAUTHORIZED: Role not included in the array.
 */
 const checkRole = (role, roles) => {
  const hasPermission = roles.includes(role);

  if (!hasPermission) {
    throw ServiceError.forbidden('You are not allowed to view this part of the application');
  }
};


module.exports = {
  getAll,
  getById,
  login,
  checkAndParseSession,
  checkRole,
};