import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import { FormControl, MenuItem, TextareaAutosize, TextField } from '@mui/material';
import useAgentInteractions from '@/hooks/useAgentInteractions';
import { useSWRConfig } from 'swr';
import useOrderBlockReasons from '@/hooks/useOrderBlockReasons';
import { SNACKVARIANTS } from '@/components/SnackMessage/SnackMessage';
import useCreateOrderBlock from '@/hooks/useCreateOrderBlock';
import BaseDialog from '@/components/Base/BaseDialog';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiDialogActions-root': {
      padding: `${theme.utils.fromPx(16)} ${theme.utils.fromPx(28)} ${theme.utils.fromPx(
        16,
      )} ${theme.utils.fromPx(28)}`,
      backgroundColor: theme.palette.gray[375],
    },
    '& .MuiDialog-paperWidthSm': {
      width: `${theme.utils.fromPx(450)}`,
      height: `${theme.utils.fromPx(430)} !important`,
    },
    '& .MuiButtonBase-root': {
      height: `${theme.utils.fromPx(42)}`,
      width: `${theme.utils.fromPx(96)}`,
    },
    '& .MuiInputBase-inputMultiline': {
      height: `${theme.utils.fromPx(50)}`,
    },
  },
  rootNoErrors: {
    '& .MuiDialogActions-root': {
      padding: `${theme.utils.fromPx(16)} ${theme.utils.fromPx(28)} ${theme.utils.fromPx(
        16,
      )} ${theme.utils.fromPx(28)}`,
      backgroundColor: theme.palette.gray[375],
    },
    '& .MuiDialog-paperWidthSm': {
      width: `${theme.utils.fromPx(450)}`,
      height: `${theme.utils.fromPx(330)} !important`,
    },
    '& .MuiButtonBase-root': {
      height: `${theme.utils.fromPx(42)}`,
      width: `${theme.utils.fromPx(96)}`,
    },
    '& .MuiInputBase-inputMultiline': {
      height: `${theme.utils.fromPx(50)}`,
    },
  },
  title: {
    ...theme.fonts.h3,
    color: theme.palette.blue.dark,
    fontWeight: '500',
    paddingLeft: `${theme.utils.fromPx(28)}`,
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
    color: theme.palette.blue.dark,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  formControl: {
    width: `100%`,
    '& .MuiInputBase-root': {
      height: `${theme.utils.fromPx(56)}`,
    },
  },
  formControl2: {
    width: `100%`,
    '& .MuiFormLabel-root': {
      marginLeft: `${theme.utils.fromPx(0)} !important`,
    },
    '& .MuiFormControl-root': {
      height: `${theme.utils.fromPx(68)}`,
    },
  },
  textArea: {
    '& .MuiFormControl-root': {
      height: `${theme.utils.fromPx(68)}`,
    },
  },
  formContainer: {
    display: 'grid',
    gap: `${theme.utils.fromPx(24)}`,
  },
}));

const BlockOrderDialog = ({ blockOrderDialogOpen, setParentClose, orderNumber }) => {
  const classes = useStyles();

  const [orderBlockReason, setOrderBlockReason] = useState('');

  const [dialogOpen, setDialogOpen] = useState(blockOrderDialogOpen);

  const [disableBlockOrder, setDisableBlockOrder] = useState(true);

  const [blockComment, setBlockComment] = useState('');

  const [loading, setLoading] = useState(false);

  const { createOrderBlock } = useCreateOrderBlock();

  const { data: orderBlockReasons, error: blockReasonsError } = useOrderBlockReasons();

  const { enqueueSnackbar } = useSnackbar();

  const { captureInteraction } = useAgentInteractions();

  const { mutate } = useSWRConfig();

  const pageName = 'Create Block Dialog - VT';

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
    setParentClose();
  }, [setDialogOpen, setParentClose]);

  const handleChange = (event) => {
    setOrderBlockReason(event.target.value);
    setDisableBlockOrder(false);
  };

  const handleBlockComment = (event) => {
    setBlockComment(event.target.value);
  };

  const revalidateOrderData = () => {
    Promise.all([
      mutate(`/api/v3/order-activities/${orderNumber}`),
      mutate('/cs-platform/v1/orderDetailsGraphql'),
      mutate(`/api/v1/orders/${orderNumber}/allowable-actions`),
    ]);
  };

  const submitOrderBlock = useCallback(() => {
    setLoading(true);
    const body = {
      comments: blockComment,
      reason: orderBlockReason,
    };
    createOrderBlock({ orderId: orderNumber, body: body })
      .then(() => {
        captureInteraction({
          type: 'ADDED_BLOCK',
          subjectId: orderNumber,
          action: 'CREATE',
          currentVal: body,
          prevVal: {},
        });
      })
      .then(() => {
        revalidateOrderData();
        setLoading(false);
        handleDialogClose();
        enqueueSnackbar({
          messageHeader: 'Success!',
          variant: SNACKVARIANTS.SUCCESS,
          messageSubheader: `${orderBlockReason} block created`,
          persist: false,
        });
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar({
          messageHeader: 'Error',
          messageSubheader: 'Unable to block order',
          persist: false,
          variant: SNACKVARIANTS.ERROR,
        });
      });
  }, [
    enqueueSnackbar,
    setLoading,
    handleDialogClose,
    orderBlockReason,
    blockComment,
    orderNumber,
    createOrderBlock,
  ]);

  return (
    <BaseDialog
      data-testid={`order:block-dialog-${orderNumber}`}
      contentClassName={!blockReasonsError ? classes.rootNoErrors : classes.root}
      open={dialogOpen}
      dialogTitle={<span className={classes.title}>Blocks</span>}
      onOk={submitOrderBlock}
      okLabel="Save"
      onClose={handleDialogClose}
      disableOkBtn={disableBlockOrder || loading}
      showCloseButton={false}
      greyTitleBackground={true}
      requestInFlight={loading}
      pageName={pageName}
    >
      <form className={classes.form}>
        <div className={classes.formContainer}>
          {blockReasonsError && (
            <span className={classes.reasonError}>
              Problem fetching order block reasons, please close and reopen this dialog or reach out
              to engineering if the problem continues
            </span>
          )}
          <FormControl required className={classes.formControl}>
            <TextField
              select
              data-testid={`order:block-reason-${orderNumber}`}
              variant="outlined"
              id="demo-simple-select-autowidth"
              value={orderBlockReason}
              onChange={handleChange}
              label="Block Reason"
            >
              {orderBlockReasons?.map((reason) => (
                <MenuItem
                  value={reason.name}
                  key={reason.name}
                  data-testid={`order:block-menu-item-${reason.name}`}
                >
                  {`${reason.id ? reason.id + ' -' : ''} ${reason.displayName}`}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <FormControl className={classes.formControl2}>
            <TextareaAutosize
              className={classes.textArea}
              variant="outlined"
              id="comments-input"
              aria-label="Comments"
              label="Comments"
              minRows={3}
              onChange={handleBlockComment}
              data-testid={`order:block-comment-${orderNumber}`}
              placeholder="Comments"
              inputProps={{ maxLength: 100 }}
            />
          </FormControl>
        </div>
      </form>
    </BaseDialog>
  );
};

BlockOrderDialog.propTypes = {
  blockOrderDialogOpen: PropTypes.bool.isRequired,
  setParentClose: PropTypes.func.isRequired,
  orderNumber: PropTypes.string.isRequired,
};

export default BlockOrderDialog;
