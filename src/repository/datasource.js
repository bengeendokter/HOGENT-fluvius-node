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


/**
 * Find a datasource with the given `id`.
 *
 * @param {string} id - Id of the datasource to find.
 */
 const findById = async (id) => {
  const datasource = await getKnex()(tables.datasource)
    .first()
    .where(`${tables.datasource}.DATASOURCEID`, id);
  
  return datasource;
};


/**
 * Update an existing datasource.
 *
 * @param {string} id - Id of the datasource to update.
 * @param {object} datasource - The datasource to create.
 * @param {boolean} datasource.CORRUPT - if category is visible
 *
 * @returns {Promise<object>} Updated datasource/**

 */
 const updateById = async (id, {
  CORRUPT
}) => {
  try {
    await getKnex()(tables.datasource)
      .update({
        CORRUPT
      })
      .where(`${tables.datasource}.DATASOURCEID`, id);
    return await findById(id);
  } catch (error) {
    
    const logger = getChildLogger('datasource-repo');
    logger.error('Error in updateById', {
      error,
    });
    throw error;
  }
};

module.exports = {
  findAll,
  findCount,
  updateById,
};