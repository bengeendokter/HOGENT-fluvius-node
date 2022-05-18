
const { getChildLogger } = require('../core/logging');
const datasourceRepository = require('../repository/datasource.js');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('datasource-service');
	this.logger.debug(message, meta);
};

/**
 * Get all `limit` datasources, skip the first `offset`.
 *
 * @param {number} [limit] - Nr of datasources to fetch.
 * @param {number} [offset] - Nr of datasources to skip.
 */
 const getAll = async (
  limit = 100,
  offset = 0,
) => {
  debugLog('Fetching all datasources', { limit, offset });
  const data = await datasourceRepository.findAll({ limit, offset });
  const totalCount = await datasourceRepository.findCount();
  return {
    data,
    count: totalCount,
    limit,
    offset,
  };
};

/**
 * Update an existing datasource
 *
 * @param {string} id - Id of the datasource to update.
 * @param {object} datasource - The datasource to create.
 * @param {boolean} datasource.CORRUPT - if category is visible
 */
 const updateById = async (id, { CORRUPT}) => {
	debugLog(`Updating template with id ${id}`, {
		CORRUPT
	});

 	return datasourceRepository.updateById(id, {
    CORRUPT
	});
};

module.exports = {
  getAll,
  updateById
};