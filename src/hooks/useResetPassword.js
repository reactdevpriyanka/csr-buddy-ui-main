import axios from 'axios';

export default function useResetPassword() {
  const resetPassword = async (logonId) => axios.post(`/api/v1/passwordreset`, logonId);
  return {
    resetPassword,
  };
}
