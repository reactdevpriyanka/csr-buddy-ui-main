import { formatDeliveredDate, formatDeliveryDate, includesTime } from '@utils/dates';

export const itemGroupingHeader = (shippingStep, isMultipleShipments, ordinal, total) => {
  switch (shippingStep) {
    case 'ORDER_PLACED':
      return 'Processing Order';
    case 'PACKING_ITEMS':
      return 'Packing Order';
    default:
      return isMultipleShipments ? `Shipment ${ordinal} of ${total}` : `Shipment ${ordinal}`;
  }
};

export function getDeliveryEstimate(trackingData, deliveryDescriptions) {
  if (!trackingData) {
    return;
  }

  const isDelivered = trackingData.shippingStep === 'DELIVERED';

  const deliveryDescription = isDelivered ? 'Delivered on:' : 'Estimated Delivery:';
  // : `${deliveryDescriptions[trackingData.shippingStatus]}:`;

  let dateISO = isDelivered
    ? trackingData.trackingEvent?.date
    : trackingData.derivedDeliveryDate || trackingData.estimatedDeliveryDate;

  if (dateISO && !includesTime(dateISO)) {
    dateISO = `${dateISO}`;
  }

  const formattedDeliveryDate = formatDeliveryDate(dateISO, trackingData.shippingStep);

  return {
    deliveryDescription,
    formattedDeliveryDate,
  };
}

export function getDeliveredDeliveryEstimate(trackingData, deliveryDescriptions) {
  if (!trackingData) {
    return;
  }

  const isDelivered = trackingData.shippingStep === 'DELIVERED';

  const deliveryDescription = isDelivered ? 'Delivered on:' : 'Estimated Delivery:';
  // : `${deliveryDescriptions[trackingData.shippingStatus]}:`;

  let dateISO = isDelivered ? trackingData.trackingEvent?.date : trackingData.actualDeliveryTime;

  if (dateISO && !includesTime(dateISO)) {
    dateISO = `${dateISO}`;
  }

  const formattedDeliveryDate = formatDeliveredDate(dateISO, trackingData.shippingStep);

  return {
    deliveryDescription,
    formattedDeliveryDate,
  };
}

export function getLegacyDeliveryEstimate(tracking, deliveryDescriptions) {
  const isDelivered = tracking?.shippingStep === 'DELIVERED';

  const deliveryDescription = isDelivered
    ? 'Delivered on:'
    : `${deliveryDescriptions[tracking?.shippingStatus]}:`;

  const dateISO = isDelivered
    ? tracking?.trackingEvent && tracking?.trackingEvent.date
    : tracking?.estimatedDeliveryDate;

  const formattedDeliveryDate = formatDeliveryDate(dateISO, tracking?.shippingStep);

  return {
    deliveryDescription,
    formattedDeliveryDate,
  };
}

export const ORDER_ATTRIBUTE = {
  CANCELLABLE: 'CANCELLABLE',
  ADDRESS_UPDATABLE: 'ADDRESS_UPDATABLE',
  EDITABLE: 'EDITABLE',
  PRESCRIPTION: 'PRESCRIPTION',
  AUTOSHIP: 'AUTOSHIP',
};

export const LINE_ITEM_ATTRIBUTE = {
  QTY_REDUCIBLE: 'QTY_REDUCIBLE',
  CANCELLABLE: 'CANCELLABLE',
};

export const ORDER_STATUS = {
  CANCELED: 'CANCELED',
  IN_PROGRESS: 'IN_PROGRESS',
  ACTIVE:'ACTIVE'
};

export const ORDER_CANCEL_REASONS = [
  {
    label: 'Customer Initiated',
  },
  {
    label: 'Customer Request',
  },
  {
    label: 'Duplicate Order',
  },
  {
    label: 'Fraud',
  },
  {
    label: 'Gift Card Limit',
  },
  {
    label: 'Inventory Issue',
  },
  {
    label: 'No Response',
  },
  {
    label: 'Other',
  },
  {
    label: 'Payment Issue',
  },
  {
    label: 'Prescription Issue',
  },
  {
    label: 'Reseller',
  },
];
