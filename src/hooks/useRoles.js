import { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import Events from '@/components/OracleCommunicator/Events';
import useOracle from './useOracle';

export const ROLES = {
  LCSR: 'LICENSED_CUSTOMER_SERVICE_REPRESENTATIVE',
};

export default function useRoles() {
  const oracle = useOracle();
  const [userRoles, setUserRoles] = useState();
  const [authToken, setAuthToken] = useState();

  const handleAuth = (event) => {
    const token = event.detail?.authToken;
    setAuthToken(token);
    const decodedToken = jwt_decode(token);
    const roles = decodedToken?.realm_access?.roles;
    setUserRoles(roles);
  };

  useEffect(() => {
    window.addEventListener(Events.REFRESH_TOKEN, handleAuth); //emitted from Communicator.js / osvc
    oracle?.emit('fetchAuthenticationTokens', {});
    return () => window.removeEventListener(Events.REFRESH_TOKEN, handleAuth);
  }, []);

  return {
    userRoles,
    authToken,
  };
}
