import { useMemo } from 'react';

export default function useNodes(outcomes, nodeMap, outcomeMap) {
  return useMemo(() => {
    const mapped = [];
    let stack = outcomeMap;
    for (const outcome of outcomes) {
      if (stack[outcome]) {
        const node = nodeMap[outcome];
        if (!node) continue;

        // Remap the secondary nodes in case the nodeMap is coming from session storage
        // because the parent node (declared on line 9) will not have the updated value
        // from the already parsed/broken out node in the nodeMap, but will just have the
        // node id it needs to parse (so we do that here)
        const { secondaryNodes } = node;

        if (secondaryNodes) {
          let accumulatedSecondaryNodes = [];

          for (const currSecondaryNode of secondaryNodes) {
            accumulatedSecondaryNodes.push(nodeMap[currSecondaryNode?.id]);
          }

          node.secondaryNodes = accumulatedSecondaryNodes;
        }

        mapped.push(node);
        stack = stack[outcome];
      }
    }

    return mapped;
  }, [outcomes, nodeMap, outcomeMap]);
}
