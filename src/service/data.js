
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

/**
 * Get the data with the given doelstelling id.
 *
 * @param {number} id - id of the doelstelling.
 *
 * @throws {ServiceError} One of:
 * - NOT_FOUND: No data with the given doelstelling id could be found.
 */
 const getByDoelstellingId = async (id) => {
  debugLog(`Fetching data with doelstelling id ${id}`);
  const data = await dataRepository.findByDoelstellingId(id);

  if (!data) {
    throw new Error(`No data with doelstelling id ${id} exists`, { id });
  }

  return data;
};




module.exports = {
  getAll,
  getByDoelstellingId
};