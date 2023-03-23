import { useActivity } from '@/activity-feed-v3';
import AutoshipCard from '@/components/Autoship/AutoshipCard';
import { suzzie } from '@/utils/env';
import PaymentDetails from '@components/PaymentDetails';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AutoshipActivity() {
  const router = useRouter();
  const {
    status: autoshipStatus,
    cancelDate,
    isUpcoming,
    fulfillmentFrequencyUom,
    fulfillmentFrequency,
    id,
    name,
    nextFulfillmentDate,
    lastShipmentDate,
    lastOrderStatus,
    paymentMethods,
    items = [],
    shippingAddress,
    blocks = [],
    orderFees,
  } = useActivity();

  const action = suzzie(`/subscriptions/${id}`);

  useEffect(() => {
    setTimeout(() => {
      //allows dom to render the card before we scroll to it
      if (
        router.query?.autoshipId?.toString() === id?.toString() &&
        router.pathname.endsWith('/autoship')
      ) {
        const autoshipCard = document.querySelector(`#AutoshipCard_${id}`);
        autoshipCard.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        const preStyle = { ...autoshipCard.style };
        autoshipCard.style.transition = 'all 0.2s';
        autoshipCard.style.outline = '#1C49C2 1px solid';
        autoshipCard.style.border = '2px solid #1C49C2';
        autoshipCard.style.boxShadow = '0px 0px 4px 2px rgb(28, 73, 194, 0.6)';
        setTimeout(() => {
          autoshipCard.style = preStyle;
        }, 3000);
      }
    }, 500);
  }, []);

  const products = items.map((item) => ({
    id: item?.product?.catalogEntryId,
    catalogEntryId: item?.product?.catalogEntryId,
    partNumber: item?.product?.partNumber,
    thumbnail: item?.product?.thumbnail,
    price: item?.totalProduct?.value,
    title: item?.product?.name,
    quantity: item?.quantity,
  }));

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

  return (
    <AutoshipCard
      action={action}
      status={autoshipStatus}
      cancelDate={cancelDate}
      isUpcoming={isUpcoming}
      frequency={frequency}
      fulfillmentFrequencyUom={fulfillmentFrequencyUom}
      fulfillmentFrequency={fulfillmentFrequency}
      id={id}
      name={name}
      nextFulfillmentDate={nextFulfillmentDate}
      lastShipmentDate={lastShipmentDate}
      lastOrderStatus={lastOrderStatus}
      paymentDetails={paymentDetails}
      products={products}
      shippingAddress={shippingAddress}
      blocks={blocks}
      orderFees={orderFees}
    />
  );
}

AutoshipActivity.propTypes = {};
