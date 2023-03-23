import { useState, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  TextField,
} from '@material-ui/core';
import { titleCaseToSnakeCase } from '@/utils/string';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@icons/close.svg';
import IconButton from '@material-ui/core/IconButton';
import useOrderActionReasons from '@/hooks/useOrderActionReasons';
import useAgentInteractions from '@/hooks/useAgentInteractions';
import { useSWRConfig } from 'swr';
import * as blueTriangle from '@utils/blueTriangle';
import useAthena from '@/hooks/useAthena';
import useOrder from '@/hooks/useOrder';
import { SNACKVARIANTS } from '../SnackMessage/SnackMessage';
import { ORDER_CANCEL_REASONS as fallbackCancelReasons } from './utils';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiDialogActions-root': {
      padding: `${theme.utils.fromPx(8)} ${theme.utils.fromPx(24)} ${theme.utils.fromPx(
        24,
      )} ${theme.utils.fromPx(24)}`,
    },
  },
  title: {
    ...theme.fonts.h3,
    color: theme.palette.blue.dark,
    fontWeight: '500',
  },
  reasonError: {
    color: 'red',
  },
  loadingSpinner: {
    marginLeft: `${theme.utils.fromPx(8)}`,
  },
  closeIcon: {
    float: 'right',
    padding: '0px',
  },
}));

const CancelOrderDialog = ({ cancelOrderDialogOpen, setParentClose, orderNumber }) => {
  const classes = useStyles();
  const { getLang } = useAthena(); // athena config
  const [orderCancelReason, setOrderCancelReason] = useState('');

  const [dialogOpen, setDialogOpen] = useState(cancelOrderDialogOpen);

  const [disableCancelOrder, setDisableCancelOrder] = useState(true);

  const [skipNotification, setSkipNotification] = useState(false);

  const [cancelComment, setCancelComment] = useState('');

  const [loading, setLoading] = useState(false);

  const { cancelOrder } = useOrder();

  const pageName = 'Cancel Return Dialog - VT';

  useEffect(() => {
    blueTriangle.start(pageName);

    return () => {
      blueTriangle.end(pageName);
    };
  }, []);

  const { data: orderCancelReasons, error: cancelReasonsError } = useOrderActionReasons();

  const finalOrderCancelReasons = useMemo(() => {
    return orderCancelReasons?.length > 0 ? orderCancelReasons : fallbackCancelReasons;
  }, [orderCancelReasons, fallbackCancelReasons]);

  const { enqueueSnackbar } = useSnackbar();

  const { captureInteraction } = useAgentInteractions();

  const { mutate } = useSWRConfig();

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
    setParentClose();
  }, [setDialogOpen, setParentClose]);

  const handleChange = (event) => {
    setOrderCancelReason(event.target.value);
    setDisableCancelOrder(false);
  };

  const handleCancelComment = (event) => {
    setCancelComment(event.target.value);
  };

  const revalidateOrderData = () => {
    Promise.all([
      mutate(`/api/v3/order-activities/${orderNumber}`),
      mutate('/cs-platform/v1/orderDetailsGraphql'),
      mutate(`/api/v1/orders/${orderNumber}/allowable-actions`),
    ]);
  };

  const submitOrderCancel = useCallback(() => {
    setLoading(true);
    const body = {
      skipNotification: !skipNotification,
      orderId: orderNumber,
      comments: cancelComment,
      cancelReason: titleCaseToSnakeCase(orderCancelReason),
    };

    cancelOrder(body)
      .then(() => {
        captureInteraction({
          type: 'CANCELLED_ORDER',
          subjectId: orderNumber,
          action: 'UPDATE',
          currentVal: body,
          prevVal: {},
        });
      })
      .then(() => {
        revalidateOrderData();
        setLoading(false);
        handleDialogClose();
        enqueueSnackbar({
          messageHeader: 'Success',
          variant: SNACKVARIANTS.SUCCESS,
          messageSubheader: `Cancelled order #${orderNumber}`,
          persist: false,
        });
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar({
          messageHeader: 'Error',
          messageSubheader: 'Unable to cancel order',
          persist: false,
          variant: SNACKVARIANTS.ERROR,
        });
      });
  }, [
    enqueueSnackbar,
    setLoading,
    handleDialogClose,
    skipNotification,
    orderCancelReason,
    cancelComment,
    orderNumber,
    cancelOrder,
  ]);

  return (
    <Dialog
      className={classes.root}
      open={dialogOpen}
      onClose={handleDialogClose}
      data-testid={`order:cancel-dialog-${orderNumber}`}
      fullWidth
    >
      <DialogTitle className={classes.title}>
        {getLang('returnCancelOrder', { fallback: 'Cancel Order' })}
        <IconButton className={classes.closeIcon} aria-label="close" onClick={setParentClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.dialogForm}>
        <form>
          {cancelReasonsError && (
            <span className={classes.reasonError}>
              Problem fetching order cancellation reasons, please close and reopen this dialog or
              reach out to engineering if the problem continues
            </span>
          )}
          <FormControl margin="normal" required fullWidth>
            <>
              <TextField
                select
                required
                data-testid={`order:cancel-reason-${orderNumber}`}
                variant="outlined"
                id="demo-simple-select-autowidth"
                value={orderCancelReason}
                onChange={handleChange}
                label="Order Cancel Reason"
              >
                {finalOrderCancelReasons?.map((reason) => (
                  <MenuItem
                    value={reason.label}
                    key={reason.label}
                    data-testid={`order:cancel-menu-item-${reason.label}`}
                  >
                    {reason.label}
                  </MenuItem>
                ))}
              </TextField>
              <FormHelperText>{getLang('returnRequired', { fallback: 'required' })}</FormHelperText>
            </>
          </FormControl>
          <FormControl margin="normal" fullWidth>
            <TextField
              variant="outlined"
              id="comments-input"
              inputProps={{ 'data-testid': `order:cancel-comment-input-${orderNumber}` }}
              label="Comments"
              multiline
              rows={6}
              onChange={handleCancelComment}
              data-testid={`order:cancel-comment-${orderNumber}`}
            />
          </FormControl>
          <FormControlLabel
            control={<Checkbox />}
            label="Notify shopper (comments will not be sent)"
            labelPlacement="end"
            onChange={() => setSkipNotification(!skipNotification)}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={disableCancelOrder || loading}
          color="primary"
          variant="contained"
          onClick={submitOrderCancel}
          data-testid={`order:confirm-cancel-button-${orderNumber}`}
        >
          {getLang('returnCancelOrder', { fallback: 'Cancel Order' })}{' '}
          {loading && (
            <CircularProgress className={classes.loadingSpinner} size={20} color="secondary" />
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

CancelOrderDialog.propTypes = {
  cancelOrderDialogOpen: PropTypes.bool.isRequired,
  setParentClose: PropTypes.func.isRequired,
  orderNumber: PropTypes.string.isRequired,
};

export default CancelOrderDialog;
