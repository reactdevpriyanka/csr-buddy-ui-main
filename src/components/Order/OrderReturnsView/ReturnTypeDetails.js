/* eslint-disable jsx-a11y/anchor-is-valid */
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { capitalize, snakeCaseToTitleCase } from '@/utils/string';
import useAthena from '@/hooks/useAthena';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: '10px',
    backgroundColor: '#FFFFFF',
  },
  returnDetailsTitle: {
    fontFamily: 'Roboto',
    color: '#666666',
    fontWeight: '400',
    fontSize: theme.utils.fromPx(12),
    lineHeight: theme.utils.fromPx(16),
    marginTop: '0.75rem',
  },
  returnDetailsValueTitle: {
    fontFamily: 'Roboto',
    color: '#121212',
    fontWeight: '400',
    fontSize: theme.utils.fromPx(14),
    lineHeight: theme.utils.fromPx(20),
  },
  returnStatusDetailsTitle: {
    fontFamily: 'Roboto',
    color: '#666666',
    fontWeight: '400',
    fontSize: theme.utils.fromPx(12),
    lineHeight: theme.utils.fromPx(16),
    marginTop: '0.75rem',
    paddingRight: theme.utils.fromPx(16),
    justifySelf: 'end',
  },
  returnStatusDetailsValueTitle: {
    fontFamily: 'Roboto',
    color: '#121212',
    fontWeight: '400',
    fontSize: theme.utils.fromPx(14),
    lineHeight: theme.utils.fromPx(20),
    paddingRight: theme.utils.fromPx(16),
    justifySelf: 'end',
  },
}));

const ReturnTypeDetails = ({ returnData }) => {
  const classes = useStyles();
  const { getLang } = useAthena(); // athena config
  const isReplacement = returnData?.type === 'REPLACEMENT';

  return (
    <div data-testid="returnTypeContainer" className={classes.root}>
      {isReplacement ? (
        <>
          <div className={classes.returnDetailsTitle}>
            {getLang('returnRefundsID', { fallback: 'Return ID' })}
          </div>
          <span className={classes.returnDetailsValueTitle}>{returnData?.id}</span>
          <div className={classes.returnDetailsTitle}>
            {getLang('returnRefundsType', { fallback: 'Return Type' })}
          </div>
          <span className={classes.returnDetailsValueTitle}>{capitalize(returnData?.type)}</span>
        </>
      ) : (
        <>
          <div className={classes.returnDetailsTitle}>
            {getLang('returnRefundsID', { fallback: 'Return ID' })}
          </div>
          <span className={classes.returnDetailsValueTitle}>{returnData?.id}</span>
          <div className={classes.returnDetailsTitle}>
            {getLang('returnRefundsType', { fallback: 'Return Type' })}
          </div>
          <span className={classes.returnDetailsValueTitle}>{capitalize(returnData?.type)}</span>
          <div className={classes.returnStatusDetailsTitle}>
            {getLang('returnRefundsPaymentMethod', { fallback: 'Payment Method' })}
          </div>
          <span
            className={classes.returnStatusDetailsValueTitle}
            data-testid={`return:${returnData?.payment?.paymentMethod?.type}`}
          >
            {returnData?.paymentDetails?.length > 0 &&
              returnData?.paymentDetails
                ?.map((payment) =>
                  payment?.paymentMethod?.type === 'CREDIT_CARD'
                    ? snakeCaseToTitleCase(payment?.paymentMethod?.creditCard?.cardType)
                    : payment?.paymentMethod?.type === 'GIFT_CARD'
                    ? snakeCaseToTitleCase(payment?.paymentMethod?.type)
                    : snakeCaseToTitleCase(
                        payment?.paymentMethod?.service?.type.replace(/_/g, ' '),
                      ),
                )
                .join(', ')}
          </span>
        </>
      )}
    </div>
  );
};

ReturnTypeDetails.propTypes = {
  returnData: PropTypes.object,
};

export default ReturnTypeDetails;
