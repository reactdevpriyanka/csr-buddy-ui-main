import PropTypes from 'prop-types';

export default {
  heading: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  help: PropTypes.string,
};
