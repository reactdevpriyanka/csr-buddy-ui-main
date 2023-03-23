import { useCallback } from 'react';

export default function useOutcome(outcomes, setOutcomes) {
  return useCallback(
    (nodeId, depth) => {
      if (outcomes.length > depth + 1 && outcomes[depth + 1] !== nodeId) {
        const newOutcomes = outcomes.slice(0, depth + 1);
        setOutcomes([...newOutcomes, nodeId]);
      } else if (!outcomes.includes(nodeId)) {
        setOutcomes([...outcomes, nodeId]);
      }
    },
    [outcomes, setOutcomes],
  );
}
