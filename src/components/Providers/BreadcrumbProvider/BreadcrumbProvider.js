import { useEffect, useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import useFeature from '@/features/useFeature';
import BreadcrumbContext from '@/components/BreadCrumbs/BreadcrumbContext';
import { getSessionStorageItemByKey, setSessionStorageItemByKey } from '@/utils/sessionStorage';
import { isCrumbCoreNav } from '@/utils/breadcrumbUtils';
import { useRouter } from 'next/router';
import { DefaultBreadcrumbContext } from '@/constants/breadcrumbConst';

const BreadcrumbProvider = ({ children }) => {
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [isInitialLoad, setInitialLoad] = useState(true);
  const router = useRouter();
  const dynamicBreadcrumbProviderEnabled = useFeature(
    'feature.explorer.dynamicBreadcrumbProviderEnabled',
  );

  const addBreadcrumb = (breadcrumb) => {
    const isCoreNav = isCrumbCoreNav(breadcrumb);
    let curBreadcrumbs = [...(breadcrumbs || [])];

    if (isCoreNav) {
      curBreadcrumbs = [breadcrumb];
    } else {
      // We don't want to include the disabled in the
      // matching criteria
      const matchIdx = _.findIndex(curBreadcrumbs, (crumb) => {
        return (
          crumb.id === breadcrumb.id &&
          crumb.link === breadcrumb.link &&
          crumb.title === breadcrumb.title
        );
      });

      if (matchIdx >= 0) {
        curBreadcrumbs = _.slice(curBreadcrumbs, 0, matchIdx + 1);
      } else {
        curBreadcrumbs.push(breadcrumb);
      }
    }

    setSessionStorageItemByKey(
      'main:breadcrumbProvider',
      router?.query?.id || 'default',
      curBreadcrumbs,
    );
    setBreadcrumbs(curBreadcrumbs);
  };

  const storeBreadcrumbs = (curBreadcrumbs) => {
    setSessionStorageItemByKey(
      'main:breadcrumbProvider',
      router?.query?.id || 'default',
      curBreadcrumbs,
    );
  };

  const resetBreadcrumbs = (crumbs = []) => {
    storeBreadcrumbs(crumbs);
    setBreadcrumbs(crumbs);
  };

  useEffect(() => {
    if (isInitialLoad) {
      setInitialLoad(false);

      const sessionStorageBreadcrumbs = getSessionStorageItemByKey(
        'main:breadcrumbProvider',
        router?.query?.id || 'default',
      ) || { breadcrumbs: [] };

      let curBreadcrumbs = [...Object.values(sessionStorageBreadcrumbs)];

      const { id, orderId } = router?.query || {};

      let isReload = false;

      try {
        if (window?.performance?.getEntriesByType) {
          isReload = window?.performance?.getEntriesByType('navigation')[0].type === 'reload';
        }
      } catch {}

      if (_.isEmpty(curBreadcrumbs)) {
        // This means we want to navigate to order details
        // but we didn't have anthing stored in session.
        // We need to create and add a "Activity Feed" crumb mannually
        if (id && orderId) {
          const activityCrumb = {
            id: 'activityFeed',
            title: 'Activity Feed',
            link: `/customers/${id}/activity`,
          };
          curBreadcrumbs = [activityCrumb];
        }
      } else {
        // This means we want to navigate to order details
        // but we didn't have anthing stored in session.
        // We need to create and add a "Activity Feed" crumb mannually
        if (!isReload && id && orderId) {
          const activityCrumb = {
            id: 'activityFeed',
            title: 'Activity Feed',
            link: `/customers/${id}/activity`,
          };
          const detailsCrumb = {
            id: 'OrderDetails',
            title: `Order #${orderId}`,
            link: `/customers/${id}/orders/${orderId}`,
          };
          curBreadcrumbs = [activityCrumb, detailsCrumb];
        }
      }

      setBreadcrumbs([...curBreadcrumbs]);
    }
  }, [isInitialLoad]);

  const ActiveValueModalContext = {
    setBreadcrumbs,
    addBreadcrumb,
    resetBreadcrumbs,
    breadcrumbs,
  };

  const valueModalContext = dynamicBreadcrumbProviderEnabled
    ? ActiveValueModalContext
    : DefaultBreadcrumbContext;

  return (
    <BreadcrumbContext.Provider value={valueModalContext}>{children}</BreadcrumbContext.Provider>
  );
};

BreadcrumbProvider.propTypes = {
  children: PropTypes.node,
};

export default BreadcrumbProvider;
