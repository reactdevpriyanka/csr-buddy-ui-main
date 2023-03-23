import { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import useAthena from '@/hooks/useAthena';
import { SNACKVARIANTS } from '@components/SnackMessage/SnackMessage';
import useAgentInteractions from '@/hooks/useAgentInteractions';
import useOrderDetailsContext from '@/hooks/useOrderDetailsContext';
import ConfirmationDialog from './ConfirmationDialog';
import useFormStyles from './useFormStyles';

const parseAdjustmentAmount = (str) => Math.abs(Number.parseFloat(str));

export default function PriceAdjustmentDialog({ isOpen, openDialog, orderNumber }) {
  const classes = useFormStyles();
  const { getLang } = useAthena();
  const { enqueueSnackbar } = useSnackbar();
  const [adjustmentAmount, setAdjustmentAmount] = useState('');
  const [formattedAmount, setFormattedAmount] = useState('');
  const [overrideShipping, setOverrideShipping] = useState(false);
  const { captureInteraction } = useAgentInteractions();
  const [priceAdjustmentInFlight, setPriceAdjustmentInFlight] = useState(false);
  const { revalidateOrderDetails } = useOrderDetailsContext();

  const pageName = 'Price Adjustment Dialog - VT';

  useEffect(() => {
    const formatted = parseAdjustmentAmount(adjustmentAmount).toFixed(2);
    setFormattedAmount(formatted);
  }, [adjustmentAmount]);

  const strings = useMemo(
    () => ({
      confirmText: getLang('confirmAddAdjustmentText', {
        substitutions: [formattedAmount],
        fallback: `Are you sure you want to apply adjustment $${formattedAmount}?`,
      }),

      successSubheader: getLang('addAdjustmentSuccessText', {
        substitutions: [formattedAmount],
        fallback: `$${formattedAmount} adjustment applied`,
      }),

      errorSubheader: getLang('addAdjustmentErrorText', {
        substitutions: [formattedAmount],
        fallback: `Failed to add $${formattedAmount} adjustment`,
      }),
    }),
    [formattedAmount, getLang],
  );

  const handleSubmit = useCallback(() => {
    setPriceAdjustmentInFlight(true);

    const payload = { discountAdjustmentAmount: null, shippingAdjustmentAmount: null };
    if (overrideShipping) {
      payload.shippingAdjustmentAmount = formattedAmount;
    } else {
      payload.discountAdjustmentAmount = `-${formattedAmount}`;
    }

    axios
      .post(`/api/v1/orders/${orderNumber}/adjustment`, payload)
      .then(() => {
        captureInteraction({
          type: 'ADJUSTED_PRICE',
          subjectId: orderNumber,
          action: 'UPDATE',
          currentVal: payload,
          prevVal: {},
        });
        return revalidateOrderDetails();
      })
      .then(() => {
        enqueueSnackbar({
          messageHeader: getLang('successTitle', { fallback: 'Success!' }),
          messageSubheader: strings.successSubheader,
          variant: SNACKVARIANTS.SUCCESS,
        });
      })
      .catch(() => {
        enqueueSnackbar({
          messageHeader: getLang('errorTitle', { fallback: 'Error!' }),
          messageSubheader: strings.errorSubheader,
          variant: SNACKVARIANTS.ERROR,
        });
      })
      .finally(() => {
        setPriceAdjustmentInFlight(false);
        openDialog(false);
      });
  }, [
    enqueueSnackbar,
    formattedAmount,
    getLang,
    openDialog,
    orderNumber,
    overrideShipping,
    strings,
  ]);

  const handleClose = useCallback(() => {
    openDialog(false);
    setAdjustmentAmount('');
  }, [openDialog]);

  const disableOkBtn = useMemo(
    () => !adjustmentAmount || parseAdjustmentAmount(adjustmentAmount) === 0,
    [adjustmentAmount],
  );

  return (
    isOpen && (
      <ConfirmationDialog
        confirmText={strings.confirmText}
        data-testid="order:add-adjustment-dialog"
        dialogTitle={getLang('addAnAdjustmentTitle', { fallback: 'Add an Adjustment' })}
        disableOkBtn={disableOkBtn || priceAdjustmentInFlight}
        isOpen={isOpen}
        okLabel={getLang('addAdjustmentLabel', { fallback: 'Add adjustment' })}
        onClose={handleClose}
        onSubmit={handleSubmit}
        priceAdjustmentInFlight={priceAdjustmentInFlight}
        pageName={pageName}
      >
        <>
          <TextField
            className={classes.textField}
            data-testid="order:add-adjustment-dialog:text-field"
            fullWidth
            helperText={getLang('addAdjustmentHelpText', {
              fallback:
                'Price adjustment is calculated before tax and shipping have been applied, but after any discounts (such as promotions) to the order',
            })}
            label={getLang('adjustmentAmountLabel', { fallback: 'Adjustment amount' })}
            name="adjustmentAmount"
            onChange={(event) => setAdjustmentAmount(event.target.value)}
            placeholder={getLang('adjustmentPlaceholderText', { fallback: '$00.00' })}
            type="number"
            InputProps={{
              inputProps: { min: 0 },
            }}
            value={adjustmentAmount}
            variant="outlined"
          />
          <FormControlLabel
            className={classes.checkboxLabel}
            control={
              <Checkbox
                data-testid="order:add-adjustment-dialog:checkbox"
                checked={overrideShipping}
                onChange={(event) => setOverrideShipping(event.target.checked)}
              />
            }
            label={getLang('overrideShippingChargeLabel', { fallback: 'Override shipping charge' })}
          />
        </>
      </ConfirmationDialog>
    )
  );
}

PriceAdjustmentDialog.propTypes = {
  isOpen: PropTypes.bool,
  openDialog: PropTypes.func.isRequired,
  orderNumber: PropTypes.string.isRequired,
};
