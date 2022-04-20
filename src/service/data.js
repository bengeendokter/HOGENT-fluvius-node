
const { getChildLogger } = require('../core/logging');
const dataRepository = require('../repository/data.js');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('data-service');
	this.logger.debug(message, meta);
};

/**
 * Get all `limit` data, skip the first `offset`.
 *
 * @param {number} [limit] - Nr of data to fetch.
 * @param {number} [offset] - Nr of data to skip.
 */
 const getAll = async (
  limit = 100,
  offset = 0,
) => {
  debugLog('Fetching all data', { limit, offset });
  const data = await dataRepository.findAll({ limit, offset });
  const totalCount = await dataRepository.findCount();
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