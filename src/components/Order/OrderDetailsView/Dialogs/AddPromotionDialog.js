import { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import useAthena from '@/hooks/useAthena';
import { SNACKVARIANTS } from '@components/SnackMessage/SnackMessage';
import useAgentInteractions from '@/hooks/useAgentInteractions';
import useOrder from '@/hooks/useOrder';
import useOrderDetailsContext from '@/hooks/useOrderDetailsContext';
import ConfirmationDialog from './ConfirmationDialog';
import useFormStyles from './useFormStyles';

export default function AddPromotionDialog({ isOpen, openDialog, orderNumber }) {
  const classes = useFormStyles();
  const { getLang } = useAthena();
  const { enqueueSnackbar } = useSnackbar();
  const [promoCode, setPromoCode] = useState('');
  const { captureInteraction } = useAgentInteractions();
  const { mutate } = useOrder();
  const [inFlightRequest, setInFlightRequest] = useState(false);
  const { revalidateOrderDetails } = useOrderDetailsContext();

  const pageName = 'Add Promotion Dialog - VT';

  const strings = useMemo(
    () => ({
      confirmText: getLang('confirmAddPromotionText', {
        substitutions: [promoCode],
        fallback: `Are you sure you want to add promotion ${promoCode} to the order?`,
      }),

      successSubheader: getLang('addPromotionSuccessText', {
        substitutions: [promoCode],
        fallback: `${promoCode} promotion was added to the order`,
      }),

      errorSubheader: getLang('addPromotionErrorText', {
        substitutions: [promoCode],
        fallback: `Failed to add ${promoCode} promotion to the order`,
      }),
    }),
    [getLang, promoCode],
  );

  const handleSubmit = useCallback(() => {
    setInFlightRequest(true);
    const data = { promoCode };
    axios
      .post(`/api/v1/orders/${orderNumber}/edit/promotioncode`, data)
      .then(() => {
        captureInteraction({
          type: 'ADDED_PROMOTION',
          subjectId: orderNumber,
          action: 'CREATE',
          currentVal: data,
          prevVal: {},
        });

        return revalidateOrderDetails();
      })
      .then(() => {
        mutate();
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
        setInFlightRequest(false);
        openDialog(false);
      });
  }, [enqueueSnackbar, getLang, openDialog, orderNumber, promoCode, strings, mutate]);

  const handleClose = useCallback(() => {
    openDialog(false);
    setPromoCode('');
  }, [openDialog]);

  return (
    isOpen && (
      <ConfirmationDialog
        confirmText={strings.confirmText}
        data-testid="order:add-promotion-dialog"
        dialogTitle={getLang('addAPromotionTitle', { fallback: 'Add a Promotion' })}
        disableOkBtn={!promoCode || inFlightRequest}
        inFlightRequest={inFlightRequest}
        isOpen={isOpen}
        okLabel={getLang('addPromotionLabel', { fallback: 'Add promotion' })}
        onClose={handleClose}
        onSubmit={handleSubmit}
        pageName={pageName}
      >
        <TextField
          className={classes.textField}
          data-testid="order:add-promotion-dialog:text-field"
          fullWidth
          label={getLang('promotionCodeLabel', { fallback: 'Promotion code' })}
          name="promoCode"
          onChange={(event) => setPromoCode(event.target.value)}
          placeholder={getLang('promotionCodeLabel', { fallback: 'Promotion code' })}
          value={promoCode}
          variant="outlined"
        />
      </ConfirmationDialog>
    )
  );
}

AddPromotionDialog.propTypes = {
  isOpen: PropTypes.bool,
  openDialog: PropTypes.func.isRequired,
  orderNumber: PropTypes.string.isRequired,
};
