import { useCallback } from 'react';
import axios from 'axios';
import useSWR from 'swr';

export default function usePetProfile(petProfileId) {
  const { data, mutate, error } = useSWR(
    petProfileId ? `/api/v1/pets/${petProfileId}` : null,
    async (url) => axios.get(url).then(({ data }) => data),
  );

  const createPetProfile = useCallback(async ({ customerId, data }) =>
    axios.post(`/api/v1/pets?customerId=${customerId}`, data),
  );

  const updatePetProfile = useCallback(async ({ customerId, petId, data }) =>
    axios.put(`/api/v1/pets/${petId}?customerId=${customerId}`, data),
  );

  return {
    data,
    error,
    mutate,
    createPetProfile,
    updatePetProfile,
  };
}
