import { getDayDateYearTimeTimezone } from '@/utils';
import { multiply } from 'lodash';

export const AllowableActions = {
  RETURN_ITEMS: 'RETURN_ITEMS',
  SEND_ORDER_INVOICE: 'SEND_ORDER_INVOICE',
  SEND_ORDER_CONFIRMATION: 'SEND_ORDER_CONFIRMATION',
  SEND_ORDER_CANCELED_NOTIFICATION: 'SEND_ORDER_CANCELED_NOTIFICATION',
  ALLOCATE_INVENTORY: 'ALLOCATE_INVENTORY',
  ADD_FULFILLMENT_COMMENT: 'ADD_FULFILLMENT_COMMENT',
  BLOCK_ORDER: 'BLOCK_ORDER',
  FORCE_RELEASE_ORDER: 'FORCE_RELEASE_ORDER',
  PROCESS_ORDER: 'PROCESS_ORDER',
  CANCEL_ORDER: 'CANCEL_ORDER',
  EDIT_SHIPPING_ADDRESS: 'EDIT_SHIPPING_ADDRESS',
  ADD_PROMOTION_CODE: 'ADD_PROMOTION_CODE',
  ADD_PRICE_ADJUSTMENT: 'ADD_PRICE_ADJUSTMENT',
  REMOVE_ITEM: 'REMOVE_ITEM',
  REDUCE_QUANTITY: 'REDUCE_QUANTITY',
  CREATE_PACKAGE: 'CREATE_PACKAGE',
  CONFIRM_SHIPMENT: 'CONFIRM_SHIPMENT',
  RESEND_SHIPMENT_MESSAGE: 'RESEND_SHIPMENT_MESSAGE',
  FORCE_CANCEL_RELEASE: 'FORCE_CANCEL_RELEASE',
  CANCEL_RELEASE: 'CANCEL_RELEASE',
  CANCEL_RETURN: 'CANCEL_RETURN',
  MARK_AS_RECEIVED: 'MARK_AS_RECEIVED',
  CREATE_NEW_LABELS: 'CREATE_NEW_LABELS',
};

export const AllowableActionTypes = {
  ORDER_ACTIONS: 'orderActions',
  RELEASE_ACTIONS: 'releaseActions',
  RETURN_ACTIONS: 'returnActions',
};

export const PackageReleaseTypes = Object.freeze({
  PACKAGE: Symbol('package'),
  RELEASE: Symbol('release'),
});

// format supplemental data attributes to for tooltip text
export const getAttributes = (tag, attributesMap, vetContactInfo, product, rowData, testId) => {
  switch (tag) {
    case 'DISCONTINUED':
      return (
        <span>
          {product?.discontinueDate != null && (
            <span data-testid="tag:discontinueDate" key="discontinueDate">
              <b>Discontinued Date:</b> {getDayDateYearTimeTimezone(product.discontinueDate)}
            </span>
          )}
        </span>
      );
    // case 'OUT_OF_STOCK': Disabling this until Force BackOrder and OOS back in stock dates are available in the api
    //   return (
    //     <span>
    //       {product?.discontinueDate != null && (
    //         <span key="discontinueDate">
    //           <b>Back in Stock Date:</b>
    //         </span>
    //       )}
    //     </span>
    //   );
    // case 'FORCED_BACK_ORDER':
    //   return (
    //     <span>
    //       {product?.discontinueDate != null && (
    //         <span key="discontinueDate">
    //           <b>Available Date:</b>
    //         </span>
    //       )}
    //     </span>
    //   );
    case 'CONNECT_WITH_A_VET':
      return attributesMap ? (
        <span>
          {vetContactInfo?.petName != null && (
            <span data-testid="tag:petName" key="petName">
              Pet Name: {vetContactInfo.petName}
              <br />
            </span>
          )}
          {attributesMap?.reason != null && (
            <span data-testid="tag:appointmentReason" key="appointmentReason">
              Appointment Reason: {attributesMap.reason}
              <br />
            </span>
          )}
          {attributesMap?.id != null && (
            <span data-testid="tag:appointmentId" key="appointmentId">
              Appointment ID: {attributesMap.id}
              <br />
            </span>
          )}
          {attributesMap?.endTime != null && (
            <span data-testid="tag:appointmentEndTime" key="appointmentEndTime">
              Appointment End Time: {`${getDayDateYearTimeTimezone(attributesMap.endTime)}`}
              <br />
            </span>
          )}
        </span>
      ) : null;
    case 'PHARMACY':
      return vetContactInfo ? (
        <span>
          {vetContactInfo?.clinicName != null && (
            <span data-testid="tag:clinicName" key="clinicName">
              Clinic Name: {vetContactInfo.clinicName}
              <br />
            </span>
          )}
          {vetContactInfo?.contactVet != null && (
            <span data-testid="tag:vetContacted" key="vetContacted">
              Vet Contacted: {vetContactInfo.contactVet ? 'Yes' : 'No'}
              <br />
            </span>
          )}
          {vetContactInfo?.vetProfileId != null && (
            <span data-testid="tag:vetProfileId" key="vetProfileId">
              Vet Profile ID: {vetContactInfo.vetProfileId}
              <br />
            </span>
          )}
          {vetContactInfo?.petName != null && (
            <span data-testid="tag:petName" key="petName">
              Pet Name: {vetContactInfo.petName}
              <br />
            </span>
          )}
        </span>
      ) : null;
    case 'DROPSHIP':
      return (
        <span>
          {rowData?.minDeliveryDate != null && rowData?.maxDeliveryDate != null && (
            <span data-testid="tag:minDeliveryDate" key="minDeliveryDate">
              <b>Delivers between:</b> {getDayDateYearTimeTimezone(rowData.minDeliveryDate)} and{' '}
              {getDayDateYearTimeTimezone(rowData.maxDeliveryDate)}
            </span>
          )}
        </span>
      );
    case 'PERSONALIZED':
      const entries = Object.entries(product?.personalizationAttributeMap || {}).sort(
        (obj1, obj2) => {
          return obj1[0].localeCompare(obj2[0]);
        },
      );
      return (
        <span>
          {entries?.map((entry) => {
            return (
              <div key={entry[0]}>
                <span data-testid={`tag:personalized:${entry[0]}`}>
                  <b>{entry[0]}:</b> {entry[1]}
                </span>
              </div>
            );
          })}
        </span>
      );
    default:
      return null;
  }
};

