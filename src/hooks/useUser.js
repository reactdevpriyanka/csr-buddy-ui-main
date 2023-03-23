import axios from 'axios';
import { SNACKVARIANTS } from '@components/SnackMessage/SnackMessage';
import { useSnackbar } from 'notistack';

export default function useUser() {
  const { enqueueSnackbar } = useSnackbar();

  const findUser = async (loginId, onSuccess) => {
    const url = loginId ? `/gateway/employeeproxy/v1/employee/accounts/loginId/${loginId}` : null;
    return axios
      .get(url, {
        data: null,
        headers: {
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
      })
      .then((data) => {
        onSuccess && onSuccess(data?.data?.data);
        return data?.data;
      })
      .catch(() => {
        enqueueSnackbar({
          messageHeader: 'Error',
          variant: SNACKVARIANTS.ERROR,
          messageSubheader: `Failed to find user ${loginId}`,
        });
      });
  };

  const createUser = async (userData, onSuccess) => {
    const dataObj = {
      data: {
        type: 'createEmployeeAccountRequest',
        id: '123',
        attributes: userData,
      },
    };

    return axios
      .post(`/gateway/employeeproxy/v1/employee/accounts`, dataObj, {
        headers: {
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
        responseType: 'json',
      })
      .then(() => onSuccess && onSuccess())
      .catch(() => {
        enqueueSnackbar({
          messageHeader: 'Error',
          variant: SNACKVARIANTS.ERROR,
          messageSubheader: 'Failed to Create User',
        });
      });
  };

  const updateUser = async (userData, onSuccess) => {
    const dataObj = {
      data: {
        type: 'updateEmployeeAccountRequest',
        id: '123',
        attributes: userData,
      },
    };

    return axios
      .put(`/gateway/employeeproxy/v1/employee/accounts/userId/${userData?.userId}`, dataObj, {
        headers: {
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
        responseType: 'json',
      })
      .then(() => onSuccess && onSuccess())
      .catch(() => {
        enqueueSnackbar({
          messageHeader: 'Error',
          variant: SNACKVARIANTS.ERROR,
          messageSubheader: 'Failed to update User',
        });
      });
  };

  const resetPassword = async (userId, userData, onSuccess) => {
    const dataObj = {
      data: {
        type: 'resetPasswordRequest',
        attributes: userData,
      },
    };

    const url = userId
      ? `/gateway/employeeproxy/v1/employee/accounts/userId/${userId}/password`
      : null;
    return axios
      .put(url, dataObj, {
        headers: {
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
        },
        responseType: 'json',
      })
      .then(() => {
        onSuccess && onSuccess();
      })
      .catch(() => {
        enqueueSnackbar({
          messageHeader: 'Error',
          variant: SNACKVARIANTS.ERROR,
          messageSubheader: 'Failed to reset the User password',
        });
      });
  };

  return {
    findUser,
    createUser,
    updateUser,
    resetPassword,
  };
}
