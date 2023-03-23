import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { loadNewFlow } from '@utils/workflows-ui';

const Next = ({ id, depth = 0, nextFlowName }) => {
  useEffect(() => {
    loadNewFlow(id, depth, nextFlowName);
    const handler = ({ detail: { id: nodeId } }) => {
      nodeId === id && loadNewFlow(id, depth, nextFlowName);
    };
    window.addEventListener('gwf:refire', handler);
    return () => window.removeEventListener('gwf:refire', handler);
  }, [id, depth, nextFlowName]);

  return null;
};

Next.propTypes = {
  id: PropTypes.string,
  depth: PropTypes.number,
  nextFlowName: PropTypes.string,
};

export default Next;
