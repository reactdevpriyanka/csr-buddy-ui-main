import { makeStyles } from '@material-ui/core/styles';
import { getDayDateYearTimeTimezone } from '@/utils';
import cn from 'classnames';
import { currencyFormatter, capitalize } from '@/utils/string';
import PropTypes from 'prop-types';
import useAthena from '@/hooks/useAthena';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.utils.fromPx(16),
  },
  title: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: theme.utils.fromPx(18),
    lineHeight: theme.utils.fromPx(24),
    marginBottom: '0.75rem',
    color: '#031657',
    marginTop: '20px',
  },
  returnRow: {
    display: 'grid',
    gridTemplateColumns: '60% 15% 10% 10% auto',
    backgroundColor: '#EEEEEE',
    height: '50px !important',
    marginTop: '15px',
  },
  returnPanel: {
    display: 'grid',
    gridTemplateColumns: '60% 15% 10% 10% auto',
    backgroundColor: '#FFFFFF',
  },
  returnHeading: {
    padding: '16px 24px 8px 16px',
    color: '#000000',
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: '12px',
    lineHeight: theme.utils.fromPx(16),
  },
  returnValue: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontStyle: 'regular',
    fontSize: theme.utils.fromPx(14),
    lineHeight: theme.utils.fromPx(20),
    paddingLeft: theme.utils.fromPx(16),
    paddingTop: theme.utils.fromPx(16),
  },
  returnStatusValue: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontStyle: 'regular',
    fontSize: theme.utils.fromPx(14),
    lineHeight: theme.utils.fromPx(20),
    paddingTop: theme.utils.fromPx(16),
    justifySelf: 'end',
    paddingRight: theme.utils.fromPx(16),
  },
  returnLabelValuePanel: {
    display: 'flex',
    flexDirection: 'column',
  },
  returnLabelValuePanelStatus: {
    display: 'flex',
    flexDirection: 'column',
    justifySelf: 'end',
    paddingRight: theme.utils.fromPx(16),
  },
  creditRow: {
    paddingLeft: theme.utils.fromPx(16),
    color: '#121212',
    fontSize: '0.8750rem',
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: '1.2500rem',
  },
}));
const OrderDetailsReturnCredits = ({ returnData }) => {
  const classes = useStyles();
  const { getLang } = useAthena(); // athena config

  let payments = [];
  if (returnData?.paymentDetails) {
    for (const detail of returnData.paymentDetails) {
      if (detail.payments) {
        payments.push(...detail.payments);
      }
    }
  }

  return (
    <div className={classes.root} data-testid="returnDetailsCredits">
      {payments.length > 0 ? (
        <div>
          <div className={classes.title}>
            {' '}
            {getLang('returnConcessionCredits', { fallback: 'Credits' })}
          </div>
          <div className={classes.returnRow}>
            <div className={classes.returnHeading}>
              {getLang('returnConcessionCreditID', { fallback: 'Credit ID' })}
            </div>
            <div className={classes.returnHeading}>
              {getLang('returnConcessionCreated', { fallback: 'Created' })}
            </div>
            <div className={classes.returnHeading}>
              {getLang('returnConcessionExpected', { fallback: 'Expected' })}
            </div>
            <div className={classes.returnHeading}>
              {getLang('returnConcessionCredited', { fallback: 'Credited' })}
            </div>
            <div className={classes.returnHeading}>
              {getLang('returnConcessionStatus', { fallback: 'Status' })}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <span className={classes.title}>
            {getLang('returnConcessionCredits', { fallback: 'Credits' })}
          </span>
          <br />
          <span className={classes.creditRow}>
            {getLang('returnConcessionNA', { fallback: 'N/A' })}
          </span>
        </div>
      )}
      {payments.length > 0 &&
        payments.map((credit) => {
          return (
            <div key={credit.paymentId} data-testid="return:credit:details">
              <div className={classes.returnPanel}>
                <div className={classes.returnLabelValuePanel}>
                  <span className={classes.returnValue}>{credit?.paymentId}</span>
                </div>
                <div className={classes.returnLabelValuePanel}>
                  <span className={classes.returnValue}>
                    {getDayDateYearTimeTimezone(credit?.timeCreated)}
                  </span>
                </div>
                <div className={cn(classes.returnLabelValuePanel)}>
                  <span className={classes.returnValue}>
                    {currencyFormatter(credit?.paymentAmount?.requested)}
                  </span>
                </div>
                <div className={cn(classes.returnLabelValuePanel)}>
                  <span className={classes.returnValue}>
                    {currencyFormatter(credit?.paymentAmount?.credited)}
                  </span>
                </div>
                <div className={cn(classes.returnLabelValuePanelStatus)}>
                  <span className={classes.returnStatusValue}>
                    {capitalize(credit?.paymentStatus)}
                  </span>
                </div>
                <br />
              </div>
            </div>
          );
        })}
      {returnData?.credits?.length === 0 && (
        <div>
          <span className={classes.title}>
            {getLang('returnConcessionCredits', { fallback: 'Credits' })}
          </span>
          <br />
          <span className={classes.creditRow}>
            {' '}
            {getLang('returnConcessionNA', { fallback: 'N/A' })}
          </span>
        </div>
      )}
    </div>
  );
};

OrderDetailsReturnCredits.propTypes = {
  returnData: PropTypes.object,
};

export default OrderDetailsReturnCredits;
