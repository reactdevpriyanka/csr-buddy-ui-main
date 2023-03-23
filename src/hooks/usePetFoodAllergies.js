import axios from 'axios';
import useSWR from 'swr';

export default function usePetFoodAllergies() {
  return useSWR(`/api/v1/pets/allergies`, async (url) => axios.get(url).then(({ data }) => data));
}
