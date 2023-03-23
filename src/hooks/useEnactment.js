import { useMemo, useCallback } from 'react';
import { useRouter } from 'next/router';
import useEnv from '@/hooks/useEnv';
import useCSRInfo from '@/hooks/useCSRInfo';
import { useEnactUser } from '@/hooks/useEnactUser';
import { useFeature } from '@/features';
import { createService } from '@/services/enactment';
import { useSnackbar } from 'notistack';
import { SNACKVARIANTS } from '@components/SnackMessage/SnackMessage';
import jwt_decode from 'jwt-decode';
import Events from '@/components/OracleCommunicator/Events';

export default function useEnactment() {
  const router = useRouter();

  const { id: customerId } = router.query;

  const { sfwUrl: baseURL } = useEnv();

  const { data: csr } = useCSRInfo();

  const { authToken: backofficeAuthToken, refreshAuthTokens } = useEnv();

  const { enqueueSnackbar } = useSnackbar();

  const { getEnactUser } = useEnactUser(customerId);

  const enactmentEnabled = useFeature('feature.backoffice.sunset.enactmentEnabled');

  const modifyAutoshipEnactment = useFeature('feature.backoffice.sunset.modify.autoship.enactment');

  const service = useMemo(() => createService({ baseURL }), [baseURL]);

  const drop = useCallback(() => service.dropPrivileges(), [service]);

  const openEnactmentLogin = useCallback(async () => {
    if (!csr) {
      return;
    }

    if (enactmentEnabled) {
      window.addEventListener(Events.REFRESH_TOKEN, function eventHandler() {
        lockCartAndEnactUser();
        this.removeEventListener(Events.REFRESH_TOKEN, eventHandler);
      });
      refreshAuthTokens();
    } else {
      const qs = new URLSearchParams();
      qs.append('logonId', csr.logonId);
      qs.append('switchUserId', customerId);
      if (csr.epId) {
        qs.append('epid', `${csr.epId}`);
      }
      const tab = window.open(`${baseURL}/app/su?${qs.toString()}`);
      if (tab) {
        tab.focus();
      }
    }
  }, [baseURL, csr, customerId, enactmentEnabled]);

  const lockCartAndEnactUser = async (path = '') => {
    const cartHeaders = new Headers();

    cartHeaders.append('account', `${customerId}`);

    try {
      const enactUser = await getEnactUser(backofficeAuthToken);

      //Decode ticket token to get properties for shelter accounts
      const decodedTicket = jwt_decode(enactUser?.ticket);

      if (decodedTicket?.b2b_properties) {
        const orgId = decodedTicket?.b2b_properties?.org_id;
        const subSiteId = decodedTicket?.b2b_properties?.sub_site_id;

        cartHeaders.append('orgId', `${orgId}`);
        cartHeaders.append('subSiteId', `${subSiteId}`);
      }

      const cartRequestOptions = {
        method: 'PATCH',
        headers: cartHeaders,
      };

      const cartResponse = await fetch(`/gateway/cart/api/v1/cart/lock`, cartRequestOptions);

      if (cartResponse && enactUser?.at && enactUser?.ticket) {
        const requestHeaders = new Headers();
        requestHeaders.append('Location', `${baseURL}${path}`);
        requestHeaders.append('atcookie', `${enactUser.at}`);
        requestHeaders.append('ticketcookie', `${enactUser.ticket}`);

        if (csr.epId) {
          requestHeaders.append('epid', `${csr.epId}`);
        }

        const requestOptions = {
          method: 'GET',
          headers: requestHeaders,
          credentials: 'include',
        };

        const response = await fetch(`${baseURL}/app/su?rp=/app/account`, requestOptions);

        if (response && response.ok) {
          const tab = window.open(`${baseURL}${path}`, '_blank');
          if (tab) {
            tab.focus();
          }
        }
      } else {
        enqueueSnackbar({
          messageHeader: 'Error',
          variant: SNACKVARIANTS.ERROR,
          messageSubheader:
            'Cart could not be locked or failed to get enact user auth, check the network tab for more info',
        });
      }
    } catch {
      enqueueSnackbar({
        messageHeader: 'Error',
        variant: SNACKVARIANTS.ERROR,
        messageSubheader: 'Error occurred while enacting the customer.',
      });
    }
  };

  const openEnactmentPage = async (path) => {
    if (modifyAutoshipEnactment) {
      window.addEventListener(Events.REFRESH_TOKEN, function eventHandler() {
        lockCartAndEnactUser(path);
        this.removeEventListener(Events.REFRESH_TOKEN, eventHandler);
      });

      refreshAuthTokens();
    } else {
      const tab = window.open(`${baseURL}${path}`, '_blank');
      if (tab) {
        tab.focus();
      }
    }
  };

  return { drop, openEnactmentPage, openEnactmentLogin };
}
