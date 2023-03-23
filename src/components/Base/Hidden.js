import PropTypes from 'prop-types';

const Hidden = ({ name, value = '' }) => {
  let output = value;
  if (typeof value === 'object') {
    output = JSON.stringify(value);
  }
  return <input type="hidden" name={name} value={output} />;
};

Hidden.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
};

export default Hidden;
