import cn from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import ChewyLogoCircle from '@icons/chewy-logo-circle.svg';
import Ellipse from '@icons/ellipse.svg';
import CheckCircle from '@icons/circle-check.svg';
import events from './shapes/event';

const icons = {
  COMPLETE: CheckCircle,
  INCOMPLETE: Ellipse,
  ORIGIN: ChewyLogoCircle,
  // FIXME
  // Linter is freaking out that display name is not set,
  // maybe because it is the same? Pls fix this tech debt
  '': () => <span />, // eslint-disable-line react/display-name
  [null]: () => <span />, // eslint-disable-line react/display-name
  [undefined]: () => <span />, // eslint-disable-line react/display-name
};

icons[''].displayName = 'Empty';
icons[null].displayName = 'Empty';
icons[undefined].displayName = 'Empty';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'inline-grid',
    gridTemplateColumns: `${theme.utils.fromPx(20)} 1fr`,
    gridTemplateRows: 'auto',
    gridColumnGap: theme.utils.fromPx(16),
    justifyItems: 'start',
    marginBottom: theme.utils.fromPx(24),
    '&.disabled': {
      opacity: 0.4,
    },
  },
  info: {
    display: 'block',
    overflow: 'hidden',
    width: '100%',
  },
  icon: {
    display: 'inline-block',
    width: '100%',
    height: 'auto',
    marginTop: theme.utils.fromPx(0),
  },
  title: {
    ...theme.utils.nospace,
    ...theme.fonts.body.bold,
    color: theme.palette.gray.medium,
    lineHeight: theme.utils.fromPx(16.41),
    marginTop: theme.utils.fromPx(3),
    marginBottom: theme.utils.fromPx(6),
  },
  subtitle: {
    ...theme.utils.nospace,
    ...theme.fonts.body.normal,
    color: theme.palette.gray.light,
    width: '100%',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
}));

const TrackerEvent = ({ title = '', subtitle = '', state = 'COMPLETE' }) => {
  const classes = useStyles();

  const Icon = icons[state];

  const isDisabled = state === 'INCOMPLETE';

  return (
    <li className={cn([classes.root, isDisabled && 'disabled'])}>
      <Icon data-testid={`icon_${state}`} className={classes.icon} />
      <span className={classes.info}>
        <p className={classes.title}>{title}</p>
        <p className={classes.subtitle}>{subtitle}</p>
      </span>
    </li>
  );
};

TrackerEvent.propTypes = events;

export default TrackerEvent;
