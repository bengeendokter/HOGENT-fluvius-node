const { tables, getKnex } = require('../data');
const { getChildLogger } = require('../core/logging');

/**
 * Get all `limit` rolllen, skip the first `offset`.
 *
 * @param {object} pagination - Pagination options
 * @param {number} pagination.limit - Nr of rolllen to return.
 * @param {number} pagination.offset - Nr of rolllen to skip.
 */
 const findAll = ({
  limit,
  offset,
}) => {
  return getKnex()(tables.rol)
    .select()
    .limit(limit)
    .offset(offset);
};

/**
 * Calculate the total number of rol.
 */
const findCount = async () => {
  const [count] = await getKnex()(tables.rol)
    .count();
  return count['count(*)'];
};

module.exports = {
  findAll,
  findCount,
};