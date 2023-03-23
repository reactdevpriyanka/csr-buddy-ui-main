import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useMemo } from 'react';
import cn from 'classnames';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import Button from '@components/Button';
import useAthena from '@/hooks/useAthena';
import useFeature from '@/features/useFeature';
import ATHENA_KEYS from '@/constants/athena';
import OrderTrackingEvent from '../Order/OrderTrackingEvent';

const testingName = 'shipping-flow';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '16px',
    background: ' #F5F5F5',
    borderRadius: '4px',
    flex: 'none',
    order: 1,
    flexGrow: 0,
  },
  statusText: {
    textAlign: 'right',
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: theme.utils.fromPx(12),
    lineHeight: theme.utils.fromPx(16),
    color: '#121212',
  },
  statusSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.utils.fromPx(6),
    paddingBottom: theme.utils.fromPx(6),
    width: '100%',
  },
  statusBadge: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: `${theme.utils.fromPx(11)} ${theme.utils.fromPx(8)}`,
    height: '20px',
    background: '#CCCCCC',
    borderRadius: '2px',
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: theme.utils.fromPx(14),
    lineHeight: '0.02em',
    color: '#121212',
    '&.disableStatusBadge': {
      opacity: '0.5',
    },
  },
  hr: {
    flexGrow: '0',
    border: '1px solid #999999',
    width: '100%',
    backgroundColor: '#999999', //added background color
  },
  package: {
    fontSize: theme.utils.fromPx(16),
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: theme.utils.fromPx(22),
    display: 'flex',
    alignItems: 'center',
    textAlign: 'right',
    color: '#121212',
  },
  actionButton: {
    display: 'block',
    color: theme.palette.blue.chewyBrand,
    backgroundColor: 'transparent',
    transition: 'all 0.2s',
    textTransform: 'none',
    alignSelf: 'flex-end',
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '700',
    border: 'none',
    textDecoration: 'underline',
    cursor: 'pointer',
    '&[disabled]': {
      color: '#666666',
      textDecoration: 'none',
      backgroundColor: 'transparent',
      border: 'none',
    },
    '&:active': {
      textDecoration: 'underline',
      color: '#1C49C2',
      backgroundColor: 'transparent',
    },
    '&:hover': {
      textDecoration: 'none',
      backgroundColor: 'transparent',
      '&:focus': {
        border: `1px solid ${theme.palette.blue.chewyBrand}`,
      },
    },
  },
}));

const NewShippingFlow = ({
  title,
  status,
  trackingData,
  fulfillmentCenterCode,
  released,
  step,
  orderCanceled,
  ordinal = '',
  total = '',
  shipper = '',
  shipment = [],
  onTrackPackage = () => null,
}) => {
  const Steps = {
    PENDING:
      status === 'RELEASED'
        ? { text: 'Pending Shipment', value: 0 }
        : { text: 'Pending', value: 0 },
    ORDER_PLACED: { text: 'Order Placed', value: 0 },
    PACKING_ITEMS: { text: 'Pending Shipment', value: 1 },
    IN_TRANSIT: { text: 'In Transit', value: 2 },
    OUT_FOR_DELIVERY: { text: 'Out for Delivery', value: 3 },
    DELIVERED: { text: 'Delivered', value: 4 },
    [undefined]: { text: 'Pending', value: 0 },
  };

  let stepText = Steps[step].text;
  const classes = useStyles();
  const { getLang } = useAthena();
  const isCorrectEDDEnabled = useFeature(ATHENA_KEYS.CORRECT_EDD);
  const trackingId = shipment?.trackingId;
  const label =
    step === 'DELIVERED'
      ? getLang('deliveredOnCTMText', { fallback: 'Delivered on:' })
      : getLang('estimatedDeliveryCTMText', { fallback: 'Estimated Delivery:' });

  /* Estimated Delivery Date for top card */
  const edd = useMemo(() => {
    if (!trackingData) return null;
    const isDelivered = trackingData.shippingStep === 'DELIVERED';
    const isElectronic = shipper === 'ELECTRONIC'; //gift card check
    let deliveryDate;

    if (isCorrectEDDEnabled) {
      const isoDate =
        isDelivered && !isElectronic
          ? trackingData.trackingEvent?.date
          : isDelivered && isElectronic
          ? shipment.timeShipped
          : trackingData.derivedDeliveryDate || trackingData.estimatedDeliveryDate;

      if (!isoDate) {
        return { isDelivered };
      }

      deliveryDate = parseISO(isoDate);
    } else {
      const isoDate = isDelivered
        ? trackingData.trackingEvent?.date
        : `${trackingData.estimatedDeliveryDate}T00:00:00`;
      if (!isoDate) {
        return { isDelivered };
      }

      deliveryDate = new Date(isoDate);
    }

    return {
      isDelivered,
      dayOfWeek: format(deliveryDate, 'EE'),
      dayOfMonth: format(deliveryDate, 'd'),
      month: format(deliveryDate, 'MMM'),
      year: format(deliveryDate, 'yyyy'),
    };
  }, [trackingData, isCorrectEDDEnabled]);
  const fulfillmentCenterCodeText = fulfillmentCenterCode && fulfillmentCenterCode + ' -';

  const isDisabled = stepText === 'Pending Shipment';
  return (
    <div className={classes.root} data-testid={`${testingName}`}>
      {!orderCanceled && (
        <>
          {released && (
            <div className={classes.package}>
              {fulfillmentCenterCodeText} {`${title} ${ordinal} of ${total}`}
            </div>
          )}
          <div className={classes.statusSection}>
            <span className={classes.statusText}>
              {' '}
              {getLang('trackingStatusText', { fallback: 'Tracking Status' })}:{' '}
            </span>
            <span
              className={cn([classes.statusBadge, isDisabled && 'disableStatusBadge'])}
              data-testid={`${testingName}-status`}
            >
              {stepText}
            </span>
          </div>
          <div className={classes.statusSection}>
            <span className={classes.statusText}>{label}</span>
            {edd && <OrderTrackingEvent status={status} total={total} edd={edd} />}
          </div>
          <hr className={classes.hr} />
          <Button
            className={classes.actionButton}
            data-testid={`${testingName}-track-package`}
            aria-disabled={!trackingId}
            disabled={!trackingId}
            onClick={onTrackPackage}
          >
            {getLang('trackPackageButtonLabel', { fallback: 'Track Package' })}
          </Button>
        </>
      )}
    </div>
  );
};

NewShippingFlow.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  status: PropTypes.string,
  shipper: PropTypes.string,
  released: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  fulfillmentCenterCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  step: PropTypes.string.isRequired,
  orderCanceled: PropTypes.bool,
  onTrackPackage: PropTypes.func,
  ordinal: PropTypes.number,
  total: PropTypes.number,
  trackingData: PropTypes.object,
  shipment: PropTypes.object,
};

export default NewShippingFlow;
