
const { getChildLogger } = require('../core/logging');
const dataRepository = require('../repository/data.js');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('data-service');
	this.logger.debug(message, meta);
};

/**
 * Get all `limit` data, skip the first `offset`.
 *
 * @param {number} [limit] - Nr of data to fetch.
 * @param {number} [offset] - Nr of data to skip.
 */
 const getAll = async (
  limit = 100,
  offset = 0,
) => {
  debugLog('Fetching all data', { limit, offset });
  const data = await dataRepository.findAll({ limit, offset });
  const totalCount = await dataRepository.findCount();
  return {
    data,
    count: totalCount,
    limit,
    offset,
  };
};

/**
 * Get the data with the given doelstelling id.
 *
 * @param {number} id - id of the doelstelling.
 *
 * @throws {ServiceError} One of:
 * - NOT_FOUND: No data with the given doelstelling id could be found.
 */
 const getByDoelstellingId = async (id) => {
  debugLog(`Fetching data with doelstelling id ${id}`);
  const data = await dataRepository.findByDoelstellingId(id);

  if (!data) {
    throw new Error(`No data with doelstelling id ${id} exists`, { id });
  }

  return data;
};

/**
 * Get the data with the given doelstelling id and year.
 *
 * @param {number} id - id of the doelstelling.
 * @param {number} jaar - jaar of the data.
 * @throws {ServiceError} One of:
 * - NOT_FOUND: No data with the given doelstelling id or year could be found.
 */
 const getByDoelstellingIdAndYear = async (id,jaar) => {
  debugLog(`Fetching data with doelstelling id ${id} and year ${jaar}`);
  const data = await dataRepository.findByDoelstellingIdAndYear(id,jaar);

  if (!data) {
    throw new Error(`No data with doelstelling id ${id} or year ${jaar} exists`, { id });
  }

  return data;
};


/**
 * Get all the data with the given doelstelling id.
 *
 * @param {number} id - id of the doelstelling.
 *
 * @throws {ServiceError} One of:
 * - NOT_FOUND: No data with the given doelstelling id could be found.
 */
 const getAllByDoelstellingId = async (id) => {
  debugLog(`Fetching all data with doelstelling id ${id}`);
  const data = await dataRepository.findAllByDoelstellingId(id);

  if (!data) {
    throw new Error(`No data with doelstelling id ${id} exists`, { id });
  }

  return data;
};


module.exports = {
  getAll,
  getByDoelstellingId,
  getByDoelstellingIdAndYear,
  getAllByDoelstellingId
};