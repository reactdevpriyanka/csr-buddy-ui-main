import { useCallback } from 'react';
import axios from 'axios';
import { useOracle } from '@/hooks/index';
import { useRouter } from 'next/router';
import useFeature from '../features/useFeature';

export default function useAgentInteractions() {
  const router = useRouter();
  const { id: customerId } = router.query;

  const oracle = useOracle();
  const startData = oracle?.getIncidentStartData();

  const interactionId = startData?.interactionId;

  const shouldCaptureInteraction = useFeature('feature.explorer.captureAgentInteraction');

  const captureInteraction = useCallback(
    async ({ type, subjectId = null, action, currentVal, prevVal }) => {
      if (shouldCaptureInteraction) {
        axios
          .post(`/api/v1/interaction/${interactionId || 'UNKNOWN'}`, {
            interactionId: interactionId || null,
            customerId: customerId,
            type: type,
            details: {
              subjectId: subjectId || customerId,
              action: action,
              currentVal: currentVal,
              prevVal: prevVal,
            },
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.log('error posting interaction data', error);
          });
      }
    },
    [shouldCaptureInteraction, customerId, interactionId],
  );

  return {
    captureInteraction,
  };
}
