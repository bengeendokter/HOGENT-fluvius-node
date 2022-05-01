
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

module.exports = {
  getAll,
  getById,
  login
};