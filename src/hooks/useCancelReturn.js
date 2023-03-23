import axios from 'axios';

export default function useCancelReturn() {
  const cancelReturn = async ({ returnId }) => {
    return await axios.put(`/api/v1/returns/${returnId}/cancel`);
  };

  return { cancelReturn };
}
