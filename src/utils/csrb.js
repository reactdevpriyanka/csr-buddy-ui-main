import axios from 'axios';

const instance = axios.create({
  baseURL:
    process.env.CSRB_API_BASE_URL ||
    `https://csrb-api.use1.csbb.${process.env.SPRING_PROFILES_ACTIVE}.chewy.com`,
});

/**
 * @return {Promise}
 */
export const getCustomer = async (customerId) =>
  instance
    .get(`/api/v1/customer/${customerId}`)
    .then(({ data }) => data)
    .catch(() => null);

/**
 * @return {Promise}
 */
export const getActivities = async (customerId) =>
  instance
    .get(`/api/v1/activities?customerId=${customerId}`)
    .then(({ data }) => data)
    .catch(() => []);

/**
 * @return {Promise}
 */
export const getActivity = async ({ customerId, activityId }) =>
  getActivities(customerId)
    .then((data) => {
      const activity = data.find(
        (activity) =>
          activity?.data?.order?.id === activityId || activity?.data?.autoship?.id === activityId,
      );
      return activity;
    })
    .catch(() => null);

export default instance;
