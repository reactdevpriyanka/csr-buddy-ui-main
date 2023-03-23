import axios from 'axios';

export default function useGateway() {
  const instance = axios.create();

  const resendReturnLabels = (returnId) => {
    return instance.post(`/gateway/proxy/returns/api/v1/returns/${returnId}/labels/resend`, {});
  };

  return {
    resendReturnLabels,
  };
}
