import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import NavigationContext from '@components/NavigationContext';
import {
  setSessionStorageItemByKey,
  getSessionStorageItemByKey,
  removeSessionStorageItemByKey,
} from '@/utils/sessionStorage';
import { useRouter } from 'next/router';

const NavigationProvider = ({ children }) => {
  const [prevRoute, setPrevRoute] = useState();
  const [prevRouteTag, setPrevRouteTag] = useState();
  const [isInitialLoad, setInitialLoad] = useState(true);
  const router = useRouter();

  const storePrevRoute = ({ prevRoute, prevRouteTag }) => {
    setPrevRoute(prevRoute);
    setPrevRouteTag(prevRouteTag);

    setSessionStorageItemByKey('main:navProvider', router?.query?.id || 'default', {
      prevRoute,
      prevRouteTag,
    });
  };

  const resetPrevRoute = () => {
    setPrevRoute(null);
    setPrevRouteTag(null);

    removeSessionStorageItemByKey('main:navProvider', router?.query?.id || 'default');
  };

  useEffect(() => {
    if (isInitialLoad) {
      setInitialLoad(false);

      const sessionStorage =
        getSessionStorageItemByKey('main:navProvider', router?.query?.id || 'default') || {};
      setPrevRoute(sessionStorage?.prevRoute);
      setPrevRouteTag(sessionStorage?.prevRouteTag);
    }
  }, [isInitialLoad]);

  const valueModalContext = {
    prevRoute,
    setPrevRoute,
    prevRouteTag,
    setPrevRouteTag,
    storePrevRoute,
    resetPrevRoute,
  };

  return (
    <NavigationContext.Provider value={valueModalContext}>{children}</NavigationContext.Provider>
  );
};

NavigationProvider.propTypes = {
  children: PropTypes.node,
};

export default NavigationProvider;
