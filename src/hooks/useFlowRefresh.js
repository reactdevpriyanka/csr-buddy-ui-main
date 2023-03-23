import { useEffect } from 'react';
import { handleLoadNextFlow } from '@utils/workflows-ui';
import ATHENA_KEYS from '@/constants/athena';
import useAthena from './useAthena';

export default function useFlowRefresh({
  currentContext,
  setCurrentContext,
  nodes,
  nodeMap,
  setNodeMap,
}) {
  const { getLang } = useAthena();
  const gwfVersion = getLang(ATHENA_KEYS.GWF_VERSION, { fallback: '1' });

  useEffect(() => {
    /* Update flows after the node that changed */
    const handler = async (event) => {
      const {
        detail: { id },
      } = event;
      try {
        const startIndex = nodes.findIndex((node) => node.id === id);

        if (startIndex < 0) return;
        const flows = [];

        for (let i = startIndex; i < nodes.length; i++) {
          if (nodes[i].nextFlowName) {
            flows.push(nodes[i].nextFlowName);
          }
        }

        for (const flow of flows) {
          const res = await handleLoadNextFlow(flow, currentContext, gwfVersion);
          /* We really only care about updating the nodeMap (translates to component props)
          and the context. Single outcome nodes should naturally not affect future outcomes so 
          we don't need to update that array. */
          setCurrentContext({ ...currentContext, ...res.context });
          setNodeMap({ ...nodeMap, ...res.nodeMap });
        }
      } catch {
        /* At the moment this is more of a convenience for the user, we don't
        necessarily need to error out the page */
      }
    };
    window.addEventListener('gwf:refreshNodes', handler);
    return () => window.removeEventListener('gwf:refreshNodes', handler);
  }, [nodes, currentContext, setCurrentContext, nodeMap, setNodeMap]);
}
