import axios from 'axios';
import useCSRInfo from '@/hooks/useCSRInfo';
import { useMemo } from 'react';

export default function useCancelRelease() {
  const { data: csr } = useCSRInfo();
  const callerId = csr?.userId;
  const instance = useMemo(() => axios.create(), []);

  const cancelRelease = (orderId, releaseId) =>
    instance.post(
      `/gateway/proxy/orders/api/v1/orders/${orderId}/releases/${releaseId}/cancel`,
      {
        forceCancel: false,
      },
      {
        headers: {
          'Caller-id': callerId,
        },
      },
    );

  return { cancelRelease };
}
