
const { getChildLogger } = require('../core/logging');
const sdgRepository = require('../repository/sdg.js');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('sdg-service');
	this.logger.debug(message, meta);
};

/**
 * Get all `limit` sdgs, skip the first `offset`.
 *
 * @param {number} [limit] - Nr of sdgs to fetch.
 * @param {number} [offset] - Nr of sdgs to skip.
 */
 const getAll = async (
  limit = 100,
  offset = 0,
) => {
  debugLog('Fetching all sdgs', { limit, offset });
  const data = await sdgRepository.findAll({ limit, offset });
  const totalCount = await sdgRepository.findCount();
  return {
    data,
    count: totalCount,
    limit,
    offset,
  };
};

/**
 * Get the sdgs with the given categorie id.
 *
 * @param {string} id - Id of the categorie to get.
 *
 * @throws {ServiceError} One of:
 * - NOT_FOUND: No sdgs with the given categorie id could be found.
 */
 const getByCategorieId = async (id) => {
  debugLog(`Fetching sdgs with categorie id ${id}`);
  const sdgs = await sdgRepository.findByCategorieId(id);

  if (!sdgs) {
    throw new Error(`No sdgs with categorie id ${id} exists`, { id });
  }

  return sdgs;
};


module.exports = {
  getAll,
  getByCategorieId,
};