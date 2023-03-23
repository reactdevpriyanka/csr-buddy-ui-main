import axios from 'axios';
import useSWR from 'swr';

export default function usePetMedAllergies() {
  return useSWR(`/api/v1/pets/medAllergies`, async (url) =>
    axios.get(url).then(({ data }) => data),
  );
}
