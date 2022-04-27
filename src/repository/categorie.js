const { tables, getKnex } = require('../data');
const { getChildLogger } = require('../core/logging');

/**
 * Get all `limit` categories, skip the first `offset`.
 *
 * @param {object} pagination - Pagination options
 * @param {number} pagination.limit - Nr of categories to return.
 * @param {number} pagination.offset - Nr of categories to skip.
 */
 const findAll = ({
  limit,
  offset,
}) => {
  return getKnex()(tables.categorie)
    .select()
    .limit(limit)
    .offset(offset);
};

/**
 * Calculate the total number of categorie.
 */
const findCount = async () => {
  const [count] = await getKnex()(tables.categorie)
    .count();
  return count['count(*)'];
};

/**
 * Get category by id.
 *
 * @param {number} id - id of category
 */
 const findById = (id) => {
  return getKnex()(tables.categorie)
    .where("CATEGORIEID",id)
    .select()
    .limit(1)
};


module.exports = {
  findAll,
  findCount,
  findById
};