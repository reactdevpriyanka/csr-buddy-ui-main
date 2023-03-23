import { formatActivityEventDate, formatActivityContextEventDate } from './dates';
import { capitalize } from './string';

export const trackPackageTabs = {
  TRAVEL_HISTORY: 'Travel History',
  SHIPMENT_FACTS: 'Shipment Facts',
  FIX_ISSUE: 'Fix Issue',
};

export const newTrackPackageTabs = {
  TRAVEL_HISTORY: 'Travel History',
  SHIPMENT_FACTS: 'Shipment Facts',
};

export const trackPackageTabsList = [
  trackPackageTabs.TRAVEL_HISTORY,
  trackPackageTabs.SHIPMENT_FACTS,
  trackPackageTabs.FIX_ISSUE,
];

export const newTrackPackageTabsList = [
  newTrackPackageTabs.TRAVEL_HISTORY,
  newTrackPackageTabs.SHIPMENT_FACTS,
];

export const factPopupText = {
  SHIP_DATE: 'Ship date reflects date and time of origin time zone.',
  STANDARD_TRANSIT:
    'Standard transit is the date the package should be delivered by based on the selected service, destination, and ship date.',
  ACTUAL_DELIVERY:
    'The shipment is scheduled for delivery on or before the scheduled delivery displayed.',
};

/* Map of activity event codes to plain English. Likely not a complete list */
export const eventMap = {
  ORDER_ITEM_BLOCKED: 'Order Blocked',
  ORDER_RELEASED: 'Order Released',
  ORDER_CREATED: 'Order Created',
  SHIPPED: 'Shipment Scanned',
  840: 'Shipment Scanned',
  LOADED: 'Shipped',
  820: 'Shipped',
  'PICK COMPLETE': 'Order Picked',
  650: 'Order Picked',
  DELIVERED: 'Delivered',
  OUT_FOR_DELIVERY: 'Out For Delivery',
  ARRIVAL_SCAN: 'Arrival Scan',
  DEPARTURE_SCAN: 'Departure Scan',
  IN_TRANSIT: 'In Transit',
  ORDERED: 'Ordered',
};

export const getContextEventSubtitle = ({ date, address, isDeliveredEvent = false }) => {
  let subtitle = formatActivityContextEventDate(date);

  if (address && address?.city && !isDeliveredEvent) {
    subtitle = `${capitalize(address.city)}, ${address.state} | ${subtitle}`;
  }
  return subtitle;
};

export const getEventSubtitle = ({ date, address }) => {
  let subtitle = formatActivityEventDate(date);
  if (address && address?.city) {
    subtitle = `${capitalize(address.city)}, ${address.state} | ${subtitle}`;
  }
  return subtitle;
};

export const currentStatusMap = {
  DELAYED_BACKLOG: {
    label: 'Delayed due to Backlog',
    action:
      'If necessary, refund $4.95 shipping fee. If not, refund 10% (up to $10) off order. If customer needs to purchase food locally, offer concession equal to the smallest size/count.',
  },
  DELAYED_FC_SHIP: {
    label: 'Increase transit time due to shipping from a further FC',
    action:
      'If necessary, refund $4.95 shipping fee. If not, refund 10% (up to $10) off order. If customer needs to purchase food locally, offer concession equal to the smallest size/count.',
  },
  DELAYED_CARRIER: {
    label: 'Delayed in Transit by the Carriers',
    action:
      'If necessary, refund $4.95 shipping fee. If not, refund 10% (up to $10) off order. If customer needs to purchase food locally, offer concession equal to the smallest size/count.',
  },
  LOST_MISSING: {
    label: 'Lost Missing',
    action: 'Appease by offering a replacement.',
  },
  INCORRECT_ADDRESS: {
    label: 'INCORRECT_ADDRESS',
    action: 'Confirm address with customer and send to Supply.',
  },
  DAMAGED: {
    label: 'DAMAGED',
    action: 'Appease by offering a replacement.',
  },
  RETURN: {
    label: 'RETURN',
    action: 'Appease as needed.',
  },
  UNKNOWN: {
    label: 'UNKNOWN',
    action: 'Appease as needed.',
  },
};
