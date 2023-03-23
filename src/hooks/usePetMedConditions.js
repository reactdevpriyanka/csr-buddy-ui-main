import axios from 'axios';
import useSWR from 'swr';

export default function usePetMedConditions() {
  return useSWR(`/api/v1/pets/medConditions`, async (url) =>
    axios.get(url).then(({ data }) => data),
  );
}
