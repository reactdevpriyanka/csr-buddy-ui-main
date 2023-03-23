import axios from 'axios';
import useSWR from 'swr';
import useSanitizedRouter from './useSanitizedRouter';

const BASE_URL = `/api/v1/giftcards`;

export default function useGiftCards() {
  const { id } = useSanitizedRouter();

  const {
    data: purchasedGiftCards,
    error: purchasedGiftCardsErrors,
  } = useSWR(`${BASE_URL}/purchased?customerId=${id}`, async (url) =>
    axios.get(url).then(({ data }) => data),
  );

  const {
    data: redeemedGiftCards,
    error: redeemedGiftCardsErrors,
  } = useSWR(`${BASE_URL}/redeemed?customerId=${id}`, async (url) =>
    axios.get(url).then(({ data }) => data),
  );

  return {
    purchasedGiftCards,
    purchasedGiftCardsErrors,
    redeemedGiftCards,
    redeemedGiftCardsErrors,
  };
}
