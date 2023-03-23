import { useEffect } from 'react';
import PropTypes from 'prop-types';

const Start = ({ singularOutcome, onChoose = () => null }) => {
  useEffect(() => onChoose(singularOutcome), [singularOutcome, onChoose]);

  return null;
};

Start.propTypes = {
  singularOutcome: PropTypes.string,
  onChoose: PropTypes.func,
};

export default Start;
