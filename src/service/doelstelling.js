
const { getChildLogger } = require('../core/logging');
const doelstellingRepository = require('../repository/doelstelling.js');

const debugLog = (message, meta = {}) => {
	if (!this.logger) this.logger = getChildLogger('doelstelling-service');
	this.logger.debug(message, meta);
};

/**
 * Get all `limit` doelstellingen, skip the first `offset`.
 *
 * @param {number} [limit] - Nr of doelstellingen to fetch.
 * @param {number} [offset] - Nr of doelstellingen to skip.
 */
 const getAll = async (
  limit = 100,
  offset = 0,
) => {
  debugLog('Fetching all doelstellingen', { limit, offset });
  const data = await doelstellingRepository.findAll({ limit, offset });
  const totalCount = await doelstellingRepository.findCount();
  return {
    data,
    count: totalCount,
    limit,
    offset,
  };
};

/**
 * Get the doelstellingen with the given rol naam.
 *
 * @param {string} naam - naam of the rol to get.
 *
 * @throws {ServiceError} One of:
 * - NOT_FOUND: No doelstellingen with the given rol naam could be found.
 */
 const getByRolNaam = async (naam) => {
  debugLog(`Fetching doelstellingen with rol naam ${naam}`);
  const doelstellingen = await doelstellingRepository.findByRolNaam(naam);

  if (!doelstellingen) {
    throw new Error(`No doelstellingen with rol naam ${naam} exists`, { naam });
  }

  return doelstellingen;
};


/**
 * Get the doelstellingen with the given categorie id.
 *
 * @param {number} id - id of the categorie.
 *
 * @throws {ServiceError} One of:
 * - NOT_FOUND: No doelstellingen with the given categorie id could be found.
 */
 const getByCategorieId = async (id) => {
  debugLog(`Fetching doelstellingen with categorie id ${id}`);
  const doelstellingen = await doelstellingRepository.findByCategorieId(id);

  if (!doelstellingen) {
    throw new Error(`No doelstellingen with categorie id ${id} exists`, { id });
  }

  return doelstellingen;
};


/**
 * Get the doelstellingen with the given categorie id.
 *
 * @param {number} id - id of the categorie.
 * @param {string} naam - naam of the rol.
 *
 * @throws {ServiceError} One of:
 * - NOT_FOUND: No doelstellingen with the given categorie id or rol naam could be found.
 */
 const getByCategorieIdAndRol = async (id, naam) => {
  debugLog(`Fetching doelstellingen with categorie id ${id} and rol naam ${naam}`);
  const doelstellingen = await doelstellingRepository.findByCategorieIdAndRol(id,naam);

  if (!doelstellingen) {
    throw new Error(`No doelstellingen with categorie id ${id} and rol naam ${naam} exists`, { id });
  }

  return doelstellingen;
};


module.exports = {
  getAll,
  getByRolNaam,
  getByCategorieId,
  getByCategorieIdAndRol
};