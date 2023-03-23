import PaymentDetails from '@components/PaymentDetails';

export default function mapper({ autoship }) {
  const {
    id,
    action,
    status,
    name,
    items,
    fulfillmentFrequency,
    fulfillmentFrequencyUom,
    shippingAddress,
    paymentMethods,
    nextFulfillmentDate,
    lastShipmentDate,
    cancelDate,
    lastOrderStatus,
    parentOrderId,
    total,
    totalAdjustment,
    totalBeforeTax,
    totalProduct,
    totalSalesTax,
    totalShipping,
    totalShippingTax,
    totalTax,
  } = autoship;
  const frequency =
    fulfillmentFrequency && fulfillmentFrequencyUom
      ? `Every ${fulfillmentFrequency} ${fulfillmentFrequencyUom}`
      : 'Unknown';
  const paymentDetails =
    (paymentMethods || []).length > 0 ? (
      <PaymentDetails details={paymentMethods} id={id} />
    ) : (
      'Unknown'
    );
  return {
    id,
    name,
    status,
    isUpcoming: status !== 'CANCELED',
    cancelDate,
    shippingAddress:
      shippingAddress && shippingAddress.city
        ? `${shippingAddress.addressLine1}, ${shippingAddress.city} ${shippingAddress.state}`
        : 'Unknown',
    paymentDetails,
    frequency,
    fulfillmentFrequency,
    fulfillmentFrequencyUom,
    products: items.map((item) => ({
      id: item.product.partNumber,
      title: item.product.name,
      price: item.totalProduct.value,
      quantity: item.quantity,
      thumbnail: item.product.thumbnail,
      catalogEntryId: item.product.catalogEntryId,
    })),
    nextFulfillmentDate,
    lastShipmentDate,
    lastOrderStatus,
    parentOrderId,
    autoshipTotals: {
      total: total?.value,
      totalAdjustment: totalAdjustment?.value,
      totalBeforeTax: totalBeforeTax?.value,
      totalProduct: totalProduct?.value,
      totalSalesTax: totalSalesTax?.value,
      totalShipping: totalShipping?.value,
      totalShippingTax: totalShippingTax?.value,
      totalTax: totalTax?.value,
    },
    action,
  };
}