export const generateReturnItemKey = (returnItem) => returnItem.type + '_' + returnItem.state;

// Sums up the total quantity returned for each type of unique return
export const createTotalReturnedQuantities = (returnItems) => {
  const totalReturnedQuantities = {};

  for (const returnItem of returnItems) {
    const key = returnItem.lineItemId;
    const innerKey = generateReturnItemKey(returnItem);

    if (!totalReturnedQuantities[key]) {
      totalReturnedQuantities[key] = {};
    }

    if (!totalReturnedQuantities[key][innerKey]) {
      totalReturnedQuantities[key][innerKey] = 0;
    }

    // When either type of concession fails, the return service gives us back a totalCredit of 0 and no quantity field.
    // Because of this, we treat each concession like a totalCredit of 1 so it can be distributed to shipments like other concessions
    let specialCaseIncrement = 0;
    if (innerKey === 'PRODUCT_CONCESSION_FAILED' || innerKey === 'SHIPPING_CONCESSION_FAILED') {
      specialCaseIncrement = 1;
    }

    const increment =
      returnItem.type === 'PRODUCT_CONCESSION' || returnItem.type === 'SHIPPING_CONCESSION'
        ? returnItem?.totalCredit + specialCaseIncrement
        : returnItem?.quantity + specialCaseIncrement;

    totalReturnedQuantities[key][innerKey] += increment;
  }

  return totalReturnedQuantities;
};

export const orderHasItemsSpreadAcrossShipments = (shipments, currShipment, itemMap = {}) => {
  if (shipments?.length === 1) return false;

  const lineItemIds = Object.keys(itemMap);
  for (const lineItemId of lineItemIds) {
    const otherShipmentLineItemIds = shipments
      ?.filter((shipment) => shipment.id !== currShipment.id)
      ?.map((shipment) => shipment?.shipmentItems)
      ?.flat()
      ?.map(({ lineItemId }) => lineItemId);
    if (otherShipmentLineItemIds?.includes(lineItemId)) return true;
  }
  return false;
};

// When the same lineItemId is found across multiple shipments, we have no way of knowing which returnItems (if any)
// are attributed to any specific item in any specific shipment.
//
// The number of returns processed for a lineItemId will always be less than the total quantity of that lineItemId across all shipments
// so we iterate through the shipments untill we run out of return tags for that lineItemId.
export const assignReturnsToShipments = (shipments, returnItems, itemMap = {}) => {
  const totalReturnedQuantities = createTotalReturnedQuantities(returnItems);

  for (const [index, shipment] of shipments.entries()) {
    for (const shipmentItem of shipment.shipmentItems) {
      const lineItemId = shipmentItem.lineItemId;

      if (totalReturnedQuantities[lineItemId]) {
        const returnTagsToRender = Object.entries(totalReturnedQuantities[lineItemId])
          ?.filter(([returnItemKey, quantityReturned]) => quantityReturned >= 0.001)
          ?.map(([returnItemKey, quantityReturned]) => returnItemKey);

        shipments[index] = {
          ...shipment,
          returnTagsToRender: returnTagsToRender,
        };

        for (const returnItemKey in totalReturnedQuantities[lineItemId]) {
          const returnedQuantity = totalReturnedQuantities[lineItemId][returnItemKey];
          if (returnedQuantity < 0) continue; // No need to continue to compute if there is no returnable quantity left for a lineItemId

          const returnItem = returnItems.find(
            (item) => generateReturnItemKey(item) === returnItemKey,
          );

          if (!returnItem) continue;

          let quantityToDecrement;

          switch (returnItem?.type) {
            case 'PRODUCT_CONCESSION':
              quantityToDecrement = multiply(
                shipmentItem?.quantity * Number.parseFloat(itemMap[lineItemId]?.unitPrice?.value),
              );
              break;
            case 'SHIPPING_CONCESSION':
              quantityToDecrement = returnItem?.totalCredit;
              break;
            case 'REPLACEMENT':
            case 'REFUND':
              quantityToDecrement = shipmentItem?.quantity;
              break;
            default:
              quantityToDecrement = 0;
              break;
          }

          // Subtract the decrement quantity from the quantity of items (or total value of products in concession scenarios)
          // returned to only add returns to be rendered to a shipment if there were enough returns to justify it
          // when the same lineItemId is spread across multiple packages
          totalReturnedQuantities[lineItemId][returnItemKey] =
            returnedQuantity - quantityToDecrement;
        }
      }
    }
  }
};
