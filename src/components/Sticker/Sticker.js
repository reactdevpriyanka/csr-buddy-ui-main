import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import cn from 'classnames';
import TooltipPrimary from '../TooltipPrimary';

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: theme.utils.fromPx(2),
    padding: `2px 4px`,
    marginBottom: '3px',
    background: '#E5EAF0',
    display: 'inline-block',
    fontSize: theme.utils.fromPx(12),
    fontWeight: 600,
    fontFamily: 'Roboto, sans-serif',
    lineHeight: '0.875rem',
    width: 'fit-content',
    '&:hover': {
      cursor: 'default',
    },
    '&:first-child:not(:last-child)': {
      marginLeft: '0.5rem',
    },
    '&:not(:last-child)': {
      marginRight: '0.5rem',
    },
    '&.info': {
      color: theme.palette.white,
      background: '#163977',
    },
    '&.default': {
      color: '#1C49C2',
      background: '#E5EAF0',
    },
    '&.red': {
      color: '#BC2848',
    },
  },
  hover: {
    cursor: 'pointer !important',
  },
}));

const Sticker = ({ children, toolTip, type = 'default', className = '', ...props }) => {
  const classes = useStyles();

  return toolTip ? (
    <TooltipPrimary title={toolTip} aria-label="sticker" placement="bottom" arrow>
      <span
        data-testid={`tooltip:${props['data-testid']}`}
        className={cn([`${classes.root} ${type}`, `${classes.hover}`, className])}
      >
        {children}
      </span>
    </TooltipPrimary>
  ) : (
    <span data-testid={props['data-testid']} className={cn([`${classes.root} ${type}`, className])}>
      {children}
    </span>
  );
};

Sticker.propTypes = {
  children: PropTypes.node,
  toolTip: PropTypes.node,
  type: PropTypes.oneOf(['default', 'info']),
  className: PropTypes.string,
  'data-testid': PropTypes.string,
};

export default Sticker;
