import axios from 'axios';
import useSWR from 'swr';

export default function useFindChildOrders(subscriptionId) {
  return useSWR(
    `/api/v1/subscriptions/${subscriptionId}/orders`,
    async (url) =>
      axios
        .get(url)
        .then(({ data }) => data)
        .then((data) => {
          if (!data) return null;
          const orders = (data || []).sort((obj1, obj2) => {
            const obj1Date = new Date(obj1.timePlaced);
            const obj2Date = new Date(obj2.timePlaced);

            return obj2Date.getTime() - obj1Date.getTime();
          });
          return orders;
        }),
    { revalidateOnFocus: false },
  );
}
