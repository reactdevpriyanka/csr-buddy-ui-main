import PropTypes from 'prop-types';
import useSuzzieTab from '@/hooks/useSuzzieTab';
import { makeStyles } from '@material-ui/core/styles';
import cn from 'classnames';

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.blue.dark,
    textTransform: 'uppercase',
    textDecoration: 'none',
    display: 'inline-block',
    fontWeight: 'bold',
    '&:hover': {
      textDecoration: 'underline',
    },
    margin: 0,
    padding: `${theme.utils.fromPx(0)} ${theme.utils.fromPx(2)}`,
  },
}));

const SuzzieOrderLink = ({ href, children, className }) => {
  const classes = useStyles();

  const onClick = useSuzzieTab();

  return (
    <a className={cn(className, classes.root)} href={href} onClick={onClick}>
      {children}
    </a>
  );
};

SuzzieOrderLink.propTypes = {
  href: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
};

export default SuzzieOrderLink;
