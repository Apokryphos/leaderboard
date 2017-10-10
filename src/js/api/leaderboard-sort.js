import SortCriteria from './sort-criteria.js';

function getSortCriteria(data, sortCriteria) {
  switch (sortCriteria) {
    case SortCriteria.RANK:
      return data.rank;
    case SortCriteria.USERNAME:
      return data.username;
    case SortCriteria.RECENT:
      return data.recent;
    case SortCriteria.ALLTIME:
      return data.alltime;
    default:
      throw new Error(`${sortCriteria} not implemented.`);
  }
}

function sortByCriteria(
  data,
  primaryCriteria,
  secondaryCriteria,
  reverse = false
) {
  if (primaryCriteria === undefined || secondaryCriteria === undefined) {
    throw Error('Criteria must be specified.');
  }

  const sort = function(objA, objB) {
    const a = reverse ? objB : objA;
    const b = reverse ? objA : objB;

    const primaryA = getSortCriteria(a, primaryCriteria);
    const primaryB = getSortCriteria(b, primaryCriteria);

    if (primaryA < primaryB) {
      return -1;
    }

    if (primaryA > primaryB) {
      return 1;
    }

    const secondaryA = getSortCriteria(a, secondaryCriteria);
    const secondaryB = getSortCriteria(b, secondaryCriteria);

    if (secondaryA < secondaryB) {
      return -1;
    }

    if (secondaryA > secondaryB) {
      return 1;
    }

    return 0;
  };

  data.sort(sort);
  return data;
}

export default {
  getSortCriteria,
  sortByCriteria
};
