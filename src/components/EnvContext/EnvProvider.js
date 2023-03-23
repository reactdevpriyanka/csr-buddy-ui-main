import PropTypes from 'prop-types';
import axios from 'axios';
import { useEffect, useState } from 'react';
import useRoles from '@/hooks/useRoles';
import Events from '@/components/OracleCommunicator/Events';
import { useRouter } from 'next/router';
import { useOracle } from '@/hooks';
import EnvContext from './EnvContext';

const EnvProvider = ({ children }) => {
  const router = useRouter();

  const oracle = useOracle();

  const [envVars, setEnvVars] = useState(null);

  const [error, setError] = useState(null);

  const { userRoles, authToken } = useRoles();

  useEffect(() => {
    axios
      .get('/app/api/config')
      .then(({ data }) => {
        setEnvVars(data || {});
      })
      .catch((error) => {
        setError(error);
      });
  }, []);

  const handleReload = () => {
    router.reload(router.asPath);
  };

  const refreshAuthTokens = () => {
    oracle?.emit('fetchAuthenticationTokens', {});
  };

  useEffect(() => {
    window.addEventListener(Events.REFRESH_PAGE, handleReload); //emitted from Communicator.js / osvc
    return () => window.removeEventListener(Events.REFRESH_PAGE, handleReload);
  }, [handleReload]);

  if (error) {
    return <div>Error</div>;
  }

  /**
   * Anything after this return statement will be rendered on the client side
   */
  if (!envVars) {
    return <div>Loading</div>;
  }

  return (
    <EnvContext.Provider
      value={{
        ...envVars,
        authToken,
        userRoles,
        refreshAuthTokens,
      }}
    >
      {children}
    </EnvContext.Provider>
  );
};

EnvProvider.propTypes = {
  children: PropTypes.node,
};

export default EnvProvider;
