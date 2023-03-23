import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { useMemo } from 'react';
import FeatureFlag from '@/features/FeatureFlag';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
  },
  label: {
    color: theme.palette.white,
    fontSize: 14,
    fontWeight: 500,
    marginTop: 8,
  },
  value: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '400',
  },
  valueNone: {
    marginTop: 8,
    color: theme.palette.gray[350],
    fontSize: 12,
    fontStyle: 'italic',
  },
  row: {
    marginTop: 12,
  },
  extraTopPadding: {
    marginTop: 16,
  },
}));

const PopoverComment = ({
  specialNote = 'N/A',
  disposition = 'N/A',
  incidentNumber = 'N/A',
  initialContactReason = 'N/A',
  appeasements = [],
  orderIds = [],
}) => {
  const classes = useStyles();

  if (disposition === 'No Action Needed') {
    disposition = 'N/A';
  }

  const mergedDispositions = useMemo(() => {
    const dispositions = [];

    for (const orderId of orderIds) {
      // Filters and overlays all apeasement properties with the same appeasementId
      // The BE adds summary page dispositions where applicable so this ensures we get all
      // available properties at an order level
      const mergedDispositionsAppeasement = Object.assign(
        {},
        ...appeasements.filter(({ appeasementId }) => appeasementId === orderId),
      );

      const {
        details: {
          snailMailLabels,
          quantityOfBoxesChecked,
          fedexPickup,
          deliveryComplaint,
          shippingInstructions,
        } = {},
      } = mergedDispositionsAppeasement || {};

      dispositions.push({
        orderId: orderId,
        snailMailLabels: snailMailLabels,
        quantityOfBoxesChecked: quantityOfBoxesChecked,
        fedexPickup: fedexPickup,
        deliveryComplaint: deliveryComplaint,
        shippingInstructions: shippingInstructions,
      });
    }

    return dispositions.filter((disposition) =>
      Object.entries(disposition).some(([key, value]) => key !== 'orderId' && value),
    );
  }, [orderIds, appeasements]);

  return (
    <div className={classes.root} data-testid="popover-comment:body">
      <div className={classes.label}>Contact Details</div>
      <div className={classes.value} data-testid="incident-number">
        Incident #{incidentNumber}
      </div>
      <div className={classes.value} data-testid="initial-contact-reason">
        Initial Contact Reason: {initialContactReason}
      </div>
      <div className={classes.label}>Disposition:</div>
      <div className={classes.value} data-testid="disposition">
        {disposition}
      </div>
      <FeatureFlag flag="feature.explorer.summaryPageDispositionsEnabled">
        {mergedDispositions.map(
          ({
            orderId,
            fedexPickup,
            quantityOfBoxesChecked,
            snailMailLabels,
            deliveryComplaint,
            shippingInstructions,
          }) => (
            <div key={orderId} data-testid={`disposition-content:${orderId}`}>
              <div className={classnames(classes.label)} data-testid="disposition">
                Disposition: #{orderId}
              </div>
              {!!fedexPickup && (
                <div className={classes.value} data-testid="fedex-pickup">
                  Supply - Pickup
                </div>
              )}
              {!!snailMailLabels && (
                <div className={classes.value} data-testid="snail-mail">
                  Supply - Snail Mail
                </div>
              )}
              {!!quantityOfBoxesChecked && (
                <div className={classes.value} data-testid="boxes">
                  Supply - Boxes
                </div>
              )}
              {!!deliveryComplaint && (
                <div className={classes.value} data-testid="shipping-complaint">
                  Supply - Shipping Complaints
                </div>
              )}
              {!!shippingInstructions && (
                <div className={classes.value} data-testid="shipping-instructions">
                  Supply - Shipping Instructions
                </div>
              )}
            </div>
          ),
        )}
      </FeatureFlag>
    </div>
  );
};

PopoverComment.propTypes = {
  specialNote: PropTypes.string,
  disposition: PropTypes.string,
  incidentNumber: PropTypes.string,
  initialContactReason: PropTypes.string,
  appeasements: PropTypes.array,
  orderIds: PropTypes.arrayOf(PropTypes.string),
};

export default PopoverComment;
