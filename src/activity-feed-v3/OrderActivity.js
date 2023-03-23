import Order from '@/components/Order';
import PaymentDetails from '@components/PaymentDetails';
import { generateItemMap } from '@/utils/items';
import { suzzie } from '@/utils/env';
import useActivity from './useActivity';

export default function OrderActivity() {
  const {
    id,
    timePlaced,
    total,
    status,
    blocks,
    shipments,
    notShippedItems,
    notReleasedLineItems,
    releasesNotShippedItems,
    canceledItems,
    updatedItems,
    notifications,
    trackingData,
    timeUpdated,
    orderAttributes,
    payments,
    returnItems,
    shippingAddress,
    subscriptionInfos,
    cancelReason,
    lineItems,
    replaces,
    releases,
  } = useActivity();

  const detailsLink = suzzie(`/orders/${id}`);

  const itemMap = generateItemMap(lineItems);

  const { paymentInstructions = [] } = payments || {};

  const paymentDetails =
    paymentInstructions?.length > 0 ? (
      <PaymentDetails details={paymentInstructions.map((p) => p.paymentMethod)} id={id} />
    ) : (
      'Unknown'
    );

  return (
    <Order
      id={id}
      orderNumber={id}
      orderDate={timePlaced}
      total={total}
      itemMap={itemMap}
      status={status}
      blocks={blocks}
      shipments={shipments}
      notShippedItems={notShippedItems}
      canceledItems={canceledItems}
      updatedItems={updatedItems}
      notifications={notifications}
      trackingData={trackingData}
      timeUpdated={timeUpdated}
      detailsLink={detailsLink}
      orderAttributes={orderAttributes}
      paymentDetails={paymentDetails}
      returnItems={returnItems}
      shippingAddress={shippingAddress}
      subscriptionInfos={subscriptionInfos}
      cancelReason={cancelReason}
      replaces={replaces}
      notReleasedLineItems={notReleasedLineItems}
      releasesNotShippedItems={releasesNotShippedItems}
      lineItems={lineItems}
      releases={releases}
    />
  );
}

OrderActivity.propTypes = {};
