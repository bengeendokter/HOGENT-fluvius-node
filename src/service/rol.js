
const { getChildLogger } = require('../core/logging');
const rolRepository = require('../repository/rol.js');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('rol-service');
	this.logger.debug(message, meta);
};

/**
 * Get all `limit` rollen, skip the first `offset`.
 *
 * @param {number} [limit] - Nr of rollen to fetch.
 * @param {number} [offset] - Nr of rollen to skip.
 */
 const getAll = async (
  limit = 100,
  offset = 0,
) => {
  debugLog('Fetching all rollen', { limit, offset });
  const data = await rolRepository.findAll({ limit, offset });
  const totalCount = await rolRepository.findCount();
  return {
    data,
    count: totalCount,
    limit,
    offset,
  };
};

module.exports = {
  getAll
};