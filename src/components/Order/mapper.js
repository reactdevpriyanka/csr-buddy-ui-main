import PaymentDetails from '@components/PaymentDetails';
import { generateItemMap } from '@utils/items';

export default function mapper({ order }, onClick) {
  const {
    id,
    lineItems,
    payments: { paymentInstructions } = { paymentInstructions: [] },
    timePlaced,
    total: { value: total },
  } = order;
  const itemMap = generateItemMap(lineItems);
  const orderDate = timePlaced;

  const paymentDetails =
    paymentInstructions?.length > 0 ? (
      <PaymentDetails details={paymentInstructions?.map((p) => p.paymentMethod)} id={id} />
    ) : (
      'Unknown'
    );

  return {
    ...order,
    orderNumber: id,
    itemMap,
    orderDate,
    paymentDetails,
    total,
    onClick,
  };
}
