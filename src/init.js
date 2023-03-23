/* eslint-disable react-hooks/rules-of-hooks */
/**
 * NOTES
 *
 * 1) Disabling the 'rules-of-hooks' rule because these are custom hooks
 *    that technically can be utilized outside of React components
 */
import axios from 'axios';
import { datadogLogs } from '@datadog/browser-logs';
import { datadogRum } from '@datadog/browser-rum';

import(
  /* webpackChunkName: "oracle" */
  `./oracle${process.env.NEXT_PUBLIC_MOCK_ORACLE ? '-fake' : ''}` //NOSONAR
);

/**
 * Only run on the client-side
 */
if (typeof window !== typeof undefined) {
  axios
    .get('/app/api/config')
    .then(({ data: { appVersion, chewyEnv } }) => {
      datadogLogs.init({
        clientToken: 'pub117d8d1e5a4b99fb2d5cba0072b63256',
        site: 'datadoghq.com',
        service: 'csrb-ui',
        version: appVersion,
        env: chewyEnv,
        forwardErrorsToLogs: true,
        sampleRate: 100,
        trackSessionAcrossSubdomains: true,
        useCrossSiteSessionCookie: true,
        useSecureSessionCookie: process.env.NEXT_PUBLIC_NODE_ENV === 'production',
      });

      datadogRum.init({
        applicationId: 'e5382886-3090-48f5-a542-4ff372a20eb5',
        clientToken: 'pub0856250ff20a45f808f85702af00ae21',
        site: 'datadoghq.com',
        service: 'csrb-ui',
        version: appVersion,
        env: chewyEnv,
        forwardErrorsToLogs: true,
        sampleRate: 100,
        trackInteractions: true,
        trackSessionAcrossSubdomains: true,
        useCrossSiteSessionCookie: true,
        useSecureSessionCookie: process.env.NEXT_PUBLIC_NODE_ENV === 'production',
        beforeSend: (event, context) => {
          if (event.type === 'action') {
            axios.put('/app/api/ingest-clickstream', {
              source: 'csrb',
              agentName: event.usr?.agentName,
              agentAction: `${event.action?.type} on ${event.action?.target?.name}`,
              logonId: event.usr?.logonId,
              agentId: event.usr?.userId,
              agentProfile: event.usr?.profile,
              incidentId: event.context?.incidentData?.incidentId,
              timestamp: new Date().toISOString(),
            });
          }

          return true;
        },
      });
    })
    .catch(() => {});

  /**
   * Add global base path for API requests and use credentials by default.
   */
  axios.defaults.withCredentials = true;

  /**
   * Intercept errors and automatically log to DD
   */
  axios.interceptors.response.use(
    (res) => res,
    (err) => {
      const { config, response } = err;
      datadogLogs?.logger?.error(
        `Request for resource ${config?.url} failed with status ${response?.status}`,
        {
          request: {
            headers: config?.headers,
            payload: config?.data,
          },
          response: {
            headers: response?.headers,
            content: response?.data,
          },
        },
      );
      return Promise.reject(err);
    },
  );

  axios.interceptors.request.use(
    (config) => {
      const matches = /app\/customers\/(\d*)/.exec(document.location.href);
      if (matches?.length > 1) {
        config.headers.customerid = matches[1];
      }
      return config;
    },
    (err) => Promise.reject(err),
  );

  /* Add redirect on 300 directives from proxy */
  axios.interceptors.response.use(
    (res) => {
      const {
        config: { url: requestURL },
        request: { responseURL },
      } = res;
      const loginRegex = /\/login/;
      /* If the request URL is not the login page but the server responded with the
      login page then do a hard refresh. This forces the user to re-auth and sets the
      post-login-redirect session */
      if (loginRegex.test(responseURL) && !loginRegex.test(requestURL)) {
        window.location.reload(true);
        return Promise.reject(res);
      }
      return res;
    },
    (err) => Promise.reject(err),
  );

  /* If customer tags fetch returns 401, do a hard refresh to force re-auth. */
  axios.interceptors.response.use(
    (res) => res,
    (err) => {
      const customerTagsRegex = /api\/v1\/customer\/(\d*)\/tags\?appliedTagsOnly=true/;
      if (customerTagsRegex.test(err?.config?.url)) {
        switch (err.response.status) {
          case 401:
            window.location.reload(true);
            break;
          default:
            break;
        }
      }
      return Promise.reject(err);
    },
  );
}
