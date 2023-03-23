import axios from 'axios';
import useSWR from 'swr';

export const usePetProfiles = (customerId, includePetInsurance = false) => {
  const { data, mutate } = useSWR(
    customerId
      ? `/v1/pets?customerId=${customerId}&includePetInsurance=${includePetInsurance}`
      : null,
    async (url) => axios.get(url).then(({ data }) => data),
    {
      revalidateOnFocus: false,
    },
  );

  return {
    data,
    mutate,
  };
};
