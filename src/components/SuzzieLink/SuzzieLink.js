import PropTypes from 'prop-types';
import useSuzzieTab from '@/hooks/useSuzzieTab';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    color: 'white',
    textTransform: 'uppercase',
    textDecoration: 'none',
    display: 'inline-block',
    fontWeight: 'bold',
    marginLeft: theme.utils.fromPx(8),
  },
}));

const SuzzieLink = ({ href, children }) => {
  const classes = useStyles();

  const onClick = useSuzzieTab();

  return (
    <a href={href} onClick={onClick} className={classes.root}>
      {children}
    </a>
  );
};

SuzzieLink.propTypes = {
  href: PropTypes.string,
  children: PropTypes.node,
};

export default SuzzieLink;
