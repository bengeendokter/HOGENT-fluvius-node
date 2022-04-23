const { tables, getKnex } = require('../data');
const { getChildLogger } = require('../core/logging');

/**
 * Get all `limit` doelstellingen, skip the first `offset`.
 *
 * @param {object} pagination - Pagination options
 * @param {number} pagination.limit - Nr of doelstellingen to return.
 * @param {number} pagination.offset - Nr of doelstellingen to skip.
 */

 const categorizedDoelstellingen = async (doelstellingen) => {

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
          id : FORMULE_ID,
          naam : ""
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
          id : FORMULE_ID,
          naam : ""
        },
        datasource : {
          id : DATASOURCE_DATASOURCEID
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
  await setFormuleNaam(doelstellingen);

  return doelstellingen;
};

const setFormuleNaam  = async (doelstellingen) =>
{
  console.log(doelstellingen.length);
  for(let i = 0; i < doelstellingen.length; ++i)
  {
    console.log(doelstellingen[i].naam);
    doelstellingen[i].formule.naam = await getFormuleNaam(doelstellingen[i].formule.id);
    if(doelstellingen[i].subdoelstellingen != null)
    {
    
      await setFormuleNaam(doelstellingen[i].subdoelstellingen);
    }
  }
}

const getFormuleNaam = async (id) =>
{
  const formule =  await getKnex()(tables.formule)
  .where('ID', id).select('Soort');
  
  return formule[0].Soort;
}

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
 * Find doelstelingen with the given rol naam.
 *
 * @param {string} naam - The naam to search for.
 */
 const findByRolNaam = async (naam) => {
  const doelstellingen = await getKnex()(tables.doelstelling)
  .where('doelstellingid', 'in', getKnex()(tables.doelstelling_rol).select('Component_DOELSTELLINGID').where('rollen_NAAM', naam));
  return categorizedDoelstellingen(doelstellingen);
};


/**
 * Find doelstelingen with the given Categorie id.
 *
 * @param {number} id - The id of the categorie.
 */
 const findByCategorieId = async (id) => {
  const doelstellingen = await getKnex()(tables.doelstelling)
  .where('SDGOAL_idSDG', 'in', getKnex()(tables.sdg).select('idSDG').where('CATID',id));
  return categorizedDoelstellingen(doelstellingen);
};


/**
 * Find doelstelingen with the given Categorie id and rol naam.
 *
 * @param {number} id - The id of the categorie.
 * @param {string} naam - naam of the rol.
 */
 const findByCategorieIdAndRol = async (id, naam) => {
  const doelstellingen = await getKnex()(tables.doelstelling)
  .where('SDGOAL_idSDG', 'in', getKnex()(tables.sdg).select('idSDG').where('CATID',id)).where('doelstellingid', 'in', getKnex()(tables.doelstelling_rol).select('Component_DOELSTELLINGID').where('rollen_NAAM', naam));
  return categorizedDoelstellingen(doelstellingen);
};


module.exports = {
  findAll,
  findCount,
  findByRolNaam,
  findByCategorieId,
  findByCategorieIdAndRol
};