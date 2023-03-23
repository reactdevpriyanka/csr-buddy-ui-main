import PropTypes from 'prop-types';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import Notification from './Notification';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    bottom: theme.utils.fromPx(16),
    right: 0,
    zIndex: -10,
    opacity: 0,
    pointerEvents: 'none',
    minWidth: theme.utils.fromPx(160),
    maxWidth: theme.utils.fromPx(250),
    width: 'max-content',
    '&.visible': {
      zIndex: 10,
      opacity: 1,
      transition: 'opacity 0.2s',
    },
  },
  bubble: {
    width: theme.utils.fromPx(22),
    height: theme.utils.fromPx(22),
    transform: 'rotate(45deg) translate(-50%, -2rem)',
    position: 'absolute',
    bottom: theme.utils.fromPx(-22),
    left: '50%',
    '&.info': {
      background: theme.palette.blue.dark,
    },
  },
}));

const Popout = ({
  as = 'div',
  children,
  icon = null,
  onDismiss = null,
  type = 'info',
  visible = false,
  ...props
}) => {
  const Root = as;

  const classes = useStyles();

  const testId = props['data-testid'] || '';

  return (
    <Root className={cn([classes.root, visible && 'visible'])} data-testid={`${testId}-popout`}>
      <Notification as={as} icon={icon} onDismiss={onDismiss} data-testid={testId}>
        {children}
      </Notification>
      <span className={cn([classes.bubble, type])} />
    </Root>
  );
};

Popout.propTypes = {
  as: PropTypes.elementType,
  children: PropTypes.node,
  icon: PropTypes.node,
  onDismiss: PropTypes.func,
  type: PropTypes.string,
  visible: PropTypes.bool,
  'data-testid': PropTypes.string,
};

export default Popout;
