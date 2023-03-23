import axios from 'axios';
import useSWR from 'swr';
import useSanitizedRouter from '@/hooks/useSanitizedRouter';

export default function useGetAgentAlert() {
  const { id } = useSanitizedRouter();

  return useSWR(`/api/v1/agentNotes?customerId=${id}`, async (url) =>
    axios.get(url).then(({ data }) => data.map((alerts) => ({ ...alerts }))),
  );
}
