import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { loadNewChapter } from '@utils/workflows-ui';

const NextChapter = ({ nextFlowName }) => {
  useEffect(() => {
    loadNewChapter(nextFlowName);
  }, [nextFlowName]);

  return null;
};

NextChapter.propTypes = {
  nextFlowName: PropTypes.string,
};

export default NextChapter;
