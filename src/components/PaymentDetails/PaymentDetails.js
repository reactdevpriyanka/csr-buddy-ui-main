import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import PaymentMethod from '@components/PaymentMethod';
import paymentIcons from '@components/PaymentIcons';
import { getPaymentIcon, getPaymentTypeLabel } from '../PaymentMethod/paymentMethodConst';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 0,
    margin: 0,
    '& > li': {
      display: 'flex',
      flexFlow: 'row nowrap',
      alignItems: 'center',
      ...theme.fonts.body.medium,
      whiteSpace: 'nowrap',
    },
    '& figure': {
      display: 'inline-block',
      maxWidth: theme.utils.fromPx(40),
      height: 'auto',
      width: theme.utils.fromPx(35),
      margin: 0,
      padding: 0,
      '& .MuiSvgIcon-root': {
        width: theme.utils.fromPx(25),
      },
      '& #G_Pay_Acceptance_Mark': {
        width: '50px',
        height: 'auto',
        display: 'block',
      },
    },
  },
  text: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontStyle: 'normal',
    fontSize: '14px',
    lineHeight: '16px',
    color: '#121212',
  },
  paymentContainer: {
    '& li:first-of-type': {
      whiteSpace: 'nowrap',
      display: 'block',
    },
  },
  cardNum: {
    verticalAlign: 'super',
  },
  cardIcon: {
    verticalAlign: 'sub',
  },
}));

const PaymentDetails = ({ details = [], id }) => {
  const classes = useStyles();

  const filteredDetails = details.filter(
    (detail) =>
      (detail.card && detail.card.type && detail.card.accountNumber) ||
      (detail.service && detail.service.serviceName),
  );

  return (
    <ul className={classes.root} data-testid={`payment-details-${id}`}>
      {filteredDetails.map(({ card, service, paymentReferenceId }) => {
        const isPayPal = /paypal/i.test(service?.serviceName);
        return card ? (
          <div key={`payment-method-${paymentReferenceId}`} className={classes.paymentContainer}>
            <span className={classes.text}>{card.cardHolderName}</span>
            <PaymentMethod
              className={classes.cardIcon}
              icon={paymentIcons[card?.type.toUpperCase()]}
            >
              <span className={classes.cardNum}>
                {`${card?.type} ending in ${card?.accountNumber.slice(-4)}`}
              </span>
            </PaymentMethod>
            {card?.expirationMonth && card?.expirationYear && (
              <span>
                Expiry {card.expirationMonth}/{card.expirationYear}
              </span>
            )}
          </div>
        ) : (
          <PaymentMethod
            key={`payment-method-${paymentReferenceId}`}
            icon={getPaymentIcon(service?.serviceName.toUpperCase())}
          >
            {isPayPal
              ? `${service?.accountEmail}`
              : getPaymentTypeLabel(service?.serviceName.toUpperCase())}
          </PaymentMethod>
        );
      })}
      {filteredDetails.length === 0 && <li>{'Unknown'}</li>}
    </ul>
  );
};

PaymentDetails.propTypes = {
  details: PropTypes.array,
  id: PropTypes.string,
};

export default PaymentDetails;
