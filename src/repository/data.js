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

/**
 * Find data with the given Doestelling id.
 *
 * @param {number} id - The id of the Doestelling.
 */
 const findByDoelstellingId = async (id) => {
  const compData = await getKnex()(tables.componentData).where('COMPONENT_ID',id).select().orderBy('JAAR', 'desc').limit(1);

  let data;
  if(compData[0] != null)
  {
    data =
    {
      jaar : compData[0].JAAR,
      data : await getKnex()(tables.data).where('id',compData[0].ID).select('value','name').orderBy('name', 'asc')
    }
  }
  return data;
};


module.exports = {
  findAll,
  findCount,
  findByDoelstellingId
};