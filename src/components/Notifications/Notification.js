import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import cn from 'classnames';
import CloseIcon from '@icons/close.svg';

const useStyles = makeStyles((theme) => ({
  notification: {
    display: 'inline-grid',
    gridTemplateColumns: 'auto',
    gridColumnGap: theme.utils.fromPx(18),
    borderRadius: theme.utils.fromPx(4),
    padding: `${theme.utils.fromPx(16)} ${theme.utils.fromPx(18)}`,
    color: theme.palette.black,
    '&.hasClose.hasIcon': {
      gridTemplateColumns: 'auto 1fr auto',
    },
    '&.hasClose': {
      gridTemplateColumns: '1fr auto',
    },
    '&.hasIcon': {
      gridTemplateColumns: 'auto 1fr',
    },
    '&:not(:last-child)': {
      marginBottom: theme.utils.fromPx(16),
    },
    '&.error': {
      background: theme.palette.red.medium,
      color: theme.palette.white,
    },
    '&.warning': {
      background: theme.palette.yellow[400],
      color: theme.palette.black,
    },
    '&.info': {
      background: theme.palette.blue.dark,
      color: theme.palette.white,
    },
    '&.success': {
      background: theme.palette.green.dark,
      color: theme.palette.white,
    },
  },
  body: {
    lineBreak: 'loose',
    display: 'block',
    width: '100%',
  },
  close: {
    background: 'transparent',
    border: 0,
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'flex-start',
    padding: 0,
    margin: 0,
    cursor: 'pointer',
  },
  closeWhite: {
    '& > svg': {
      color: 'white',
    },
  },
}));

const Notification = ({
  as = 'div',
  children,
  icon = null,
  onDismiss = null,
  type = 'info',
  className = '',
  ...props
}) => {
  const Root = as;

  const classes = useStyles();

  return (
    <Root
      className={cn(
        classes.notification,
        type,
        icon && 'hasIcon',
        onDismiss && 'hasClose',
        className,
      )}
      data-testid={props['data-testid']}
    >
      {icon && <span className={classes.icon}>{icon}</span>}
      <span className={classes.body}>{children}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={cn([classes.close, type === 'error' && classes.closeWhite])}
        >
          <CloseIcon />
        </button>
      )}
    </Root>
  );
};

Notification.propTypes = {
  as: PropTypes.elementType,
  icon: PropTypes.node,
  type: PropTypes.oneOf(['error', 'severe', 'warning', 'info', 'debug', 'success']),
  children: PropTypes.node,
  className: PropTypes.string,
  'data-testid': PropTypes.string,
  onDismiss: PropTypes.func,
};

export default Notification;
