import PropTypes from 'prop-types';
import _ from 'lodash';
import { makeStyles, Typography } from '@material-ui/core';
import cn from 'classnames';
import { useMemo } from 'react';
import useGwfContext from '@/hooks/useGwfContext';
import useFeature from '@/features/useFeature';
import { getPaymentIcon, getPaymentTypeLabel } from '../PaymentMethod/paymentMethodConst';

const useStyles = makeStyles((theme) => ({
  root: { '& ul': { padding: 0 } },
  bolded: { fontSize: theme.fonts.size.md, fontWeight: 'bold', marginBottom: theme.spacing(0.5) },
  title: { fontSize: theme.fonts.size.md, fontWeight: 400, marginBottom: theme.utils.fromPx(8) },
  paymentItem: {
    ...theme.fonts.body.normal,
  },
  label: {},
  icon: {
    margin: 0,
    marginLeft: theme.utils.fromPx(8),
    width: theme.utils.fromPx(40),
  },
  block: {
    display: 'block',
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
  },
  coloradoRetailDeliveryFee: {
    colro: '4D4D4D',
    fontSize: theme.utils.fromPx(12),
    lineHeight: theme.utils.fromPx(16),
    paddingTop: theme.utils.fromPx(24),
  },
}));

const PaymentList = ({ label = 'Refunded to', value = [] }) => {
  const classes = useStyles();
  const enableCRDF = useFeature('feature.explorer.coloradoRetailDeliveryFeeEnabled');

  const {
    orderFees,
    summaryDetails: { hasCRDF },
  } = useGwfContext();

  const coloradoRetailDeliveryFee = useMemo(() => {
    const fee = orderFees?.find(({ type = '' }) => type === 'RDF_CO');
    return fee?.amount?.value;
  }, [orderFees]);

  if (!value || value.length === 0) return null;

  const getLabelText = (method) => {
    if (method.card) {
      return `${method.card?.type} ending in ${method.card?.accountNumber?.slice(-4)}`;
    }
    return method?.service?.serviceName || '';
  };

  return (
    <div className={classes.root}>
      <Typography variant="h1" className={cn([classes.title])}>
        {label}
      </Typography>
      {_.compact(value).map((method, i) => (
        <div className={classes.paymentItem} key={`${method.paymentReferenceId}-${i}`}>
          {method?.card ? (
            <>
              <div>{method?.card?.cardHolderName}</div>
              <div className={classes.flex}>
                <span className={classes.label}>{getLabelText(method)}</span>
                <figure className={classes.icon}>
                  {getPaymentIcon(method?.card?.type.toUpperCase())}
                </figure>
              </div>
              <div>
                Exp {method.card?.expirationMonth}/{method.card?.expirationYear}
              </div>
            </>
          ) : method?.service?.serviceName === 'PayPal' ? (
            <div className={classes.flex}>
              <span className={classes.label}>{method?.service?.accountEmail}</span>
              <figure className={classes.icon}>
                {getPaymentIcon(method?.service?.serviceName.toUpperCase())}
              </figure>
            </div>
          ) : (
            <div className={classes.flex}>
              <span className={classes.label}>
                {getPaymentTypeLabel(method?.service?.serviceName.toUpperCase())}
              </span>
              <figure className={classes.icon}>
                {getPaymentIcon(method?.service?.serviceName.toUpperCase())}
              </figure>
            </div>
          )}
        </div>
      ))}
      {hasCRDF && coloradoRetailDeliveryFee && enableCRDF && (
        <div className={classes.coloradoRetailDeliveryFee}>
          * Retail Delivery Fee Excluded: Colorado imposes a Retail Delivery Fee of $
          {coloradoRetailDeliveryFee + ' '}
          per order on the delivery of taxable items. This fee will only be included when the whole
          order is refunded.
        </div>
      )}
    </div>
  );
};

PaymentList.propTypes = {
  label: PropTypes.string,
  value: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      paymentReferenceId: PropTypes.string,
      card: PropTypes.shape({
        accountNumber: PropTypes.string,
        type: PropTypes.string,
      }),
    }),
  ),
};

export default PaymentList;
