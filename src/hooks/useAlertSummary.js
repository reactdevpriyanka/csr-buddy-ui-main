import axios from 'axios';
import useSWR from 'swr';
import { useRouter } from 'next/router';

export const useAlertSummary = () => {
  const router = useRouter();
  const { id } = router.query;

  return useSWR(`/api/v1/agentNotes/summary?customerId=${id}`, async (url) =>
    axios.get(url).then(({ data }) => data),
  );
};
