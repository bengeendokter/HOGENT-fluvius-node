
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


/**
 * Create a new template
 *
 * @param {object} template - The template to create.
 * @param {number} template.categoryId - id of category
 * @param {string} template.rol - rol naam
 * @param {boolean} template.isVisible - if category is visible
 */
 const create = async ({ categoryId, rol, isVisible}) => {
	debugLog('Creating new template', {  categoryId, rol, isVisible});

	return templateRepository.create({
		categoryId,
		rol,
		isVisible,
	});
};

/**
 * Delete the template with the given `id`.
 *
 * @param {string} id - Id of the template to delete.
 */
 const deleteById = async (id) => {
	debugLog(`Deleting template with id ${id}`);
	await templateRepository.deleteById(id);
};

/**
 * Update an existing template
 *
 * @param {string} id - Id of the template to update.
 * @param {object} template - The template to create.
 * @param {boolean} template.isVisible - if category is visible
 */
 const updateById = async (id, { isVisible}) => {
	debugLog(`Updating template with id ${id}`, {
		isVisible
	});

 	return templateRepository.updateById(id, {
		isVisible
	});
};


module.exports = {
  getAll,
  getAllByRolNaam,
  getIsVisible,
  create,
  updateById,
  deleteById
};