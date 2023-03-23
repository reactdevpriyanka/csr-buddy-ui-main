import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { currencyFormatter } from '@/utils/string';
import useFeature from '@/features/useFeature';
import TooltipPrimary from '@/components/TooltipPrimary';
import AutoshipAdjustmentDetails from './AutoshipAdjustmentDetails';
import { getNameValue } from './AutoshipViewDetailsDialogHelper';

const useStyles = makeStyles((theme) => ({
  nameValue: {
    display: 'grid',
    gridTemplateColumns: '50% 50%',
    width: '100%',
  },
  displayName: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontStyle: 'medium',
    fontSize: theme.utils.fromPx(14),
    lineHeight: theme.utils.fromPx(18),
    color: '#666666',
  },
  displayValue: {
    textAlign: 'end',
    marginRight: theme.utils.fromPx(15),
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontStyle: 'bold',
    fontSize: theme.utils.fromPx(16),
    lineHeight: theme.utils.fromPx(19),
    color: '#333333',
  },
}));

const AutoshipSubTotals = ({
  subscriptionData = {},
  expand = false,
  autoshipTotals = {},
  coloradoRetailDeliveryFee,
}) => {
  const classes = useStyles();
  const enableCRDF = useFeature('feature.explorer.coloradoRetailDeliveryFeeEnabled');

  // TODO: This is only here until the backend sends us the calculated value
  // We are only doing this until the promotions data is populated
  // as part of the autoship subscription data.
  // Until then we will coalate the data from the individual items

  return (
    <div data-testid="autoship:payment:viewdetails:subtotals">
      {getNameValue(
        'totalProduct',
        'Item(s) Subtotal:',
        currencyFormatter(subscriptionData?.totalProduct?.value),
        classes,
      )}
      {getNameValue(
        'totalShipping',
        'Shipping:',
        currencyFormatter(subscriptionData?.totalShipping?.value),
        classes,
      )}
      <AutoshipAdjustmentDetails
        expand={expand}
        disableAdjustments={(subscriptionData?.promotions || []).length === 0}
        promotions={subscriptionData?.promotions}
        subscriptionData={subscriptionData}
        adjustmentTotal={currencyFormatter(subscriptionData?.totalAdjustment?.value)}
      />
      {getNameValue(
        'totalBeforeTax',
        'Total Before Tax:',
        currencyFormatter(subscriptionData?.totalBeforeTax?.value),
        classes,
      )}
      {getNameValue(
        'totalTax',
        'Taxes:',
        currencyFormatter(subscriptionData?.totalTax?.value),
        classes,
      )}
      {enableCRDF && coloradoRetailDeliveryFee && (
        <TooltipPrimary title="Colorado imposes a Retail Delivery Fee of $0.27 per order on the delivery of taxable items.">
          {getNameValue(
            'coloradoRetailDeliveryFee',
            'Colorado Retail Delivery Fee:',
            currencyFormatter(coloradoRetailDeliveryFee),
            classes,
          )}
        </TooltipPrimary>
      )}
      {getNameValue(
        'totalOrder',
        'Grand Total:',
        currencyFormatter(subscriptionData?.total?.value),
        classes,
      )}
    </div>
  );
};

AutoshipSubTotals.propTypes = {
  subscriptionData: PropTypes.object,
  autoshipTotals: PropTypes.object,
  expand: PropTypes.bool,
  coloradoRetailDeliveryFee: PropTypes.string,
};

export default AutoshipSubTotals;
