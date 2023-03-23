import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { getDayDateTimeTimezone } from '@/utils';
import useAthena from '@/hooks/useAthena';

const useStyles = makeStyles((theme) => ({
  paymentText: {
    lineHeight: '1rem',
    marginLeft: '4.75rem',
    marginTop: '1.25rem',
  },
  title: {
    fontFamily: 'Roboto',
    fontWeight: '600',
    fontSize: '1rem',
    marginLeft: '5.75rem',
    marginBottom: '0.75rem',
    color: theme.palette.blue.dark,
  },
  instructionTitle: {
    fontFamily: 'Roboto',
    color: '#666666',
    fontSize: '0.85rem',
    marginTop: '0.75rem',
  },
  paymentStatustitle: {
    fontFamily: 'Roboto',
    color: 'green',
    fontSize: '0.75rem',
    marginLeft: '1.25rem',
  },
}));

const OrderDetailsPaymentInstructionDetails = ({ paymentDetail }) => {
  const classes = useStyles();

  const { getLang } = useAthena(); // athena config

  return (
    <div data-testid="orderDetailsPaymentInstructionDetails">
      <span className={classes.title}>{'Instruction Details'}</span>
      <div className={classes.paymentText}>
        <div className={classes.instructionTitle}>
          {getLang('orderPaymentInstructionID', { fallback: 'Instruction ID' })}
        </div>
        {paymentDetail?.instructionId}
        <div className={classes.instructionTitle}>
          {getLang('orderPaymentRefernceID', { fallback: 'Payment Reference ID' })}
        </div>
        {paymentDetail?.paymentReferenceId}
        <div className={classes.instructionTitle}>
          {getLang('orderCredited', { fallback: 'Credited' })}
        </div>
        {getDayDateTimeTimezone(paymentDetail?.timeCreated)}
        <div className={classes.instructionTitle}>
          {getLang('orderUpdated', { fallback: 'Updated' })}
        </div>
        {getDayDateTimeTimezone(paymentDetail?.timeUpdated)}
        <br />
        <br />
      </div>
    </div>
  );
};

OrderDetailsPaymentInstructionDetails.propTypes = {
  paymentDetail: PropTypes.object,
};

export default OrderDetailsPaymentInstructionDetails;
