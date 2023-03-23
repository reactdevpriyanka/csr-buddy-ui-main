import PropTypes from 'prop-types';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import WarnIcon from '@icons/error.svg';
import ResolveIcon from '@icons/check-circle.svg';
import InfoIcon from '@icons/info.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: `${theme.spacing(0.75)} ${theme.spacing(1.25)}`,
    marginTop: theme.spacing(1),
    '& ul': {
      listStyle: 'disc',
    },
  },
  cancelation: {
    background: theme.palette.red.pastel,
    color: theme.palette.red.dark,
  },
  block: {
    background: theme.palette.red.pastel,
    color: theme.palette.red.dark,
    '& a': {
      fontWeight: 'bold',
      color: `${theme.palette.red.dark}`,
      textDecoration: 'none',
    },
  },
  resolve: {
    background: theme.palette.green.pastel,
    color: theme.palette.green.dark,
    '& a': {
      fontWeight: 'bold',
      color: `${theme.palette.green.dark}`,
      textDecoration: 'none',
    },
  },
  update: {
    background: theme.palette.blue.pastel,
    color: theme.palette.blue.dark,
  },
  notification: {
    background: theme.palette.yellow.pastel,
    color: theme.palette.yellow.dark,
  },
  heading: {
    display: 'flex',
    alignItems: 'center',
  },
  figure: {
    padding: 0,
    margin: 0,
    width: '1rem',
    height: '1rem',
    marginRight: theme.spacing(0.25),
  },
  header: {
    display: 'flex',
    padding: 0,
    margin: 0,
    width: 'max-content',
    fontSize: '1rem',
    alignItems: 'center',
  },
  spacer: {
    flexGrow: 1,
  },
  action: {
    padding: 0,
    margin: 0,
    width: 'max-content',
    fontSize: '1rem',
    fontWeight: 400,
  },
  content: {
    marginTop: theme.spacing(0.5),
  },
}));

const Notification = ({ orderNumber, type, title, action, children }) => {
  const classes = useStyles();
  const testId = `order-${type.toLowerCase()}`;
  const testKey = `order-${type.toLowerCase()}-${orderNumber}`;

  const getIcon = () => {
    switch (type) {
      case 'CANCELATION':
        return <WarnIcon width="16" height="16" />;
      case 'BLOCK':
        return <WarnIcon width="16" height="16" />;
      case 'RESOLVE':
        return <ResolveIcon width="16" height="16" />;
      case 'UPDATE':
        return <InfoIcon width="16" height="16" fill="#031657" />;
      case 'NOTIFICATION':
        return <InfoIcon width="16" height="16" fill="#B06F00" />;
      default:
        return null;
    }
  };

  return (
    <Paper
      data-testid={testId}
      data-testkey={testKey}
      className={cn(classes.root, classes[type.toLowerCase()])}
      elevation={0}
    >
      <div className={classes.heading}>
        <h1
          className={classes.header}
          data-testid={`${testId}:header`}
          data-testkey={`${testKey}:header`}
        >
          <figure
            className={classes.figure}
            data-testid={`${testId}:icon`}
            data-testkey={`${testKey}:icon`}
          >
            {getIcon()}
          </figure>
          {title}
        </h1>
        <div className={classes.spacer} />
        {action && (
          <h2
            className={classes.action}
            data-testid={`${testId}:action`}
            data-testkey={`${testKey}:action`}
          >
            {action}
          </h2>
        )}
      </div>
      {children && (
        <div
          data-testid={`${testId}:content`}
          data-testkey={`${testKey}:content`}
          className={classes.content}
        >
          {children}
        </div>
      )}
    </Paper>
  );
};

Notification.propTypes = {
  orderNumber: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['CANCELATION', 'BLOCK', 'RESOLVE', 'UPDATE', 'NOTIFICATION']).isRequired,
  action: PropTypes.node,
  children: PropTypes.node,
};

export default Notification;
