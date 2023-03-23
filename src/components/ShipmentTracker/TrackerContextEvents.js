import PropTypes from 'prop-types';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { capitalize } from '@/utils/string';
import useAthena from '@/hooks/useAthena';
import { useCallback } from 'react';
import { formatActivityContextEventDate } from '@/utils';
import TrackerContextEvent from './TrackerContextEvent';
import events from './shapes/event';
import addressShape from './shapes/address';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    zIndex: 0,
  },
  list: {
    ...theme.utils.nospace,
    ...theme.utils.col,
    listStyle: 'none',
    position: 'relative',
    zIndex: 1,
    '& > li': { zIndex: 2 },
  },
  line: {
    position: 'absolute',
    top: '20px',
    left: '11px',
    borderLeft: `${theme.utils.fromPx(1)} dashed #ddd`,
    width: 0,
    height: 'calc(100% - 70px)',
    zIndex: 0,
  },
  button: {
    ...theme.utils.nospace,
    ...theme.fonts.body.medium,
    color: theme.palette.blue.light,
    border: 0,
    background: 'transparent',
  },
  address: {
    display: 'flex',
    flexDirection: 'column',
    ...theme.utils.nospace,
    ...theme.fonts.body.normal,
    color: '#121212',
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: theme.utils.fromPx(18),
    fontSize: theme.utils.fromPx(14),
    marginTop: 0,
    width: '100%',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  date: {
    ...theme.utils.nospace,
    ...theme.fonts.body.normal,
    color: theme.palette.gray.light,
    width: '100%',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    marginBottom: '5px',
  },
}));

const TrackerContextEvents = ({
  events,
  as: EventComponent = TrackerContextEvent,
  address,
  deliveryData,
}) => {
  const classes = useStyles();
  const { getLang } = useAthena();
  const finalDestinationTitle = getLang(
    'feature.explorer.contextMessageEvent.finalDestinationTitle',
    { fallback: 'Final Destination' },
  );
  const lastContextEvent = _.findIndex([...events].reverse(), (obj) => {
    return obj?.isContextEvent;
  });

  const isFinalEvent =
    _.findIndex(events, (event) => event?.data?.eventCode === 'DELIVERED') === -1;

  const getAddress = useCallback(
    (date) => {
      return (
        <div className={classes.address}>
          {date && <span className={classes.date}>{formatActivityContextEventDate(date)}</span>}
          {address?.addressLine1 && <span>{`${capitalize(address?.addressLine1)}`}</span>}
          {address?.addressLine2 && <span>{`${capitalize(address?.addressLine2)}`}</span>}
          {address?.city && address?.state && address?.postcode && (
            <span>{`${capitalize(address?.city)}, ${address?.state} ${address?.postcode}`}</span>
          )}
        </div>
      );
    },
    [address],
  );

  return (
    <div className={classes.root}>
      <ul className={classes.list}>
        {isFinalEvent && (
          <EventComponent
            title={finalDestinationTitle}
            subtitle={getAddress(deliveryData)}
            data={{ mappings: { infoType: 'COMPLETE' } }}
            isFinalEvent={isFinalEvent}
          />
        )}
        {[...events].reverse().map(({ title, subtitle, isContextEvent, data, date }, index) => (
          <EventComponent
            key={`${index}-${title}-${subtitle}`}
            title={title}
            subtitle={data?.eventCode !== 'DELIVERED' ? subtitle : getAddress(date)}
            state="COMPLETE"
            isContextEvent={isContextEvent}
            data={data}
            isLastContextEvent={lastContextEvent === index}
          />
        ))}
      </ul>
      <div className={classes.line} />
    </div>
  );
};

TrackerContextEvents.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape(events)),
  as: PropTypes.elementType,
  address: PropTypes.shape(addressShape),
  deliveryData: PropTypes.string,
};

export default TrackerContextEvents;
