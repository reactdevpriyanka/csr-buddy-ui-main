import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useState, useMemo } from 'react';
import { newTrackPackageTabs, newTrackPackageTabsList } from '@/utils/trackPackage';
import ModalSideHeader from '@components/ModalSideHeader/ModalSideHeader';
import NextLink from 'next/link';
import useSanitizedRouter from '@/hooks/useSanitizedRouter';
import { Link } from '@material-ui/core';
import address from './shapes/address';
import edd from './shapes/edd';
import fact from './shapes/fact';
import events from './shapes/event';
import TrackerContent from './TrackerContent';
import TrackerFacts from './TrackerFacts';
import NewTrackerStatus from './NewTrackerStatus';
import NewTrackerHUD from './NewTrackerHUD';
import NewTrackingNumber from './NewTrackingNumber';
import TrackerContextEvents from './TrackerContextEvents';
import ContextualMessageShipmentTrackerAlert from './Notification/ContextualMessageShipmentTrackerAlert';
import trackingEvent from './shapes/trackingEvent';
import ShippingTrackerHorizontalBtnNav from './ShippingTrackerHorizontalBtnNav';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.white,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'auto',
  },
  normal: {
    display: 'inline-block',
    fontWeight: '700',
    fontSize: theme.utils.fromPx(18),
    lineHeight: theme.utils.fromPx(24),
    marginLeft: theme.utils.fromPx(4),
    textDecoration: 'underline',
  },
  trackingStatusAlert: {
    width: '100%',
  },
  alertRecommendedAction: {
    textDecoration: 'underline',
    cursor: 'default',
    marginTop: theme.utils.fromPx(8),
  },
  orderDetailsLink: {
    textDecoration: 'none',
    color: 'white',
    '&:focus, &:hover': {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  },
}));

const NewShipmentTracker = ({
  orderNumber = '',
  edd = {},
  trackingEvent = {},
  address = null,
  facts = [],
  trackingNumber = '',
  fedExLink = '',
  ordinal = '',
  total = '',
  events = [],
  shippingModeCode = '',
  onClose = () => null,
}) => {
  const classes = useStyles();
  const [activeTab, setActiveTab] = useState(newTrackPackageTabs.TRAVEL_HISTORY);
  const { id } = useSanitizedRouter();

  const internalMessage = trackingEvent?.internalMessage?.message;

  const orderTitle = useMemo(
    () => (
      <NextLink href={`/customers/${id}/orders/${orderNumber}`}>
        <Link
          className={classes.orderDetailsLink}
          data-testid={`ordercard:id:viewdetails:link:${orderNumber}`}
        >
          {`Order #${orderNumber}`}
        </Link>
      </NextLink>
    ),
    [orderNumber],
  );

  return (
    <div className={classes.root}>
      <ModalSideHeader
        text={<span className={classes.normal}>{orderTitle}</span>}
        onClose={onClose}
      />
      <ShippingTrackerHorizontalBtnNav
        tabs={newTrackPackageTabsList}
        onChange={setActiveTab}
        activeTab={activeTab}
      />
      <TrackerContent>
        {internalMessage && <ContextualMessageShipmentTrackerAlert trackingEvent={trackingEvent} />}
        <NewTrackerHUD>
          {edd && (
            <NewTrackerStatus
              isDelivered={edd.isDelivered}
              dayOfWeek={edd.dayOfWeek}
              dayOfMonth={edd.dayOfMonth}
              month={edd.month}
              year={edd.year}
              ordinal={ordinal}
              total={total}
              data-testid="tracker-status-estimated-arrival"
            />
          )}
          {trackingNumber && (
            <NewTrackingNumber
              shippingModeCode={shippingModeCode}
              trackingNumber={trackingNumber}
              fedExLink={fedExLink}
              data-testid="tracker-status-tracking-link"
            />
          )}
        </NewTrackerHUD>
        {activeTab === newTrackPackageTabs.TRAVEL_HISTORY && (
          <TrackerContextEvents address={address} events={events} />
        )}
        {activeTab === newTrackPackageTabs.SHIPMENT_FACTS && (
          <TrackerFacts orderNumber={orderNumber} facts={facts} />
        )}
      </TrackerContent>
    </div>
  );
};

NewShipmentTracker.propTypes = {
  facts: PropTypes.arrayOf(PropTypes.shape(fact)),
  fedExLink: PropTypes.string,
  shippingModeCode: PropTypes.string,
  events: PropTypes.arrayOf(PropTypes.shape(events)),
  address: PropTypes.shape(address),
  trackingEvent: PropTypes.shape(trackingEvent),
  edd: PropTypes.exact(edd),
  orderNumber: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ordinal: PropTypes.number,
  total: PropTypes.number,
  trackingNumber: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onClose: PropTypes.func,
};

export default NewShipmentTracker;
