const { tables, getKnex } = require('../data');
const { getChildLogger } = require('../core/logging');

const SELECT_COLUMNS = [
  `${tables.doelstelling}.DOELSTELLINGID as doelID`,
  `${tables.doelstelling}.Soort as soort`,
  `${tables.doelstelling}.DOELWAARDE as doelwaarde`,
  `${tables.doelstelling}.ICON as icon`,
  `${tables.doelstelling}.JAAR as jaar`,
  `${tables.doelstelling}.NAAM as doelNaam`,
  `${tables.doelstelling}.PARENTCOMPONENT_DOELSTELLINGID as parentDoelstellingID`,
  `${tables.doelstelling}.SDGOAL_idSDG as sdgID`,
  `${tables.doelstelling}.FORMULE_ID as formuleID`,
  `${tables.doelstelling}.DATASOURCE_DATASOURCEID as datasourceID`,
  `${tables.categorie}.CATEGORIEID as categorieID`,
  `${tables.categorie}.NAAM as categorieNaam`,
  
];

/**
 * Get all `limit` doelstellingen, skip the first `offset`.
 *
 * @param {object} pagination - Pagination options
 * @param {number} pagination.limit - Nr of doelstellingen to return.
 * @param {number} pagination.offset - Nr of doelstellingen to skip.
 */

 const categorizedDoelstellingen = async (doelstellingen) => {

  doelstellingen = Object.values(doelstellingen.reduce((doelstellingenGrouped, {
    doelID,
    soort,
    doelwaarde,
    icon,
    jaar,
    doelNaam,
    parentDoelstellingID,
    sdgID,
    formuleID,
    datasourceID,
    categorieID,
    categorieNaam
  }) => {

    if (soort == "COMP") {
      doelstellingenGrouped[doelID] = {
        id : doelID,
        soort,
        doelwaarde,
        isMax : Math.random() < 0.5,
        icon,
        jaar,
        naam : doelNaam,
        parent_doelstelling : {
          id : parentDoelstellingID
        },
        sdg_goal : {
          id : sdgID
        },
        formule : {
          id : formuleID,
          naam : ""
        },
        categorie : {
          id : categorieID,
          naam : categorieNaam
        },
        subdoelstellingen : [],
      }
    } else {
      doelstellingenGrouped[doelID] = {
        id : doelID,
        soort,
        doelwaarde,
        isMax : Math.random() < 0.5,
        icon,
        jaar,
        naam : doelNaam,
        parent_doelstelling : {
          id : parentDoelstellingID
        },
        sdg_goal : {
          id : sdgID
        },
        formule : {
          id : formuleID,
          naam : ""
        },
        categorie : {
          id : categorieID,
          naam : categorieNaam
        },
        datasource : {
          id : datasourceID
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
  for(let i = 0; i < doelstellingen.length; ++i)
  {
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
    .select(SELECT_COLUMNS)
    .leftJoin(`${tables.sdg}`, `${tables.doelstelling}.SDGOAL_idSDG`, `=`, `${tables.sdg}.idSDG`)
    .leftJoin(`${tables.categorie}`, `${tables.sdg}.CATID`, `=`, `${tables.categorie}.CATEGORIEID`)
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
  .select(SELECT_COLUMNS)
  .leftJoin(`${tables.sdg}`, `${tables.doelstelling}.SDGOAL_idSDG`, `=`, `${tables.sdg}.idSDG`)
  .leftJoin(`${tables.categorie}`, `${tables.sdg}.CATID`, `=`, `${tables.categorie}.CATEGORIEID`)
  .where('doelstellingid', 'in', getKnex()(tables.doelstelling_rol).select('Component_DOELSTELLINGID').where('rollen_NAAM', naam));
  
  return doelstellingen && categorizedDoelstellingen(doelstellingen);
};


/**
 * Find doelstelingen with the given Categorie id.
 *
 * @param {number} id - The id of the categorie.
 */
 const findByCategorieId = async (id) => {
  const doelstellingen = await getKnex()(tables.doelstelling)
  .select(SELECT_COLUMNS)
  .leftJoin(`${tables.sdg}`, `${tables.doelstelling}.SDGOAL_idSDG`, `=`, `${tables.sdg}.idSDG`)
  .leftJoin(`${tables.categorie}`, `${tables.sdg}.CATID`, `=`, `${tables.categorie}.CATEGORIEID`)
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
  .select(SELECT_COLUMNS)
  .leftJoin(`${tables.sdg}`, `${tables.doelstelling}.SDGOAL_idSDG`, `=`, `${tables.sdg}.idSDG`)
  .leftJoin(`${tables.categorie}`, `${tables.sdg}.CATID`, `=`, `${tables.categorie}.CATEGORIEID`)
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