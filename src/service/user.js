
const { getChildLogger } = require('../core/logging');
const userRepository = require('../repository/user.js');

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


module.exports = {
  getAll,
  getById,
};