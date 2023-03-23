import axios from 'axios';
import useSWR from 'swr';
import useSanitizedRouter from './useSanitizedRouter';

const BASE_URL = `/api/v1/promotions`;

export default function usePromotions() {
  const { id } = useSanitizedRouter();

  const {
    data: assignedPromotions,
    error: assignedPromotionsErrors,
  } = useSWR(`${BASE_URL}/assigned?customerId=${id}`, async (url) =>
    axios.get(url).then(({ data }) => data),
  );

  const {
    data: promotionsHistory,
    error: promotionsHistoryErrors,
  } = useSWR(`${BASE_URL}/history?customerId=${id}`, async (url) =>
    axios.get(url).then(({ data }) => data),
  );

  return {
    assignedPromotions,
    assignedPromotionsErrors,
    promotionsHistory,
    promotionsHistoryErrors,
  };
}
