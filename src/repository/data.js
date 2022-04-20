const { tables, getKnex } = require('../data');
const { getChildLogger } = require('../core/logging');

/**
 * Get all `limit` data, skip the first `offset`.
 *
 * @param {object} pagination - Pagination options
 * @param {number} pagination.limit - Nr of data to return.
 * @param {number} pagination.offset - Nr of data to skip.
 */
 const findAll = ({
  limit,
  offset,
}) => {
  return getKnex()(tables.data)
    .select()
    .limit(limit)
    .offset(offset);
};

/**
 * Calculate the total number of data.
 */
const findCount = async () => {
  const [count] = await getKnex()(tables.data)
    .count();
  return count['count(*)'];
};

module.exports = {
  findAll,
  findCount,
};