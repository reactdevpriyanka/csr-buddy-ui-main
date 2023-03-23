import axios from 'axios';

export default function useCreateOrderBlock() {
  const createOrderBlock = async ({ orderId, body }) => {
    return await axios.post(`/api/v1/order-block/${orderId}/block`, body);
  };

  return { createOrderBlock };
}
