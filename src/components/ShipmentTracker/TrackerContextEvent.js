import cn from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import { CheckCircleIcon, WarningIcon, InfoIcon, CheckCircleOutlineIcon } from '../Icon';
import events from './shapes/event';
import ContextMessageDetails from './ContextMessageDetails';
import TrackerTitleBar from './TrackerTitleBar';

const emptyComponent = {
  component: (
    <CheckCircleIcon
      data-testid="icon_DEFAULT"
      color="#CCCCCC"
      backgroundColor="#CCCCCC"
      borderColor="#CCCCCC"
    />
  ),
};

const icons = {
  COMPLETE: {
    component: (
      <CheckCircleOutlineIcon
        data-testid="icon_COMPLETE"
        color="black"
        backgroundColor="white"
        borderColor="#006B2B"
        opacity="0.4"
      />
    ),
  },
  SUCCESS: {
    component: <CheckCircleIcon data-testid="icon_SUCCESS" />,
  },
  WARNING: {
    component: <WarningIcon data-testid="icon_WARNING" />,
  },
  INFORMATION: {
    component: <InfoIcon data-testid="icon_INFORMATION" />,
  },
  FINAL: {
    component: (
      <CheckCircleIcon
        data-testid="icon_FINAL"
        color="#006B2B"
        backgroundColor="white"
        borderColor="#006B2B"
      />
    ),
  },
  DEFAULT: emptyComponent,
  '': emptyComponent,
  [null]: emptyComponent,
  [undefined]: emptyComponent,
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'inline-grid',
    gridTemplateColumns: `auto 1fr`,
    gridTemplateRows: 'auto',
    justifyItems: 'start',
    marginBottom: theme.utils.fromPx(24),
    '&.disabled': {
      opacity: 0.4,
    },
  },
  headerPanel: {
    display: 'contents',
    columnGap: '16px',
  },
  contextEvent: {
    marginBottom: theme.utils.fromPx(0),
  },
  destinationContextEvent: {
    marginBottom: theme.utils.fromPx(25),
  },
  contextEventContainer: {
    paddingLeft: theme.utils.fromPx(20),
  },
}));

const TrackerContextEvent = ({
  title = '',
  subtitle = '',
  state = 'COMPLETE',
  isContextEvent = false,
  data = {},
  isFinalEvent = false,
  isLastContextEvent = false,
}) => {
  const classes = useStyles();

  const isDestinationEvent = data?.eventCode === 'DELIVERED';

  const Icon = data?.mappings?.infoType
    ? icons[_.toUpper(data?.mappings?.infoType)]
    : isDestinationEvent
    ? icons['SUCCESS']
    : emptyComponent;

  const isDisabled = state === 'INCOMPLETE';

  return (
    <li
      className={cn([
        classes.root,
        isDisabled && 'disabled',
        isContextEvent && classes.contextEvent,
        isDestinationEvent && isContextEvent && classes.destinationContextEvent,
      ])}
    >
      <div
        className={classes.headerPanel}
        data-testid={`trackerContextEvent:${data?.eventCode}${data?.subEventCode}`}
      >
        {Icon?.component}
        <div className={classes.contextEventContainer}>
          {isContextEvent ? (
            <ContextMessageDetails
              title={title}
              subtitle={subtitle}
              state={state}
              data={data}
              isFinalEvent={isFinalEvent}
              expand={isLastContextEvent}
              isDestinationEvent={isDestinationEvent}
            />
          ) : (
            <TrackerTitleBar title={title} subtitle={subtitle} isFinalEvent={isFinalEvent} />
          )}
        </div>
      </div>
    </li>
  );
};

TrackerContextEvent.propTypes = events;

export default TrackerContextEvent;
