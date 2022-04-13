const { tables, getKnex } = require('../data');
const { getChildLogger } = require('../core/logging');

/**
 * Get all `limit` datasources, skip the first `offset`.
 *
 * @param {object} pagination - Pagination options
 * @param {number} pagination.limit - Nr of datasources to return.
 * @param {number} pagination.offset - Nr of datasources to skip.
 */
 const findAll = ({
  limit,
  offset,
}) => {
  return getKnex()(tables.datasource)
    .select()
    .limit(limit)
    .offset(offset);
};

/**
 * Calculate the total number of datasource.
 */
const findCount = async () => {
  const [count] = await getKnex()(tables.datasource)
    .count();
  return count['count(*)'];
};

module.exports = {
  findAll,
  findCount,
};