
const uuid = require('uuid');
const { tables, getKnex } = require('../data');
const { getChildLogger } = require('../core/logging');

/**
 * Get all `limit` templates, skip the first `offset`.
 *
 * @param {object} pagination - Pagination options
 * @param {number} pagination.limit - Nr of templates to return.
 * @param {number} pagination.offset - Nr of templates to skip.
 */
 const findAll = ({
  limit,
  offset,
}) => {
  return getKnex()(tables.template)
    .select()
    .limit(limit)
    .offset(offset);
};

/**
 * Calculate the total number of templates.
 */
const findCount = async () => {
  const [count] = await getKnex()(tables.template)
    .count();
  return count['count(*)'];
};

/**
 * Find templates with the given rol naam.
 *
 * @param {string} naam - The naam to search for.
 */
 const findByRolNaam = async (naam) => {
  const templates = await getKnex()(tables.template)
  .where('rol', naam);
  return templates;
};



/**
 * Find is visible with the given rol naam and category id.
 *
 * @param {string} naam - naam of the rol to get.
 * @param {number} id - id of the category.
 */
 const findIsVisible = async (naam,id) => {
  const isVisible = await getKnex()(tables.template)
  .where('rol', naam).where('category_id',id).select('is_visible');
  if(isVisible[0]) return Boolean(isVisible[0].is_visible);
  return isVisible;
};


/**
 * Find a template with the given `id`.
 *
 * @param {string} id - Id of the transaction to find.
 */
 const findById = async (id) => {
  const template = await getKnex()(tables.template)
    .first()
    .where(`${tables.template}.id`, id);
  
  return template;
};


/**
 * Create a new template.
 *
 * @param {object} template - The template to create.
 * @param {number} template.categoryId - id of category
 * @param {string} template.rol - rol naam
 * @param {boolean} template.isVisible - if category is visible
 *
 * @returns {Promise<object>} Created template
 */
 const create = async ({
  categoryId,
  rol,
  isVisible,
}) => {

  const exist = await findIsVisible(rol,categoryId);
  if(exist === true || exist === false)
  {
    console.log(exist);
    throw new Error(`A template for rol ${rol} with category id ${categoryId} already exists`);
  }

  try {
    const id = uuid.v4();
    await getKnex()(tables.template)
      .insert({
        id,
        category_id : categoryId,
        rol,
        is_visible: isVisible
      });
    return await findById(id);
  } catch (error) {
    const logger = getChildLogger('template-repo');
    logger.error('Error in create', {
      error,
    });
    throw error;
  }
};




/**
 * Update an existing template.
 *
 * @param {string} id - Id of the template to update.
 * @param {object} template - The template to create.
 * @param {boolean} template.isVisible - if category is visible
 *
 * @returns {Promise<object>} Updated template/**

 */
 const updateById = async (id, {
  isVisible
}) => {
  try {
    await getKnex()(tables.template)
      .update({
        is_visible: isVisible
      })
      .where(`${tables.template}.id`, id);
    return await findById(id);
  } catch (error) {
    const logger = getChildLogger('template-repo');
    logger.error('Error in updateById', {
      error,
    });
    throw error;
  }
};

/**
 * Delete a template with the given `id`.
 *
 * @param {string} id - Id of the template to delete.
 *
 * @returns {Promise<boolean>} Whether the template was deleted.
 */
 const deleteById = async (id) => {
  try {
    const rowsAffected = await getKnex()(tables.template)
      .delete()
      .where(`${tables.template}.id`, id);
    return rowsAffected > 0;
  } catch (error) {
    const logger = getChildLogger('template-repo');
    logger.error('Error in deleteById', {
      error,
    });
    throw error;
  }
};

module.exports = {
  findAll,
  findCount,
  findByRolNaam,
  findIsVisible,
  create,
  updateById,
  deleteById
};