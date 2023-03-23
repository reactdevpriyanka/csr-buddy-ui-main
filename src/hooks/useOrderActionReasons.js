import useSWR from 'swr';
import useOrder from '@/hooks/useOrder';

export default function useOrderActionReasons() {
  const { getOrderCancelReasons } = useOrder();
  return useSWR(`/gateway/proxy/orders/orderCancelReasons`, getOrderCancelReasons, {
    //get order cancel reasons
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    errorRetryInterval: 0,
    errorRetryCount: 3,
    shouldRetryOnError: true,
  });
}
