export const parseReasons = (arr) => {
  return arr.reduce((reasonMap, reason) => {
    const { primary, secondary, tertiary } = reason;

    if (primary && !reasonMap[primary]) {
      reasonMap[primary] = {};
    }
    if (secondary && !reasonMap[primary][secondary]) {
      reasonMap[primary] = { ...reasonMap[primary], [secondary]: null };
    }
    if (tertiary) {
      reasonMap[primary] = {
        ...reasonMap[primary],
        [secondary]: { ...reasonMap[primary][secondary], [tertiary]: null },
      };
    }
    return reasonMap;
  }, {});
};

export const getReasonOptions = (reasons, { primary, secondary } = {}, prop = '') => {
  if (!reasons) return [];
  switch (prop) {
    case 'secondary':
      if (primary) {
        return Object.keys(reasons[primary]);
      }
      return [];
    case 'tertiary':
      if (primary && secondary && reasons[primary][secondary]) {
        return Object.keys(reasons[primary][secondary]);
      }
      return [];
    default:
      return Object.keys(reasons);
  }
};
