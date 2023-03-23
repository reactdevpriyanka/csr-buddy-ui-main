import axios from 'axios';
import { useRouter } from 'next/router';
import useOracle from './useOracle';

export default function useHealthcareConsent() {
  const router = useRouter();

  const { id: customerId } = router?.query;

  const oracle = useOracle();

  const startData = oracle?.getIncidentStartData();

  const interactionId = startData?.interactionId || 'UNKNOWN';

  const getLatestQuoteConsent = () => {
    return axios
      .get(`/api/v1/customer/${customerId}/insurance/quote-consent`)
      .then(({ data }) => data);
  };

  const captureQuoteConsent = async ({ consent }) => {
    return axios.post(
      `/api/v1/customer/${customerId}/insurance/quote-consent`,
      { consent },
      {
        headers: {
          'Interaction-ID': interactionId,
        },
      },
    );
  };

  const captureSalesDisclosure = async ({ disclosure, petId }) => {
    return axios.post(
      `/api/v1/customer/${customerId}/insurance/sales-disclosure`,
      { disclosure, petId },
      {
        headers: {
          'Interaction-ID': interactionId,
        },
      },
    );
  };

  return {
    getLatestQuoteConsent,
    captureQuoteConsent,
    captureSalesDisclosure,
  };
}
