
const { getChildLogger } = require('../core/logging');
const templateRepository = require('../repository/template.js');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('template-service');
	this.logger.debug(message, meta);
};

/**
 * Get all `limit` templates, skip the first `offset`.
 *
 * @param {number} [limit] - Nr of templates to fetch.
 * @param {number} [offset] - Nr of templates to skip.
 */
 const getAll = async (
  limit = 100,
  offset = 0,
) => {
  debugLog('Fetching all templates', { limit, offset });
  const data = await templateRepository.findAll({ limit, offset });
  const totalCount = await templateRepository.findCount();
  return {
    data,
    count: totalCount,
    limit,
    offset,
  };
};

/**
 * Get the templates with the given rol naam.
 *
 * @param {string} naam - naam of the rol to get.
 *
 * @throws {ServiceError} One of:
 * - NOT_FOUND: No templates with the given rol naam could be found.
 */
 const getAllByRolNaam = async (naam) => {
  debugLog(`Fetching templates with rol naam ${naam}`);
  const templates = await templateRepository.findByRolNaam(naam);

  if (!templates) {
    throw new Error(`No templates with rol naam ${naam} exists`, { naam });
  }

  return templates;
};


/**
 * Get the is visible with the given rol naam and category id.
 *
 * @param {string} naam - naam of the rol to get.
 * @param {number} id - id of the category.
 * @throws {ServiceError} One of:
 * - NOT_FOUND: No templates with the given rol naam and category id could be found.
 */
 const getIsVisible = async (naam, id) => {
  debugLog(`Fetching templates with rol naam ${naam} and category id ${id}`);
  const isVisible = await templateRepository.findIsVisible(naam,id);

  if (!isVisible) {
    throw new Error(`No templates with rol naam ${naam} and category id ${id} exists`, { naam });
  }

  return isVisible;
};

module.exports = {
  getAll,
  getAllByRolNaam,
  getIsVisible
};