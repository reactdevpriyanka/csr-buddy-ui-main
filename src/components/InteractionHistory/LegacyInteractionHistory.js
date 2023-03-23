import Appeasements from '@components/InteractionHistory/Appeasements/Appeasements';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useMemo } from 'react';

const useStyles = makeStyles((theme) => ({
  extraTopPadding: {
    marginTop: theme.utils.fromPx(16),
  },
  orderNumber: {
    fontSize: theme.utils.fromPx(12),
    marginTop: theme.utils.fromPx(6),
    '&:not(:first-child)': {
      marginTop: theme.utils.fromPx(16),
    },
  },
}));

const LegacyInteractionHistory = ({ contactReason, appeasements }) => {
  const classes = useStyles();

  const orderIds = useMemo(() => {
    return appeasements
      ?.filter((appeasement) => appeasement?.appeasementId)
      ?.map((a) => a.appeasementId)
      ?.filter((value, index, self) => self.indexOf(value) === index);
  }, [appeasements]);

  return (
    <div>
      {orderIds &&
        orderIds?.length > 0 &&
        orderIds.map((orderId, index) => (
          <div key={`${orderId}-history`} className={index > 0 ? classes.extraTopPadding : ' '}>
            <div className={classes.orderNumber} data-testid="order-id:history-card">
              Order #{orderId}{' '}
            </div>
            <Appeasements
              appeasements={appeasements}
              orderId={orderId}
              contactReason={contactReason}
            />
          </div>
        ))}
    </div>
  );
};

LegacyInteractionHistory.propTypes = {
  contactReason: PropTypes.string,
  appeasements: PropTypes.array,
};

export default LegacyInteractionHistory;
