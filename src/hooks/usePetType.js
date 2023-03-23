import axios from 'axios';
import useSWR from 'swr';

export default function usePetType() {
  return useSWR(`/api/v1/pets/types`, async (url) => axios.get(url).then(({ data }) => data));
}
