import PropTypes from 'prop-types';

export const tagShape = PropTypes.shape({
  //todo change shape upon merge of CSRBT-243 to be exact
  name: PropTypes.string,
  value: PropTypes.any,
  description: PropTypes.string,
  sourceSystem: PropTypes.string,
  updatable: PropTypes.bool,
});
