import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { getDayDateTimeTimezone } from '@/utils';
import cn from 'classnames';
import { currencyFormatter, capitalize } from '@/utils/string';
import useAthena from '@/hooks/useAthena';

const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: 'Roboto',
    fontWeight: '600',
    fontSize: '1rem',
    marginBottom: '0.75rem',
    color: theme.palette.blue.dark,
    marginTop: '20px',
  },
  paymentRow: {
    display: 'grid',
    gridTemplateColumns: '30% 20% 20% 15% auto',
    backgroundColor: '#F5F5F5',
    maxWidth: '1090px',
    height: '50px !important',
    marginTop: '15px',
    columnGap: '7px',
  },
  paymentPanel: {
    display: 'grid',
    gridTemplateColumns: '30% 20% 20% 15% auto',
    maxWidth: '1090px',
    columnGap: '10px',
  },
  paymentHeading: {
    marginTop: '15px',
    marginLeft: '15px',
    color: '#000000',
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: '16px',
  },
  paymentValue: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontStyle: 'regular',
    fontSize: theme.utils.fromPx(14),
    lineHeight: theme.utils.fromPx(21),
    paddingLeft: theme.utils.fromPx(16),
    paddingTop: theme.utils.fromPx(16),
  },
  paymentLabelValuePanel: {
    display: 'flex',
    flexDirection: 'column',
  },
  layout: {
    maxWidth: '1090px',
    border: '1px solid #999999',
  },
}));
const OrderDetailsPaymentCredits = ({ paymentDetail }) => {
  const classes = useStyles();

  const { getLang } = useAthena(); // athena config

  return (
    <div data-testid="orderDetailscreditCredits">
      {paymentDetail?.credits?.length > 0 ? (
        <div>
          <div className={classes.title}>{getLang('credit', { fallback: 'Credits' })}</div>
          <div className={classes.paymentRow}>
            <div className={classes.paymentHeading}>
              {getLang('orderCreditID', { fallback: 'Credit ID' })}
            </div>
            <div className={classes.paymentHeading}>
              {getLang('orderCreated', { fallback: 'Created' })}
            </div>
            <div className={classes.paymentHeading}>
              {getLang('orderExpected', { fallback: 'Expected' })}
            </div>
            <div className={classes.paymentHeading}>
              {getLang('orderCredited', { fallback: 'Credited' })}
            </div>
            <div className={classes.paymentHeading}>
              {getLang('orderStatus', { fallback: 'Status' })}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <span className={classes.title}>{getLang('credit', { fallback: 'Credits' })}</span>
          <br />
          <span className={classes.creditRow}>{'N/A'}</span>
        </div>
      )}
      {paymentDetail?.credits?.length > 0 &&
        paymentDetail?.credits?.map((credit) => {
          return (
            <div
              key={credit.paymentId}
              data-testid="order:credit:history:accordion:details"
              className={classes.layout}
            >
              <div className={classes.paymentPanel}>
                <div className={classes.paymentLabelValuePanel}>
                  <span className={classes.paymentValue}>{credit?.paymentId}</span>
                </div>
                <div className={classes.paymentLabelValuePanel}>
                  <span className={classes.paymentValue}>
                    {getDayDateTimeTimezone(credit?.timeCreated)}
                  </span>
                </div>
                <div className={cn(classes.paymentLabelValuePanel)}>
                  <span className={classes.paymentValue}>
                    {credit?.paymentAmount?.requested ? (
                      <>{currencyFormatter(credit?.paymentAmount?.requested)}</>
                    ) : null}
                  </span>
                </div>
                <div className={cn(classes.paymentLabelValuePanel)}>
                  <span className={classes.paymentValue}>
                    {credit?.paymentAmount?.credited ? (
                      <>{currencyFormatter(credit?.paymentAmount?.credited)}</>
                    ) : null}
                  </span>
                </div>
                <div className={cn(classes.paymentLabelValuePanel)}>
                  <span className={classes.paymentValue}>{capitalize(credit?.paymentStatus)}</span>
                </div>
                <br />
              </div>
            </div>
          );
        })}
      {paymentDetail?.credits?.length === 0 && (
        <div>
          <span className={classes.title}>{'Credits'}</span>
          <br />
          <span className={classes.creditRow}>{'N/A'}</span>
        </div>
      )}
    </div>
  );
};

OrderDetailsPaymentCredits.propTypes = {
  paymentDetail: PropTypes.object,
};

export default OrderDetailsPaymentCredits;
