import axios from 'axios';
import useSWR from 'swr';

export default function usePetMedication() {
  return useSWR(`/api/v1/pets/meds`, async (url) => axios.get(url).then(({ data }) => data));
}
