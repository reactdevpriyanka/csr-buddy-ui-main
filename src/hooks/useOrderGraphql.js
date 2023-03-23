import useSWR from 'swr';
import useOrder from './useOrder';

export default function useOrderGraphql(orderId) {
  const { getOrderGraphql } = useOrder();
  return useSWR('/cs-platform/v1/orderDetailsGraphql', () => getOrderGraphql(orderId));
}
