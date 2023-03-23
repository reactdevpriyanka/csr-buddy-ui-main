import axios from 'axios';

export const useEnactUser = (customerId) => {
  const getEnactUser = async (backofficeAuthToken) => {
    return axios
      .get(`/gateway/configuration/enactUser/${customerId}`, {
        headers: {
          'csr-access-token': backofficeAuthToken,
        },
      })
      .then((res) => res.data);
  };

  return {
    getEnactUser,
  };
};
