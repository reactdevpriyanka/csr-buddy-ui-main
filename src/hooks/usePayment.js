import axios from 'axios';
import useSWR from 'swr';

export default function usePayment(orderNumber) {
  const { data, error } = useSWR(
    // orderNumber ? `/api/v1/orders/${orderNumber}/payments` : null,
    orderNumber ? `/api/v1/orders/order-payment-details/${orderNumber}` : null,
    async (url) => axios.get(url).then(({ data }) => data),
  );

  return {
    data,
    error,
  };
}
