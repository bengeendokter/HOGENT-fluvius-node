const { tables, getKnex } = require('../data');
const { getChildLogger } = require('../core/logging');

const SELECT_COLUMNS = [
  `${tables.doelstelling}.DOELSTELLINGID as id`, 
  `${tables.doelstelling}.naam as naam`,
  `${tables.doelstelling}.doelwaarde as doelwaarde`,
  `${tables.data}.value as value`,
  `${tables.componentData}.jaar as jaar`,
  `${tables.datasource}.MAAT as eenheid`
];

const SELECT_COLUMNS_EENHEID = [
  `${tables.doelstelling}.DOELSTELLINGID as id`,
  `${tables.doelstelling}.Soort as soort`,
  `${tables.datasource}.MAAT as eenheid`
];

const vindEenheidRecursief = async (id) => {
  const resultaten = await getKnex()(tables.doelstelling)
      .select(SELECT_COLUMNS_EENHEID)
      .leftJoin(`${tables.datasource}`, `${tables.doelstelling}.DATASOURCE_DATASOURCEID`, `=`, `${tables.datasource}.DATASOURCEID`)
      .where(`${tables.doelstelling}.PARENTCOMPONENT_DOELSTELLINGID`,id)
  
      if (resultaten.length !== 0) {
        for (let i = 0; i < resultaten.length; i++) {

          const doelstelling = resultaten[i];
  
          if (doelstelling && doelstelling.soort === "LEAF") {
            return doelstelling.eenheid;
          }
  
        }
  
        const index = resultaten.findIndex(d => d.soort === "COMP");
        return resultaten[index] && vindEenheidRecursief(resultaten[index].id);
        
      } else {
        return "onbekend";
      }
}

const verdeelDataByDoelstelling = async (data) => {
  data = Object.values(data.reduce((dataGrouped, {
    id,
    naam,
    jaar,
    value,
    doelwaarde,
    eenheid
  }) => {
    if (!(id && naam in dataGrouped)) {
      dataGrouped[naam] = {
        id,
        naam,
        doelwaarde,
        eenheid,
        data : []
      }
    }

    if (!dataGrouped[naam].data.some(d => Object.keys(d)[0] === jaar)){
      dataGrouped[naam].data.push({[jaar] : []})
    }
    const index = dataGrouped[naam].data.findIndex(d => Object.keys(d)[0] === `${jaar}`);
    if (index !== -1) {
      dataGrouped[naam].data[index][`${jaar}`].push(value);
    }

    return dataGrouped
  }, {}));

  for (let i = 0; i < data.length; i++) {
    if (data[i] && !data[i].eenheid) {
      const result = await vindEenheidRecursief(data[i].id);
      data[i].eenheid = result;
    }
  }

  data.forEach(d => d.data = d.data.filter(f => Object.values(f)[0].length !== 0));

  return data
}

/**
 * Get all `limit` data, skip the first `offset`.
 *
 * @param {object} pagination - Pagination options
 * @param {number} pagination.limit - Nr of data to return.
 * @param {number} pagination.offset - Nr of data to skip.
 */
 const findAll = async ({
  limit,
  offset,
}) => {
  const data = await getKnex()(`${tables.data}`)
    .select(SELECT_COLUMNS)
    .join(`${tables.componentData}`, `${tables.componentData}.ID`, `=`, `${tables.data}.id`)
    .join(`${tables.doelstelling}`, `${tables.doelstelling}.DOELSTELLINGID`, `=`, `${tables.componentData}.COMPONENT_ID`)
    .leftJoin(`${tables.datasource}`, `${tables.doelstelling}.DATASOURCE_DATASOURCEID`, `=`, `${tables.datasource}.DATASOURCEID`)
    .limit(limit)
    .offset(offset)
    .orderBy('JAAR', 'asc');
    
    return data && verdeelDataByDoelstelling(data);
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
      data : await getKnex()(tables.data).where('id',compData[0].ID).select('value','name').orderBy('name', 'asc'),
      doelwaarde : compData[0].DOELWAARDE
    }
  }
  return data;
};


/**
 * Find data with the given Doestelling id.
 *
 * @param {number} id - The id of the Doestelling.
 * @param {number} jaar - jaar of the data.
 */
 const findByDoelstellingIdAndYear = async (id,jaar) => {
  const compData = await getKnex()(tables.componentData).where('COMPONENT_ID',id).where('JAAR',jaar).select().limit(1);

  let data;
  if(compData[0] != null)
  {
    data =
    {
      jaar : compData[0].JAAR,
      data : await getKnex()(tables.data).where('id',compData[0].ID).select('value','name').orderBy('name', 'asc'),
      doelwaarde : compData[0].DOELWAARDE
    }
  }
  return data;
};

/**
 * Find all data with the given Doestelling id.
 *
 * @param {number} id - The id of the Doestelling.
 */
 const findAllByDoelstellingId = async (id) => {
  const compData = await getKnex()(tables.componentData).where('COMPONENT_ID',id).select().orderBy('JAAR', 'desc');

  const data = [];
  for(let i = 0; i < compData.length; i++)
  {
    data[i] =
    {
      jaar : compData[i].JAAR,
      data : await getKnex()(tables.data).where('id',compData[i].ID).select('value','name').orderBy('name', 'asc'),
      doelwaarde : compData[i].DOELWAARDE
    }
  }
  return data;
};

module.exports = {
  findAll,
  findCount,
  findByDoelstellingId,
  findByDoelstellingIdAndYear,
  findAllByDoelstellingId
};