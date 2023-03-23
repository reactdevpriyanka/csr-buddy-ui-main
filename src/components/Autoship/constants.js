export const MIN_NUM_DAYS = 1;
export const MAX_NUM_DAYS = 14;
export const MIN_NUM_WEEKS = 3;
export const MAX_NUM_WEEKS = 16;
export const MIN_NUM_MONTHS = 5;
export const MAX_NUM_MONTHS = 8;

export const MAX_MONTHS_IN_DAY = MAX_NUM_MONTHS * 30;
export const MAX_MONTHS_IN_WEEKS = MAX_NUM_MONTHS * 4;

export const isValidFequency = (frequency, frequencyUomType) => {
  if (frequencyUomType === frequencyUomTypesConst.DAY) {
    return frequency <= MAX_MONTHS_IN_DAY;
  } else if (frequencyUomType === frequencyUomTypesConst.WEEK) {
    return frequency <= MAX_MONTHS_IN_WEEKS;
  } else {
    return frequency <= MAX_NUM_MONTHS;
  }
};

export const frequencyUomTypesConst = {
  DAY: 'DAY',
  WEEK: 'WEEK',
  MON: 'MON',
};

export const frequencyUomTypes = {
  [frequencyUomTypesConst.DAY]: 'DAY',
  [frequencyUomTypesConst.WEEK]: 'WEEK',
  [frequencyUomTypesConst.MON]: 'MONTH',
};

export const frequencyUomTypeMapper = {
  [frequencyUomTypesConst.DAY]: 'Daily',
  [frequencyUomTypesConst.WEEK]: 'Weekly',
  [frequencyUomTypesConst.MON]: 'Monthly',
};

export const frequencyUomMapper = {
  [frequencyUomTypesConst.DAY]: 'days',
  [frequencyUomTypesConst.WEEK]: 'weeks',
  [frequencyUomTypesConst.MON]: 'months',
};

export const frequencyUomMap = {
  [frequencyUomTypesConst.DAY]: 'day',
  [frequencyUomTypesConst.WEEK]: 'week',
  [frequencyUomTypesConst.MON]: 'month',
};

export const frequencyUom = [
  { id: 1, label: 'Day', value: frequencyUomTypesConst.DAY },
  { id: 2, label: 'Week', value: frequencyUomTypesConst.WEEK },
  { id: 3, label: 'Month', value: frequencyUomTypesConst.MON },
];

export const getFrequency = (frequency, frequencyUom) => {
  const frequencyLable =
    frequency > 1
      ? `Every ${frequency} ${frequencyUomMapper[frequencyUom]}`
      : `Every ${frequency} ${frequencyUomMap[frequencyUom]}`;

  return frequency && frequencyUom ? frequencyLable : 'UNKNOWN';
};
