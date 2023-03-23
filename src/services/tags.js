import axios from 'axios';
import { add } from 'date-fns';

export const updateTag = async ({ customerId, tag }) =>
  axios.post(`/api/v1/customer/${customerId}/tags`, {
    ...tag,
    expiresAt: add(new Date(), { years: 1 }).toISOString(),
  });
