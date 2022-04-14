const { tables, getKnex } = require('../data');
const { getChildLogger } = require('../core/logging');

/**
 * Get all `limit` doelstellingen, skip the first `offset`.
 *
 * @param {object} pagination - Pagination options
 * @param {number} pagination.limit - Nr of doelstellingen to return.
 * @param {number} pagination.offset - Nr of doelstellingen to skip.
 */

 const categorizedDoelstellingen = (doelstellingen) => {

  doelstellingen = Object.values(doelstellingen.reduce((doelstellingenGrouped, {
    DOELSTELLINGID,
    Soort,
    DOELWAARDE,
    ICON,
    JAAR,
    NAAM,
    PARENTCOMPONENT_DOELSTELLINGID,
    SDGOAL_idSDG,
    FORMULE_ID,
    DATASOURCE_DATASOURCEID,
  }) => {

    if (Soort == "COMP") {
      doelstellingenGrouped[DOELSTELLINGID] = {
        id : DOELSTELLINGID,
        soort : Soort,
        doelwaarde : DOELWAARDE,
        icon : ICON,
        jaar: JAAR,
        naam : NAAM,
        parent_doelstelling : {
          id : PARENTCOMPONENT_DOELSTELLINGID
        },
        sdg_goal : {
          id : SDGOAL_idSDG
        },
        formule : {
          id : FORMULE_ID
        },
        subdoelstellingen : [],
      }
    } else {
      doelstellingenGrouped[DOELSTELLINGID] = {
        id : DOELSTELLINGID,
        soort : Soort,
        doelwaarde : DOELWAARDE,
        icon : ICON,
        jaar: JAAR,
        naam : NAAM,
        parent_doelstelling : {
          id : PARENTCOMPONENT_DOELSTELLINGID
        },
        sdg_goal : {
          id : SDGOAL_idSDG
        },
        formule : {
          id : FORMULE_ID
        }
      }
    }

    return doelstellingenGrouped;
  }, {}));

  for (const d of doelstellingen) {

      if (d.soort === "LEAF") {
        doelstellingen.find(e => e.id == d.parent_doelstelling.id)?.subdoelstellingen.push(d);
      }  
  }

  for (const d of doelstellingen) {
    if (d.soort === "COMP") {
      doelstellingen.find(e => e.id == d.parent_doelstelling.id)?.subdoelstellingen.push(d);
    }
}

  doelstellingen = doelstellingen.filter(e => e.parent_doelstelling.id === null);

  return doelstellingen;
};

 const findAll = async ({
  limit,
  offset,
}) => {
  const doelstellingen = await getKnex()(tables.doelstelling)
    .select()
    .limit(limit)
    .offset(offset);

  return doelstellingen && categorizedDoelstellingen(doelstellingen);
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
    .where('doelstellingid', 'in', getKnex()(tables.doelstelling_rol).select('Component_DOELSTELLINGID').where('rollen_NAAM', id));
};


module.exports = {
  findAll,
  findCount,
  findByRolId
};