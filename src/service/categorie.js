
const { getChildLogger } = require('../core/logging');
const categorieRepository = require('../repository/categorie.js');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('categorie-service');
	this.logger.debug(message, meta);
};

/**
 * Get all `limit` categories, skip the first `offset`.
 *
 * @param {number} [limit] - Nr of categories to fetch.
 * @param {number} [offset] - Nr of categories to skip.
 */
 const getAll = async (
  limit = 100,
  offset = 0,
) => {
  debugLog('Fetching all categories', { limit, offset });
  const data = await categorieRepository.findAll({ limit, offset });
  const totalCount = await categorieRepository.findCount();
  return {
    data,
    count: totalCount,
    limit,
    offset,
  };
};


/**
 * Get category, by id.
 *
 * @param {number} [id] - id of category

 */
 const getById = async (id) => {
  debugLog(`Fetching category with id ${id}`);
  const category = await categorieRepository.findById(id);
  return category;
};

module.exports = {
  getAll,
  getById
};