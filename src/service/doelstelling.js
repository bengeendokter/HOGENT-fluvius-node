
const { getChildLogger } = require('../core/logging');
const doelstellingRepository = require('../repository/doelstelling.js');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('doelstelling-service');
	this.logger.debug(message, meta);
};

/**
 * Get all `limit` doelstellingen, skip the first `offset`.
 *
 * @param {number} [limit] - Nr of doelstellingen to fetch.
 * @param {number} [offset] - Nr of doelstellingen to skip.
 */
 const getAll = async (
  limit = 100,
  offset = 0,
) => {
  debugLog('Fetching all doelstellingen', { limit, offset });
  const data = await doelstellingRepository.findAll({ limit, offset });
  const totalCount = await doelstellingRepository.findCount();
  return {
    data,
    count: totalCount,
    limit,
    offset,
  };
};

/**
 * Get the doelstellingen with the given rol id.
 *
 * @param {string} id - Id of the rol to get.
 *
 * @throws {ServiceError} One of:
 * - NOT_FOUND: No doelstellingen with the given rol id could be found.
 */
 const getByRolId = async (id) => {
  debugLog(`Fetching doelstellingen with rol id ${id}`);
  const doelstellingen = await doelstellingRepository.findByRolId(id);

  if (!doelstellingen) {
    throw new Error(`No doelstellingen with rol id ${id} exists`, { id });
  }

  return doelstellingen;
};


module.exports = {
  getAll,
  getByRolId
};