import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import InteractionAppeasement from '@components/InteractionSummary/InteractionAppeasement';
import useAthena from '@/hooks/useAthena';

const useStyles = makeStyles((theme) => ({
  root: {
    width: (isSummary) => (isSummary ? theme.utils.fromPx(900) : 'auto'),
    display: (isSummary) => (isSummary ? 'grid' : 'block'),
    grid: 'auto / auto auto',
  },
}));
const AgentInteractionAppeasementData = ({ id, appeasements, isSummary = true }) => {
  const classes = useStyles(isSummary);

  const { getLang } = useAthena();

  const petProfileInteractionSummaryLabels = getLang('petProfileInteractionSummaryLabels', {
    fallback: {
      petCreatedText: 'Added pet',
      petUpdatedText: 'Updated pet info',
      petActivatedText: 'Activated pet',
      petDeactivatedText: 'Deactivated pet',
      petAddedTagText: 'Add tag',
      petRemovedTagText: 'Removed tag',
      'message.interactionSummary.petProfile.modified': 'Modified Pet Profile',
    },
  });

  const customerInteractionSummaryLabels = getLang('customerInteractionSummaryLabels', {
    fallback: {
      updatedNameText: 'Updated Name',
      updatedEmailText: 'Updated Email',
      updatedAccountStatusText: 'Updated Account Status',
      updatedPhoneNoText: 'Updated Phone Number',
      addedTagText: 'Added Tag',
      removedTagText: 'Removed Tag',
      resetPasswordText: 'Reset Password',
      'message.interactionSummary.customerProfile.modified': 'Modified Customer Account',
      'message.interactionSummary.switchToUser.modified': 'Switched to Storefront',
    },
  });

  const autoshipInteractionSummaryLabels = getLang('autoshipInteractionSummaryLabels', {
    fallback: {
      autoshipRescheduledText: 'Rescheduled',
      autoshipTriggeredText: 'Triggered Autoship',
      autoshipSkippedText: 'Skipped Next Shipment',
      autoshipUpdatedFrequencyText: 'Updated Frequency',
      autoshipCancelledText: 'Cancelled Autoship',
      autoshipResentEmailText: 'Resent Autoship Email',
      'message.interactionSummary.autoship.modified': 'Modified Autoship',
    },
  });

  const orderInteractionSummaryLabels = getLang('orderInteractionSummaryLabels', {
    fallback: {
      orderInvoiceEmailText: 'Sent Invoice Email',
      orderConfirmEmailText: 'Sent Order Confirm Email',
      orderCancelledText: 'Cancelled Order',
      orderTrackedPackageText: 'Tracked Package',
      orderRemovedItemText: 'Removed Item',
      orderReducedQtyText: 'Reduced Quantity',
      orderAdjustedPriceText: 'Adjusted Price',
      orderAddedPromotionText: 'Added Promotion',
      orderUpdatedShipAddressText: 'Updated Shipping Address',
      orderReturnedText: 'Return on Order',
      orderCancelledReturnText: 'Cancelled Return',
      orderMarkedReceivedText: 'Marked as Received',
      orderCreatedNewLabelsText: 'Created New Labels',
      orderCancelledReleaseText: 'Cancelled Release',
      'message.interactionSummary.order.modified': 'Modified Order',
      'message.interactionSummary.return.modified': 'Return on Order',
    },
  });

  const getInteractionSummaryLabels = (appeasementType) => {
    switch (appeasementType) {
      case 'PET_PROFILE':
        return petProfileInteractionSummaryLabels;
      case 'CUSTOMER_PROFILE':
      case 'CUSTOMER_TAGS':
      case 'ACCOUNT_PASSWORD_RESET':
      case 'SWITCH_TO_USER':
        return customerInteractionSummaryLabels;
      case 'AUSTOSHIP_RESCHEDULED':
      case 'AUTOSHIP_TRIGGERED':
      case 'AUTOSHIP_SKIPPED':
      case 'AUTOSHIP_FREQUENCY_UPDATED':
      case 'AUTOSHIP_CANCELLED':
      case 'AUTOSHIP_NOTIFICATION_RESENT':
        return autoshipInteractionSummaryLabels;
      case 'CANCELLED_ORDER':
      case 'SENT_ORDER_CONFIRM_EMAIL':
      case 'SENT_INVOICE_EMAIL':
      case 'TRACKED_PACKAGE':
      case 'REMOVED_ITEM':
      case 'REDUCED_QUANTITY':
      case 'ADJUSTED_PRICE':
      case 'ADDED_PROMOTION':
      case 'UPDATED_SHIPPING_ADDRESS':
      case 'RETURNS':
      case 'CANCELLED_RETURN':
      case 'CREATED_NEW_LABELS':
      case 'MARKED_ALL_AS_RECEIVED':
      case 'CANCELLED_RELEASE':
      case 'RESEND_RETURN_LABELS':
        return orderInteractionSummaryLabels;
      default:
        return {};
    }
  };

  const appeasementMap = new Map();

  const orderReturnAppeasementTypes = new Set([
    'RETURNS',
    'CANCELLED_RETURN',
    'CREATED_NEW_LABELS',
    'MARKED_ALL_AS_RECEIVED',
  ]);

  // special handling for RETURNS data as the backend object is specifically totally different for that
  // returns and regular order appeasements may have same appeasement id, but need to be treated differently
  for (const appeasement of appeasements) {
    if (orderReturnAppeasementTypes.has(appeasement.type)) {
      const mapKey = `${appeasement.appeasementId}-RETURNS`;
      if (appeasementMap.has(mapKey)) {
        const appeasementArr = appeasementMap.get(mapKey);
        appeasementArr.push(appeasement);
        appeasementMap.set(mapKey, appeasementArr);
      } else {
        appeasementMap.set(mapKey, [appeasement]);
      }
    } else {
      if (appeasementMap.has(appeasement.appeasementId)) {
        const appeasementArr = appeasementMap.get(appeasement.appeasementId);
        appeasementArr.push(appeasement);
        appeasementMap.set(appeasement.appeasementId, appeasementArr);
      } else {
        appeasementMap.set(appeasement.appeasementId, [appeasement]);
      }
    }
  }

  return (
    <div className={classes.root}>
      {appeasementMap &&
        [...appeasementMap].map(([appeasementId, appeasementArr]) => (
          <InteractionAppeasement
            id={`${id}-${appeasementId}`}
            key={`${id}-${appeasementId}`}
            isSummary={isSummary}
            appeasements={appeasementArr}
            interactionSummaryLabels={getInteractionSummaryLabels(appeasementArr[0].type)}
          />
        ))}
    </div>
  );
};

AgentInteractionAppeasementData.propTypes = {
  id: PropTypes.string,
  appeasements: PropTypes.array,
  isSummary: PropTypes.bool,
};

export default AgentInteractionAppeasementData;
