/* eslint-disable unicorn/no-for-loop */
import axios from 'axios';
import useSWR from 'swr';
import fpSet from 'lodash/fp/set';

/**
 * @type     {Object}       Default ICR categories in the case of an error.
 * @property {Array}   row  Array of rows that contain ICR categories.
 */
export const DEFAULT_ICR_CATEGORIES = { rows: [] };

/**
 * @type {String}  REST URL to fetch the ICR categories
 */
export const ICR_CATEGORIES_URL = '/app/api/icr-categories';

/**
 * @return {Object}  Mapped ICR categories
 */
const getRowItems = (row) => ({
  id1: row[0] === null ? null : Number(row[0]),
  id2: row[2] === null ? null : Number(row[2]),
  id3: row[4] === null ? null : Number(row[4]),
  id4: row[6] === null ? null : Number(row[6]),
  id5: row[8] === null ? null : Number(row[8]),
  id6: row[10] === null ? null : Number(row[10]),

  name1: row[1],
  name2: row[3],
  name3: row[5],
  name4: row[7],
  name5: row[9],
  name6: row[11],
});

const useICRData = () => {
  const { data } = useSWR(ICR_CATEGORIES_URL, async (url) =>
    axios.get(url).then(({ data }) => data),
  );

  const icrCategories = data || DEFAULT_ICR_CATEGORIES;

  return icrCategories;
};

export const useContactReasonCategories = () => {
  const { icrCategories: categories } = useICRData();
  const wrapupCategories = categories?.rows || [];
  let dictionary = { 0: 'All' };
  let categoryIds = {};
  //run through list twice - once will build shape and the second will add the terminal nodes
  for (let rowIter = 0; rowIter < wrapupCategories.length; ++rowIter) {
    const { id1, id2, id3, id4, id5, id6, name1, name2, name3, name4, name5, name6 } = getRowItems(
      wrapupCategories[rowIter],
    );
    const reverseRow = [
      [id6, name6],
      [id5, name5],
      [id4, name4],
      [id3, name3],
      [id2, name2],
      [id1, name1],
    ];

    //populate dictionary
    for (const item of reverseRow) {
      const [id, name] = item;
      if (typeof id === 'number') {
        dictionary[id] = name;
      }
    }

    //build category list
    const terminalIdx = reverseRow.findIndex(([id]) => typeof id === 'number');
    if (terminalIdx >= 0) {
      for (let i = terminalIdx + 1; i < reverseRow.length; ++i) {
        const [id] = reverseRow[i];
        categoryIds[id] = true;
      }
    }
  }

  let categoryTree = {
    id0: 0,
  };

  for (let rowIter = 0; rowIter < wrapupCategories.length; ++rowIter) {
    const { id1, id2, id3, id4, id5, id6 } = getRowItems(wrapupCategories[rowIter]);
    const row = [id1, id2, id3, id4, id5, id6];

    const lastCol = row.findIndex((x, i, arr) => i === arr.length - 1 || arr[i + 1] === null);
    if (!categoryIds.hasOwnProperty(row[lastCol])) {
      //only need to set terminal nodes here
      let path = 'children';
      for (let i = 0; i < lastCol; ++i) {
        path += `.id${row[i]}.children`;
      }
      path += `.id${row[lastCol]}`;
      const obj = { [`id${row[lastCol]}`]: row[lastCol], id: row[lastCol] };
      categoryTree = fpSet(path, obj, categoryTree);
    }
  }

  const lookupDictionary = (obj) => {
    return Object.keys(obj).reduce((acc, cur) => {
      let lookup = {};
      if (cur.slice(0, 2) === 'id' && cur.length > 2) {
        const id = cur.slice(2);
        lookup.id = Number(id);
        lookup.name = dictionary[id];
      } else {
        lookup[cur] = obj[cur];
      }
      return { ...acc, [cur]: obj[cur], ...lookup };
    }, {});
  };

  const recurseChildren = (obj) => {
    //lookup values
    let objCleaned = lookupDictionary(obj);

    if (objCleaned.hasOwnProperty('children')) {
      objCleaned.children = Object.keys(objCleaned.children).map((childKey) => {
        const lookupChild = lookupDictionary({
          [childKey]: childKey,
          ...objCleaned.children[childKey],
        });
        return recurseChildren({ [childKey]: objCleaned.children[childKey], ...lookupChild });
      });
    }
    return objCleaned;
  };

  const optionsTree = recurseChildren(categoryTree);
  return { optionsTree, dictionary };
};
