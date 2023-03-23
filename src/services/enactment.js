/* import axios from 'axios'; */

export const createService = (config = {}) => {
  /* const instance = axios.create(config); */

  const dropPrivileges = () => {
    /* instance.get('/app/su/drop'); */
  };

  return {
    dropPrivileges,
  };
};
