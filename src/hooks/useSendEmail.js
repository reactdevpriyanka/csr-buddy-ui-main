import axios from 'axios';

export default function useSendEmail() {
  const sendOrderEmail = async (body) => axios.post(`/api/v1/notification/publish`, body);
  return {
    sendOrderEmail,
  };
}
