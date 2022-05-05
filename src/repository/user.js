const { tables, getKnex } = require('../data');
const { getChildLogger } = require('../core/logging');

/**
 * Get all `limit` users, skip the first `offset`.
 *
 * @param {object} pagination - Pagination options
 * @param {number} pagination.limit - Nr of users to return.
 * @param {number} pagination.offset - Nr of users to skip.
 */
 const findAll = ({
  limit,
  offset,
}) => {
  return getKnex()(tables.user)
    .select()
    .limit(limit)
    .offset(offset);
};

/**
 * Calculate the total number of users.
 */
const findCount = async () => {
  const [count] = await getKnex()(tables.user)
    .count();
  return count['count(*)'];
};

/**
 * Get user by id.
 *
 * @param {number} id - id of user
 */
 const findById = (id) => {
  return getKnex()(tables.user)
    .where("GEBRUIKERID",id)
    .select()
    .limit(1)
};

/**
 * Get user by name.
 *
 * @param {String} name - name of user
 */
 const findByName = (name) => {
  return getKnex()(tables.user)
    .where("GEBRUIKERSNAAM",name)
    .first()
};



module.exports = {
  findAll,
  findCount,
  findById,
  findByName
};