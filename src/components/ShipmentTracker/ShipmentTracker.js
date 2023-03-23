import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import InfoOutline from '@icons/info.outline.svg';
import Notification from '@components/Notifications';
import { useState } from 'react';
import { trackPackageTabs, trackPackageTabsList } from '@/utils/trackPackage';
import ModalSideHeader from '@components/ModalSideHeader/ModalSideHeader';
import TooltipPrimary from '../TooltipPrimary';
import HorizontalBtnNav from '../HorizontalBtnNav/HorizontalBtnNav';
import address from './shapes/address';
import alertShape from './shapes/alert';
import edd from './shapes/edd';
import fact from './shapes/fact';
import events from './shapes/event';
import TrackerContent from './TrackerContent';
import TrackerEvents from './TrackerEvents';
import TrackerStatus from './TrackerStatus';
import TrackerAddress from './TrackerAddress';
import TrackerHUD from './TrackerHUD';
import TrackerFacts from './TrackerFacts';
import TrackerFixIssue from './TrackerFixIssue';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  normal: {
    display: 'inline-block',
    fontWeight: '400',
    marginLeft: '4px',
  },
  trackingStatusAlert: {
    width: '100%',
  },
  alertRecommendedAction: {
    textDecoration: 'underline',
    cursor: 'default',
    marginTop: theme.utils.fromPx(8),
  },
}));

const ShipmentTracker = ({
  alert,
  orderNumber = '',
  address = null,
  events = [],
  edd = {},
  facts = [],
  progress = 0,
  trackingNumber = '',
  fedExLink = '',
  onClose = () => null,
}) => {
  const classes = useStyles();
  const [activeTab, setActiveTab] = useState(trackPackageTabs.TRAVEL_HISTORY);
  const [showAlert, setShowAlert] = useState(!!alert);

  return (
    <div className={classes.root}>
      <ModalSideHeader
        text={
          <>
            {'FedEx Tracking'}
            <span className={classes.normal}>{`#${trackingNumber}`}</span>
          </>
        }
        onClose={onClose}
      />
      <HorizontalBtnNav tabs={trackPackageTabsList} onChange={setActiveTab} activeTab={activeTab} />
      <TrackerContent>
        {showAlert && (
          <Notification
            type="warning"
            data-testid={`shipment-${trackingNumber}-notification`}
            icon={<InfoOutline />}
            onDismiss={() => setShowAlert(false)}
            className={classes.trackingStatusAlert}
          >
            <div>{alert.label}</div>
            <TooltipPrimary title={alert.action} aria-label={alert.action} placement="top" arrow>
              <div className={classes.alertRecommendedAction}>Recommended Action</div>
            </TooltipPrimary>
          </Notification>
        )}
        {activeTab !== trackPackageTabs.FIX_ISSUE && (
          <TrackerHUD progress={progress}>
            {edd && (
              <TrackerStatus
                isDelivered={edd.isDelivered}
                dayOfWeek={edd.dayOfWeek}
                dayOfMonth={edd.dayOfMonth}
                fedExLink={fedExLink}
                month={edd.month}
              />
            )}
            {address && (
              <TrackerAddress
                city={address.city}
                country={address.country}
                fullName={address.fullName}
                postcode={address.postcode}
                phone={address.phone}
                state={address.state}
                addressLine1={address.addressLine1}
                addressLine2={address.addressLine2}
              />
            )}
          </TrackerHUD>
        )}
        {activeTab === trackPackageTabs.TRAVEL_HISTORY && <TrackerEvents events={events} />}
        {activeTab === trackPackageTabs.SHIPMENT_FACTS && (
          <TrackerFacts orderNumber={orderNumber} facts={facts} />
        )}
        {activeTab === trackPackageTabs.FIX_ISSUE && <TrackerFixIssue />}
      </TrackerContent>
    </div>
  );
};

ShipmentTracker.propTypes = {
  alert: PropTypes.shape(alertShape),
  address: PropTypes.shape(address),
  facts: PropTypes.arrayOf(PropTypes.shape(fact)),
  fedExLink: PropTypes.string,
  events: PropTypes.arrayOf(PropTypes.shape(events)),
  edd: PropTypes.exact(edd),
  orderNumber: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  progress: PropTypes.number,
  trackingNumber: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onClose: PropTypes.func,
};

export default ShipmentTracker;
