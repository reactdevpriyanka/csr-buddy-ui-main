import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import cn from 'classnames';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'inline-flex',
    columnGap: '5px',
  },
  info: {
    display: 'block',
    overflow: 'hidden',
    width: '100%',
  },
  title: {
    ...theme.utils.nospace,
    ...theme.fonts.body.bold,
    whiteSpace: 'nowrap',
    lineHeight: theme.utils.fromPx(16),
    marginTop: theme.utils.fromPx(3),
    marginBottom: theme.utils.fromPx(6),
    color: theme.palette.gray.medium,
  },
  contextTitle: {
    marginTop: theme.utils.fromPx(0),
    marginBottom: theme.utils.fromPx(1),
    color: theme.palette.gray.medium,
  },
  finalTitle: {
    marginTop: theme.utils.fromPx(0),
    marginBottom: theme.utils.fromPx(1),
    color: '#767676',
  },
  destinationTitle: {
    marginTop: theme.utils.fromPx(0),
  },
  subtitle: {
    ...theme.utils.nospace,
    ...theme.fonts.body.normal,
    color: theme.palette.gray.light,
    width: '100%',
    overflow: 'hidden',
    marginTop: theme.utils.fromPx(5),
  },
  finalSubtitle: {
    ...theme.utils.nospace,
    ...theme.fonts.body.normal,
    color: '#121212',
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: theme.utils.fromPx(18),
    fontSize: theme.utils.fromPx(14),
    marginTop: theme.utils.fromPx(5),
    width: '100%',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  destinationSubtitle: {
    ...theme.utils.nospace,
    ...theme.fonts.body.normal,
    color: '#121212',
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: theme.utils.fromPx(18),
    fontSize: theme.utils.fromPx(14),
    marginTop: theme.utils.fromPx(5),
    width: '100%',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  destinationEvent: {
    marginTop: theme.utils.fromPx(40),
  },
}));

const TrackerTitleBar = ({
  title = '',
  subtitle = '',
  isFinalEvent = false,
  isDestinationEvent = false,
  isContextEvent = false,
}) => {
  const classes = useStyles();

  return (
    <span className={classes.root}>
      <span className={classes.info}>
        <p
          className={cn(
            classes.title,
            isFinalEvent && classes.finalTitle,
            isContextEvent && classes.contextTitle,
            isDestinationEvent && classes.destinationTitle,
          )}
        >
          {title}
        </p>
        <p
          className={isFinalEvent || isDestinationEvent ? classes.finalSubtitle : classes.subtitle}
        >
          {subtitle}
        </p>
      </span>
    </span>
  );
};

TrackerTitleBar.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  isFinalEvent: PropTypes.bool,
  isContextEvent: PropTypes.bool,
  isDestinationEvent: PropTypes.bool,
};

export default TrackerTitleBar;
