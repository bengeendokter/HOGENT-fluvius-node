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


module.exports = {
  findAll,
  findCount,
  findByRolNaam,
  findIsVisible
};