import axios from 'axios';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { SNACKVARIANTS } from '@components/SnackMessage/SnackMessage';
import { useSnackbar } from 'notistack';

export default function useCustomer(customerId) {
  const router = useRouter();

  const { id } = router.query;

  const queryId = customerId ? customerId : id;

  const { data, error, mutate } = useSWR(
    queryId ? `/api/v1/customer/${queryId}` : null,
    async (url) => axios.get(url).then(({ data }) => data),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: true,
    },
  );

  const { enqueueSnackbar } = useSnackbar();

  const updateCustomer = async (customerId, customerData, onSuccess) =>
    axios
      .patch(`/api/v1/customer/${customerId}`, customerData)
      .then(() => onSuccess())
      .catch(() => {
        enqueueSnackbar({
          messageHeader: 'Error',
          variant: SNACKVARIANTS.ERROR,
          messageSubheader: 'Failed to Update Customer Details',
        });
      });

  return {
    data,
    error,
    updateCustomer,
    mutate,
  };
}
