import { useEffect } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { datadogRum } from '@datadog/browser-rum';
import useOracle from '@/hooks/useOracle';

export default function useCSRInfo() {
  const oracle = useOracle();

  const incidentData = oracle?.getIncidentStartData();

  const response = useSWR(
    `/gateway/configuration/session`,
    async (url) => axios.get(url).then(({ data }) => data),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    },
  );

  useEffect(() => {
    /**
     * Set the user of the DD RUM application when we get the CSR's info from Gateway
     */
    if (!response.error && response.data) {
      datadogRum.setUser(response.data);
    }
  }, [response]);

  useEffect(() => {
    if (incidentData) {
      datadogRum.addRumGlobalContext('incidentData', incidentData);
    }
  }, [incidentData]);

  return response;
}
