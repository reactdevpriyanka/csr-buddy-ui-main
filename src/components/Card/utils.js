import { snakeCaseToTitleCase } from '@/utils/string';

const validReturnStates = new Set([
  'SUBMITTED',
  'VERIFYING',
  'RECEIVE_WAIT',
  'PAY_WAIT',
  'GIFT_CARD_CASH_OUT_WAIT',
  'GIFT_CARD_CLOSE_WAIT',
  'GIFT_CARD_CLOSED',
  'VERIFIED',
  'PROCESSING',
  'TAX_WAIT',
  'PROCESSED',
  'CANCELLING',
  'CANCELING',
  'CANCELLED',
  'CANCELED',
  'IMPORTED_IN_FLIGHT',
  'VET_DIET',
  'FAILED',
]);

export const ITEM_TYPE = {
  DISCONTINUED: Symbol.for('DISCONTINUED'),
  OUT_OF_STOCK: Symbol.for('OUT_OF_STOCK'),
  PERSONALIZED: Symbol.for('PERSONALIZED'),
  FROZEN: Symbol.for('FROZEN'),
  CONNECT_WITH_A_VET: Symbol.for('CONNECT_WITH_A_VET'),
  PHARMACY: Symbol.for('PHARMACY'),
  DROPSHIP: Symbol.for('DROPSHIP'),
  FORCED_BACKORDER: Symbol.for('FORCED_BACK_ORDER'),
  BUNDLED_ITEM: Symbol.for('BUNDLED'),
  VET_DIET: Symbol.for('VET_DIET'),
};

export const ITEM_TYPES_LABELS = {
  [ITEM_TYPE.DISCONTINUED]: 'DISCONTINUED ITEM',
  [ITEM_TYPE.OUT_OF_STOCK]: 'OUT OF STOCK',
  [ITEM_TYPE.PERSONALIZED]: 'PERSONALIZED ITEM',
  [ITEM_TYPE.CONNECT_WITH_A_VET]: 'CONNECT WITH A VET',
  [ITEM_TYPE.PHARMACY]: 'PHARMACY ITEM',
  [ITEM_TYPE.DROPSHIP]: 'DROPSHIPPED ITEM',
  [ITEM_TYPE.FORCED_BACKORDER]: 'FORCED BACKORDER',
  [ITEM_TYPE.BUNDLED_ITEM]: 'BUNDLED ITEM',
  [ITEM_TYPE.VET_DIET]: 'VET DIET ITEM',
};

export const formatItemType = (status) => {
  return ITEM_TYPES_LABELS[Symbol.for(status)] || status;
};

export const notInStock = (tag) => {
  return tag.includes('OUT_OF_STOCK') || tag.includes('FORCED_BACK_ORDER');
};

export const formatReturnType = (enumStr) => {
  switch (enumStr) {
    case 'PRODUCT_CONCESSION':
      return 'Concession';
    default:
      return snakeCaseToTitleCase(enumStr);
  }
};

export const formatReturnState = (state) => {
  switch (state) {
    case 'FAILED':
      return 'Failed';
    case 'CANCELED':
    case 'CANCELLED':
      return 'Canceled';
    case 'PROCESSED':
      return 'Completed';
    default:
      return validReturnStates.has(state?.toUpperCase()) ? 'Pending' : state;
  }
};

export const formatAction = (type, state) =>
  `${formatReturnType(type)} ${formatReturnState(state)}`;
