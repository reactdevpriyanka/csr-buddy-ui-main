import PropTyes from 'prop-types';
import _ from 'lodash';
import { useContext, useMemo } from 'react';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import ModalContext from '@components/ModalContext';
import useFeature from '@/features/useFeature';
import useAthena from '@/hooks/useAthena';
import { formatShipmentInfoDate } from '@/utils/dates';
import { snakeCaseToTitleCase } from '@/utils/string';
import {
  currentStatusMap,
  eventMap,
  factPopupText,
  getEventSubtitle,
  getContextEventSubtitle,
} from '@/utils/trackPackage';
import ATHENA_KEYS from '@/constants/athena';
import useTrackingEventsHistory from '@/hooks/useTrackingEventsHistory';
import { TrackingEventMappings } from '@/components/ShipmentTracker/trackingConstants';
import ShipmentTracker from './ShipmentTracker';
import NewShipmentTracker from './NewShipmentTracker';

const ConnectedShipmentTracker = ({ orderInfo = {} }) => {
  const { setModal: setModalContext } = useContext(ModalContext);
  const { getLang } = useAthena();

  const orderId = orderInfo.orderNumber;
  const packageId = orderInfo.packageId;

  const { data: newTrackingData } = useTrackingEventsHistory(orderId, packageId);

  const isTrackingPackageContextMessageEnabled = getLang(
    ATHENA_KEYS.TRACKING_PACKAGE_CONTEXT_MESSAGING_ENABLED,
    { fallback: false },
  );

  const eventMappings = getLang(ATHENA_KEYS.CONTEXTUAL_MESSAGING, {
    fallback: TrackingEventMappings,
  });

  const handleClose = () => {
    setModalContext(null);
  };

  /* Travel History */
  const events =
    newTrackingData?.displayEvents?.map(({ code, eventCode, date, address, ...data }) => {
      const isContextEvent =
        !_.isEmpty(data?.internalMessage) && isTrackingPackageContextMessageEnabled;

      const isDeliveredEvent = data?.status === 'DELIVERED';

      let title = eventMap[eventCode] || eventMap[code] || snakeCaseToTitleCase(eventCode);
      const subEventCode = '_' + data?.subEventCode;
      let mapping = eventMappings[eventCode + subEventCode];
      if (
        !_.isEmpty(eventCode) &&
        !_.isEmpty(data?.subEventCode) &&
        isTrackingPackageContextMessageEnabled &&
        mapping
      ) {
        title = !_.isEmpty(mapping.eventLabel)
          ? mapping.eventLabel
          : snakeCaseToTitleCase(eventCode);
      }

      return {
        title: title,
        subtitle: isTrackingPackageContextMessageEnabled
          ? getContextEventSubtitle({
              date,
              address,
              isDeliveredEvent,
            })
          : getEventSubtitle({
              date,
              address,
            }),
        isContextEvent,
        date,
        data: { ...data, eventCode: eventCode, mappings: mapping },
      };
    }) || [];

  const isCorrectEDDEnabled = useFeature(ATHENA_KEYS.CORRECT_EDD);

  /* Estimated Delivery Date for top card */
  const edd = useMemo(() => {
    if (!orderInfo) return null;
    const isDelivered = orderInfo.shippingStep === 'DELIVERED';
    let deliveryDate;

    // NOTE This is not ideal but eventually the else branch can be deleted when
    // this feature flag (added for production testing) goes away.
    if (isCorrectEDDEnabled) {
      const isoDate = isDelivered
        ? orderInfo.trackingEvent?.date
        : orderInfo.derivedDeliveryDate || orderInfo.estimatedDeliveryDate;

      if (!isoDate) {
        return { isDelivered };
      }

      deliveryDate = parseISO(isoDate);
    } else {
      const isoDate = isDelivered
        ? orderInfo.trackingEvent?.date
        : `${orderInfo.estimatedDeliveryDate}T00:00:00`;

      if (!isoDate) {
        return { isDelivered };
      }

      deliveryDate = new Date(isoDate);
    }

    return {
      isDelivered,
      dayOfWeek: isTrackingPackageContextMessageEnabled
        ? format(deliveryDate, 'EE')
        : format(deliveryDate, 'EEEE'),
      dayOfMonth: format(deliveryDate, 'd'),
      month: isTrackingPackageContextMessageEnabled ? format(deliveryDate, 'MMM') : null,
      year: isTrackingPackageContextMessageEnabled ? format(deliveryDate, 'yyyy') : null,
    };
  }, [orderInfo, isCorrectEDDEnabled]);

  /* Shipment Facts */
  const facts = useMemo(() => {
    if (!orderInfo) return [];
    const {
      fulfillmentCenterDetails,
      packagesCountFromOrder,
      actualShipDateTime,
      actualDeliveryTime,
      trackingNumber,
      service,
      weight,
      dimensions,
      standardTransit,
    } = orderInfo;
    return [
      {
        heading: 'Fulfillment Center',
        value: fulfillmentCenterDetails
          ? `${fulfillmentCenterDetails?.attributes?.address?.city}, ${fulfillmentCenterDetails?.attributes?.address?.state}`
          : 'Unknown',
      },
      { heading: 'Tracking Number', value: trackingNumber || 'Unknown' },
      { heading: 'Total Packages', value: packagesCountFromOrder || 'Unknown' },
      { heading: 'Service', value: service || 'Unknown' },
      {
        heading: 'Ship Date',
        value: formatShipmentInfoDate(actualShipDateTime) || 'Unknown',
        help: factPopupText.SHIP_DATE,
      },
      { heading: 'Weight', value: weight || 'Unknown' },
      {
        heading: 'Standard Transit',
        value: formatShipmentInfoDate(standardTransit) || 'Unknown',
        help: factPopupText.STANDARD_TRANSIT,
      },
      { heading: 'Dimensions', value: dimensions || 'Unknown' },
      {
        heading: 'Actual Delivery',
        value: formatShipmentInfoDate(actualDeliveryTime) || 'Unknown',
        help: factPopupText.ACTUAL_DELIVERY,
      },
    ];
  }, [orderInfo]);

  /* Alert shown at top */
  const alert = useMemo(() => {
    return currentStatusMap[orderInfo?.currentPackageStatus] || null;
  }, [orderInfo]);

  return orderInfo ? (
    isTrackingPackageContextMessageEnabled ? (
      <NewShipmentTracker
        events={events}
        address={orderInfo.shippingAddress}
        orderNumber={orderInfo.orderNumber}
        trackingNumber={orderInfo.trackingId}
        trackingEvent={orderInfo.trackingEvent}
        edd={edd}
        shippingModeCode={orderInfo.shippingModeCode}
        facts={facts}
        partial={orderInfo.partial}
        ordinal={orderInfo.ordinal}
        total={orderInfo.total}
        carrier={orderInfo.carrier}
        fedExLink={orderInfo.trackingUrl}
        progress={orderInfo.progressPercentage}
        onClose={handleClose}
      />
    ) : (
      <ShipmentTracker
        alert={alert}
        events={events}
        orderNumber={orderInfo.orderNumber}
        address={orderInfo.shippingAddress}
        trackingNumber={orderInfo.trackingId}
        edd={edd}
        facts={facts}
        partial={orderInfo.partial}
        ordinal={orderInfo.ordinal}
        total={orderInfo.total}
        carrier={orderInfo.carrier}
        fedExLink={orderInfo.trackingUrl}
        progress={orderInfo.progressPercentage}
        onClose={handleClose}
      />
    )
  ) : null;
};

ConnectedShipmentTracker.propTypes = {
  orderInfo: PropTyes.object,
};

export default ConnectedShipmentTracker;
