import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, FormLabel } from '@material-ui/core';
import { Card, Divider } from '@mui/material';
import cn from 'classnames';
import { currencyFormatter } from '@/utils/string';
import useOrderDetailsContext from '@/hooks/useOrderDetailsContext';
import TooltipPrimary from '@/components/TooltipPrimary';
import { useMemo } from 'react';
import useAthena from '@/hooks/useAthena';
import OrderAdjustmentDetails from './OrderAdjustmentDetails';

const useStyles = makeStyles((theme) => ({
  root: {
    '& li:first-of-type': {
      whiteSpace: 'nowrap',
    },
  },
  orderDetailContent: {
    padding: theme.utils.fromPx(16),
  },
  title: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: theme.utils.fromPx(16),
    paddingBottom: theme.utils.fromPx(12),
    color: theme.palette.blue.dark,
  },
  orderDetailHeader: {
    display: 'inline-flex',
  },
  detail: {
    '&:not(:last-child)': {
      marginBottom: `${theme.utils.fromPx(10)}`,
    },
  },
  value: {
    height: theme.utils.fromPx(20),
    paddingBottom: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
    color: '#333333',
    fontWeight: '400',
  },
  right: {
    float: 'right',
  },
  label: {
    fontSize: theme.utils.fromPx(14),
    lineHeight: theme.utils.fromPx(21),
    color: '#666666',
    fontWeight: 700,
  },
  grandTotal: {
    paddingTop: theme.utils.fromPx(8),
  },
  coloradoRetailDeliveryFee: {
    textDecoration: 'underline',
  },
  crdfTooltip: {
    display: 'inline',
  },
}));

const OrderDetailsOrderTotal = ({ expand = false }) => {
  const classes = useStyles();

  const { getLang } = useAthena(); // athena config

  const {
    total = {},
    totalProduct = {},
    totalAdjustment = {},
    totalBeforeTax = {},
    totalSalesTax = {},
    totalShipping = {},
    promotions = [],
    orderFees = [],
  } = useOrderDetailsContext();

  const coloradoRetailDeliveryFee = useMemo(() => {
    const fee = orderFees.find(({ type }) => type === 'RDF_CO');
    return fee?.amount?.value;
  }, [orderFees]);

  return (
    <div data-testid="orderDetailsOrderTotal" className={classes.root}>
      <Card elevation={0}>
        <div className={classes.orderDetailContent}>
          <Typography className={classes.title} variant="h2">
            {getLang('orderTotals', { fallback: 'Order Totals' })}
          </Typography>
          <div className={cn(classes.detail)}>
            <span>
              <FormLabel
                component="label"
                data-testid="order-itemSubtotal-label"
                className={cn(classes.label)}
              >
                {getLang('orderItemsSubtotal', { fallback: 'Item(s) Subtotal:' })}
              </FormLabel>
            </span>
            <span className={classes.right}>
              <FormLabel
                component="label"
                data-testid="order-itemSubtotal-value"
                className={cn(classes.value)}
              >
                {currencyFormatter(totalProduct?.value)}
              </FormLabel>
            </span>
          </div>
          <div className={cn(classes.detail)}>
            <FormLabel component="label" data-testid="order:adjustmentApplied-label">
              <OrderAdjustmentDetails
                expand={expand}
                disableAdjustments={promotions?.length === 0}
                promotions={promotions}
                adjustmentTotal={currencyFormatter(totalAdjustment?.value)}
              />
            </FormLabel>
          </div>
          <div className={cn(classes.detail)}>
            <span>
              <FormLabel
                component="label"
                data-testid="order:shipping-label"
                className={cn(classes.label)}
              >
                {getLang('orderShipping', { fallback: 'Shipping:' })}
              </FormLabel>
            </span>
            <span className={classes.right}>
              <FormLabel
                component="label"
                data-testid="order:shipping-value"
                className={cn(classes.value)}
              >
                {currencyFormatter(totalShipping?.value ? totalShipping?.value : '0.00')}
              </FormLabel>
            </span>
          </div>
          <div className={cn(classes.detail)}>
            <span>
              <FormLabel
                component="label"
                data-testid="order:beforeTax-label"
                className={cn(classes.label)}
              >
                {getLang('orderTaxBeforeTax', { fallback: 'Total Before Tax:' })}
              </FormLabel>
            </span>
            <span className={classes.right}>
              <FormLabel
                component="label"
                data-testid="order:beforeTax-value"
                className={cn(classes.value)}
              >
                {currencyFormatter(totalBeforeTax?.value)}
              </FormLabel>
            </span>
          </div>
          <div className={cn(classes.detail)}>
            <span>
              <FormLabel
                component="label"
                data-testid="order:salesTax-label"
                className={cn(classes.label)}
              >
                {getLang('orderSalesTax', { fallback: 'Sales Tax:' })}
              </FormLabel>
            </span>
            <span className={classes.right}>
              <FormLabel
                component="label"
                data-testid="order:salesTax-value"
                className={cn(classes.value)}
              >
                {currencyFormatter(totalSalesTax.value)}
              </FormLabel>
            </span>
          </div>
          {coloradoRetailDeliveryFee && (
            <div className={cn(classes.detail)}>
              <TooltipPrimary
                placement="top"
                title={`Colorado imposes a Retail Delivery Fee of ${currencyFormatter(
                  coloradoRetailDeliveryFee,
                )} per order on the delivery of taxable items`}
                arrow
                className={classes.crdfTooltip}
              >
                <span>
                  <FormLabel
                    component="label"
                    data-testid="order:colorado-retail-delivery-fee-label"
                    className={cn(classes.label, classes.coloradoRetailDeliveryFee)}
                  >
                    {getLang('orderColoradoDeliveryFee', {
                      fallback: 'Colorado Retail Delivery Fee:',
                    })}
                  </FormLabel>
                </span>
              </TooltipPrimary>

              <span className={classes.right}>
                <FormLabel
                  component="label"
                  data-testid="order:salesTax-value"
                  className={cn(classes.value)}
                >
                  {currencyFormatter(coloradoRetailDeliveryFee)}
                </FormLabel>
              </span>
            </div>
          )}
          <Divider sx={{ color: '#94A7C4' }} />
          <div className={cn(classes.detail, classes.grandTotal)}>
            <span>
              <FormLabel
                component="label"
                data-testid="order:grandTotal-label"
                className={cn(classes.label)}
              >
                {getLang('orderGrandTotal', { fallback: 'Grand Total:' })}
              </FormLabel>
            </span>
            <span className={classes.right}>
              <FormLabel
                component="label"
                data-testid="order:grandTotal-value"
                className={cn(classes.value)}
              >
                {currencyFormatter(total.value)}
              </FormLabel>
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

OrderDetailsOrderTotal.propTypes = {
  expand: PropTypes.bool,
};

export default OrderDetailsOrderTotal;
