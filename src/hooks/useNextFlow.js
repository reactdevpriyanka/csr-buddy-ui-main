import { useEffect } from 'react';
import _ from 'lodash';
import { useSnackbar } from 'notistack';
import { handleLoadNextFlow } from '@utils/workflows-ui';
import useSuzzieTab from '@/hooks/useSuzzieTab';
import useCSPlatform from '@/hooks/useCSPlatform';
import { SNACKVARIANTS } from '@/components/SnackMessage/SnackMessage';
import ATHENA_KEYS from '@/constants/athena';
import useAthena from './useAthena';

export default function useNextFlow({
  currentContext,
  outcomes,
  nodeMap,
  outcomeMap,
  setCurrentContext,
  setNodeMap,
  setOutcomes,
  setOutcomeMap,
  renderingFromHistory,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const { getLang } = useAthena();
  const gwfVersion = getLang(ATHENA_KEYS.GWF_VERSION, { fallback: '1' });

  const { getSuzzieUrl } = useCSPlatform();

  const openInSuzzie = useSuzzieTab();

  useEffect(() => {
    const handler = async (event) => {
      const {
        detail: { nextFlowName, nodeId, depth },
      } = event;
      if (renderingFromHistory.current) return;
      try {
        const data = await handleLoadNextFlow(nextFlowName, currentContext, gwfVersion);
        const handleOutcomes = [...outcomes].slice(0, depth + 1);
        handleOutcomes[depth] = nodeId;
        const key = handleOutcomes
          .slice(0, depth + 1)
          .map((outcome) => `[${outcome}]`)
          .join('');
        _.set(outcomeMap, key, data.outcomeMap);
        setCurrentContext(data.context);
        setOutcomeMap({ ...outcomeMap });
        setNodeMap({ ...nodeMap, ...data.nodeMap });
        if (handleOutcomes[handleOutcomes.length - 1] !== data.startNodeId) {
          setOutcomes([...handleOutcomes, data.startNodeId]);
        }
      } catch (error) {
        let messageHeader = 'There was a problem.';

        const { response } = error;
        if (response?.status === 400) {
          try {
            const statusText = response?.data?.slice(
              response.data.indexOf('"') + 1,
              response.data.lastIndexOf('"'),
            );
            messageHeader = `${_.capitalize(statusText)}.`;
          } catch {}
        }

        enqueueSnackbar({
          variant: SNACKVARIANTS.ERROR,
          messageHeader,
        });
      }
    };
    window.addEventListener('gwf:loadNextFlow', handler);
    return () => window.removeEventListener('gwf:loadNextFlow', handler);
  }, [
    currentContext,
    outcomes,
    outcomeMap,
    nodeMap,
    setCurrentContext,
    setNodeMap,
    setOutcomes,
    setOutcomeMap,
    renderingFromHistory,
    enqueueSnackbar,
    openInSuzzie,
    getSuzzieUrl,
  ]);
}
