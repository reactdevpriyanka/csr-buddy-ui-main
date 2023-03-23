import PropTypes from 'prop-types';

const SingleTabLayout = ({ children }) => {
  return <main>{children}</main>;
};

SingleTabLayout.propTypes = {
  children: PropTypes.node,
};

export default SingleTabLayout;
