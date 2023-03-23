import axios from 'axios';

export default function useResolveBlock() {
  const resolveOrderBlock = async ({ orderId, body }) =>
    axios.post(`/api/v1/order-block/${orderId}/resolveblock`, body);
  return {
    resolveOrderBlock,
  };
}
