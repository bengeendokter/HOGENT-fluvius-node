const { tables, getKnex } = require('../data');
const { getChildLogger } = require('../core/logging');

/**
 * Get all `limit` sdg, skip the first `offset`.
 *
 * @param {object} pagination - Pagination options
 * @param {number} pagination.limit - Nr of sdgs to return.
 * @param {number} pagination.offset - Nr of sdgs to skip.
 */
 const findAll = ({
  limit,
  offset,
}) => {
  return getKnex()(tables.sdg)
    .select()
    .limit(limit)
    .offset(offset);
};

/**
 * Calculate the total number of sdg.
 */
const findCount = async () => {
  const [count] = await getKnex()(tables.sdg)
    .count();
  return count['count(*)'];
};

/**
 * Find sdgs with the given categorie id.
 *
 * @param {string} id - The id to search for.
 */
 const findByCategorieId = (id) => {
  return getKnex()(tables.sdg)
    .where('CATID', id);
};

module.exports = {
  findAll,
  findCount,
  findByCategorieId,
};