import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import { capitalize } from '@utils/string';
import InteractionAppeasementDetail from '@components/InteractionSummary/InteractionAppeasementDetail';
import _ from 'lodash';
import { formatReturnState, formatReturnType } from '@components/Card/utils';
import { getContactReason } from '@components/InteractionSummary/utils';

const useStyles = makeStyles((theme) => ({
  interactionHeader: {
    lineHeight: '1.30rem',
    fontWeight: '700',
    letterSpacing: '0.25px',
    marginTop: '10px',
  },
  actionContainer: {
    marginBottom: '8px',
    '&:last-child': {
      marginBottom: '0px',
    },
  },
}));

const InteractionAppeasement = ({
  id,
  appeasements,
  interactionSummaryLabels,
  isSummary = true,
}) => {
  const classes = useStyles();

  const getAction = () => {
    const data = _.reduce(
      appeasements,
      (result, value, idx) => {
        return [...result, ...getActionForAppeasement(value, idx)];
      },
      [],
    );
    return data;
  };

  const getActionForAppeasement = (appeasement, idx) => {
    switch (appeasement.type) {
      case 'PET_PROFILE':
        return getPetProfileAction(appeasement, idx);
      case 'CUSTOMER_PROFILE':
        return getCustomerProfileAction(appeasement);
      case 'CUSTOMER_TAGS':
        return getCustomerTagsAction(appeasement);
      case 'ACCOUNT_PASSWORD_RESET':
        return [labelValue(interactionSummaryLabels.resetPasswordText)];
      case 'AUSTOSHIP_RESCHEDULED':
        return getAutoshipAction(appeasement, idx, 'autoshipRescheduledText');
      case 'AUTOSHIP_TRIGGERED':
        return getAutoshipAction(appeasement, idx, 'autoshipTriggeredText');
      case 'AUTOSHIP_SKIPPED':
        return getAutoshipAction(appeasement, idx, 'autoshipSkippedText');
      case 'AUTOSHIP_FREQUENCY_UPDATED':
        return getAutoshipAction(appeasement, idx, 'autoshipUpdatedFrequencyText');
      case 'AUTOSHIP_CANCELLED':
        return getAutoshipAction(appeasement, idx, 'autoshipCancelledText');
      case 'AUTOSHIP_NOTIFICATION_RESENT':
        return getAutoshipAction(appeasement, idx, 'autoshipResentEmailText');
      case 'SENT_INVOICE_EMAIL':
        return getOrderAction(appeasement, idx, 'orderInvoiceEmailText');
      case 'SENT_ORDER_CONFIRM_EMAIL':
        return getOrderAction(appeasement, idx, 'orderConfirmEmailText');
      case 'CANCELLED_ORDER':
        return getOrderAction(appeasement, idx, 'orderCancelledText');
      case 'TRACKED_PACKAGE':
        return getOrderAction(appeasement, idx, 'orderTrackedPackageText');
      case 'REMOVED_ITEM':
        return getOrderAction(appeasement, idx, 'orderRemovedItemText');
      case 'REDUCED_QUANTITY':
        return getOrderAction(appeasement, idx, 'orderReducedQtyText');
      case 'ADJUSTED_PRICE':
        return getOrderAction(appeasement, idx, 'orderAdjustedPriceText');
      case 'ADDED_PROMOTION':
        return getOrderAction(appeasement, idx, 'orderAddedPromotionText');
      case 'UPDATED_SHIPPING_ADDRESS':
        return getOrderAction(appeasement, idx, 'orderUpdatedShipAddressText');
      case 'RETURNS':
        return getReturnsAction(appeasement);
      case 'CANCELLED_RETURN':
        return getOrderAction(appeasement, idx, 'orderCancelledReturnText');
      case 'CREATED_NEW_LABELS':
        return getOrderAction(appeasement, idx, 'orderCreatedNewLabelsText');
      case 'MARKED_ALL_AS_RECEIVED':
        return getOrderAction(appeasement, idx, 'orderMarkedReceivedText');
      case 'CANCELLED_RELEASE':
        return getOrderAction(appeasement, idx, 'orderCancelledReleaseText');
      case 'RESEND_RETURN_LABELS':
        return getOrderAction(appeasement, idx, 'message.interactionSummary.return.resendLabels');
      default:
        return '';
    }
  };

  const getSubstitution = () => {
    if (!appeasements || appeasements.length === 0) {
      return '';
    }
    switch (appeasements[0].type) {
      case 'AUSTOSHIP_RESCHEDULED':
      case 'AUTOSHIP_TRIGGERED':
      case 'AUTOSHIP_SKIPPED':
      case 'AUTOSHIP_FREQUENCY_UPDATED':
      case 'AUTOSHIP_CANCELLED':
      case 'AUTOSHIP_NOTIFICATION_RESENT':
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
        return ` #${appeasements[0].appeasementId}`;
      default:
        return '';
    }
  };

  /*
    returns if the currentVal array properties have any values added for the same properties in prevVal
    Example:
      const currentVal = { 'a': 1, 'b': [{"id": 1}, {"id": 2}], 'c': [{"id": 3}, {"id": 4}] };
      const prevVal = { 'z': 1, 'b': [{"id": 1}, {"id": 2}], 'c': [{"id": 4}] };
      // prop 'c' in currentVal has more values
      isArrayValuesDifferentForKeys(currentVal, prevVal, ["b", "c"], "id") // true
      isArrayValuesDifferentForKeys(prev, currentVal, ["b", "c"], "id") // false
    Params:
    currentVal – The source object.
    prevVal – The reference object.
    keysToCompare – The property names to pick for comparison
    identifier - identifier for array objects to use for comparison
    Returns:
    Returns a boolean indicating if new values are added
   */
  const isArrayValuesDifferentForKeys = (currentVal, prevVal, keysToCompare, identifier) => {
    return (
      _.reduce(
        _.pick(currentVal, keysToCompare),
        (result, value, key) =>
          _.differenceBy(value, prevVal[key], identifier).length > 0 ? [...result, ...key] : result,
        [],
      ).length > 0
    );
  };

  const getDifferentKeys = (currentVal, prevVal) => {
    if (!currentVal) {
      return [];
    }
    if (!prevVal) {
      return _.keys(currentVal);
    }
    return _.reduce(
      currentVal,
      function (result, value, key) {
        return _.isEqual(value, prevVal[key]) ? result : [...result, key];
      },
      [],
    );
  };

  const getAutoshipAction = (appeasement, idx, label) => {
    const name = labelValue('Autoship Name:', appeasement?.details?.currentVal.name);
    const action = labelValue('Action:', interactionSummaryLabels[label]);
    return idx === 0 ? [name, action] : [action];
  };

  const getOrderAction = (appeasement, idx, label) => {
    const action = labelValue('Action:', interactionSummaryLabels[label]);
    return [action];
  };

  const getReturnsAction = (appeasement) => {
    const actions = appeasement.actions?.flatMap((action) => {
      const actionRecord = labelValue(
        `${formatReturnType(action?.type)} (${formatReturnState(action?.state)}):`,
        `Item #${appeasement.details.itemId} ${capitalize(appeasement?.description)}`,
      );

      const reason = getContactReason(appeasement?.details);
      const comment = appeasement?.details?.comment
        ? `"${appeasement.details.comment}"`
        : 'No return comments';

      return !!reason
        ? [actionRecord, labelValue('Reason:', `${reason} - ${comment}`, true)]
        : [actionRecord];
    });

    return actions;
  };

  const getPetProfileAction = (appeasement, idx) => {
    let actionText = '';
    const prevVal = appeasement?.details?.prevVal;
    const currentVal = appeasement?.details?.currentVal;
    const petTags = [
      'medications',
      'medicationAllergies',
      'existingMedicalConditions',
      'allergies',
    ];
    if (prevVal) {
      if (currentVal.status === 'INACTIVE') {
        actionText = interactionSummaryLabels.petDeactivatedText;
      } else if (currentVal.status === 'ACTIVE') {
        actionText = interactionSummaryLabels.petActivatedText;
      } else {
        if (isArrayValuesDifferentForKeys(currentVal, prevVal, petTags, 'id')) {
          actionText = interactionSummaryLabels.petAddedTagText;
        } else if (isArrayValuesDifferentForKeys(prevVal, currentVal, petTags, 'id')) {
          actionText = interactionSummaryLabels.petRemovedTagText;
        } else {
          actionText = interactionSummaryLabels['petUpdatedText'];
        }
      }
    } else {
      actionText = interactionSummaryLabels['petCreatedText'];
    }
    const name = labelValue('Pet name:', capitalize(appeasement?.details?.currentVal?.name));
    const action = labelValue('Action:', actionText);
    return idx === 0 ? [name, action] : [action];
  };

  const getCustomerTagsAction = (appeasement) => {
    const prevVal = appeasement?.details?.prevVal;
    const currentVal = appeasement?.details?.currentVal;
    const isAdded =
      !prevVal ||
      (prevVal && _.entries(currentVal).some(([k, v]) => prevVal[k] !== v && (!v || v !== '-1')));
    return isAdded
      ? [labelValue(interactionSummaryLabels.addedTagText)]
      : [labelValue(interactionSummaryLabels.removedTagText)];
  };

  const getCustomerProfileAction = (appeasement) => {
    const differences = getDifferentKeys(
      appeasement?.details?.currentVal,
      appeasement?.details?.prevVal,
    );

    const labelMapping = {
      email: 'updatedEmailText',
      fullName: 'updatedNameText',
      status: 'updatedAccountStatusText',
      phone: 'updatedPhoneNoText',
    };

    return _.reduce(
      differences,
      (result, value) => [...result, labelValue(interactionSummaryLabels[labelMapping[value]])],
      [],
    );
  };

  const labelValue = (label, value = '', indent = false) => ({
    label: label,
    value: value,
    indent: indent,
  });

  const data = getAction();
  const appeasement = appeasements[0];

  const isValidData = appeasement?.type === 'SWITCH_TO_USER' || data.length > 0;

  const getDescription = (appeasement) => {
    if (appeasement?.type === 'RETURNS') {
      return interactionSummaryLabels.orderReturnedText;
    }
    return interactionSummaryLabels[appeasement.description] || appeasement.description;
  };
  return (
    isValidData && (
      <div>
        <Typography data-testid={`${id}-header`} variant="h6" className={classes.interactionHeader}>
          {getDescription(appeasement)}
          {getSubstitution()}
        </Typography>
        <div className={classes.actionContainer}>
          <Grid container>
            <Grid item xs={8}>
              <InteractionAppeasementDetail isSummary={isSummary} id={id} data={data} />
            </Grid>
          </Grid>
        </div>
      </div>
    )
  );
};

InteractionAppeasement.propTypes = {
  id: PropTypes.string,
  appeasements: PropTypes.arrayOf(PropTypes.object),
  interactionSummaryLabels: PropTypes.object,
  isSummary: PropTypes.bool,
};

export default InteractionAppeasement;
