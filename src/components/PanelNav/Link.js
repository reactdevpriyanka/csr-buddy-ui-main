import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    color: '#9c9c9c',
    fontWeight: 'bold',
    padding: theme.spacing(0.125, 0.25),
    textDecoration: 'none',
    borderBottom: theme.borders.default,
    '&.active': {
      color: theme.palette.blue.dark,
      borderBottom: theme.borders.active,
    },
  },
}));

const Link = ({ children, href, active = false, ...props }) => {
  const classes = useStyles();
  const className = [classes.root];
  if (active) className.push('active');
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <a {...props} href={href} className={className.join(' ')}>
      {children}
    </a>
  );
};

Link.propTypes = {
  children: PropTypes.node,
  href: PropTypes.string.isRequired,
  active: PropTypes.bool,
};

export default Link;
