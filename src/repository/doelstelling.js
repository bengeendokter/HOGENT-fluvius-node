const { tables, getKnex } = require('../data');
const { getChildLogger } = require('../core/logging');

/**
 * Get all `limit` doelstellingen, skip the first `offset`.
 *
 * @param {object} pagination - Pagination options
 * @param {number} pagination.limit - Nr of doelstellingen to return.
 * @param {number} pagination.offset - Nr of doelstellingen to skip.
 */
 const findAll = ({
  limit,
  offset,
}) => {
  return getKnex()(tables.doelstelling)
    .select()
    .limit(limit)
    .offset(offset);
};

/**
 * Calculate the total number of doelstellingen.
 */
const findCount = async () => {
  const [count] = await getKnex()(tables.doelstelling)
    .count();
  return count['count(*)'];
};


/**
 * Find doelstelingen with the given rol id.
 *
 * @param {string} id - The id to search for.
 */
 const findByRolId = (id) => {
  return getKnex()(tables.doelstelling)
    .where('doelstellingid', 'in', getKnex()(tables.doelstelling_rol).select('Component_DOELSTELLINGID').where('rollen_ROLID', id));
};


module.exports = {
  findAll,
  findCount,
  findByRolId
};