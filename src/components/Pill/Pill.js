import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import cn from 'classnames';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: `${theme.spacing(0.5)} ${theme.spacing(1)}`,
    marginBottom: '3px',
    borderRadius: theme.spacing(1),
    background: theme.palette.gray[100],
    display: 'inline-block',
    fontSize: theme.utils.fromPx(14),
    fontFamily: 'Roboto, sans-serif',
    lineHeight: '0.875rem',
    '&:not(:last-of-type)': {
      marginRight: '0.5rem',
    },
    '&.info': {
      color: theme.palette.white,
      background: '#163977',
    },
    '&.warning': {
      color: theme.palette.white,
      background: '#ef6c00',
    },
    '&.tag': {
      color: '#031657',
      background: '#dbebf9',
    },
    '&.specialtag': {
      color: '#851940',
      background: '#FDE4E8',
    },
    '&.default': {
      color: theme.palette.gray.light,
    },
  },
}));

const Pill = ({ children, type = 'info', className = '' }) => {
  const classes = useStyles();

  return <span className={cn([`${classes.root} ${type}`, className])}>{children}</span>;
};

Pill.propTypes = {
  children: PropTypes.node,
  type: PropTypes.oneOf(['warning', 'info', 'tag', 'default', 'specialtag']),
  className: PropTypes.string,
};

export default Pill;
