import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import { Typography } from '@material-ui/core';
import useResolveBlock from '@/hooks/useResolveBlock';
import { titleCaseToSnakeCase, snakeCaseToTitleCase } from '@/utils/string';
import { useSWRConfig } from 'swr';
import { SNACKVARIANTS } from '@/components/SnackMessage/SnackMessage';
import cn from 'classnames';
import { BaseDialog } from '@components/Base';
import useAgentInteractions from '@/hooks/useAgentInteractions';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiDialogActions-root': {
      padding: `${theme.utils.fromPx(16)} ${theme.utils.fromPx(28)} ${theme.utils.fromPx(
        16,
      )} ${theme.utils.fromPx(28)}`,
    },
    '& .MuiDialog-paperWidthSm': {
      maxWidth: `${theme.utils.fromPx(713)}`,
      height: `${theme.utils.fromPx(270)}`,
    },
    '& .MuiButtonBase-root': {
      height: `${theme.utils.fromPx(42)}`,
      width: `${theme.utils.fromPx(96)}`,
    },
    '& .MuiInputBase-inputMultiline': {
      height: `${theme.utils.fromPx(50)}`,
    },
    '& .MuiFormLabel-root': {
      marginLeft: `${theme.utils.fromPx(28)}`,
    },
  },
  title: {
    ...theme.fonts.h3,
    color: theme.palette.blue.dark,
    fontWeight: '500',
    paddingLeft: `${theme.utils.fromPx(28)}`,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: 'fit-content',
  },
  formText: {
    color: '#121212',
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: theme.utils.fromPx(23),
    fontSize: theme.utils.fromPx(20),
    marginBottom: `${theme.utils.fromPx(24)}`,
  },
}));

const ResolveBlockDialog = ({
  resolveBlockOrderDialogOpen,
  blockReason,
  blockId,
  blockComment,
  setParentClose,
  orderNumber,
}) => {
  const classes = useStyles();

  const [dialogOpen, setDialogOpen] = useState(resolveBlockOrderDialogOpen);

  const { enqueueSnackbar } = useSnackbar();

  const { mutate } = useSWRConfig();

  const { captureInteraction } = useAgentInteractions();

  const { resolveOrderBlock } = useResolveBlock(orderNumber);

  const pageName = 'Resolve Block Dialog - VT';

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
    setParentClose();
  }, [setDialogOpen, setParentClose]);

  const revalidateOrderData = () => {
    Promise.all([
      mutate(`/api/v3/order-activities/${orderNumber}`),
      mutate('/cs-platform/v1/orderDetailsGraphql'),
      mutate(`/api/v1/orders/${orderNumber}/allowable-actions`),
    ]);
  };

  const submitOrderBlock = useCallback(() => {
    const body = {
      blockId: blockId,
      reason: titleCaseToSnakeCase(blockReason),
      comments: blockComment,
    };
    resolveOrderBlock({ orderId: orderNumber, body })
      .then(() => {
        captureInteraction({
          type: 'RESOLVED_BLOCK',
          subjectId: orderNumber,
          action: 'UPDATE',
          currentVal: body,
          prevVal: {},
        });
      })
      .then(() => {
        revalidateOrderData();
        handleDialogClose();
        enqueueSnackbar({
          messageHeader: 'Success!',
          variant: SNACKVARIANTS.SUCCESS,
          messageSubheader: `Resolved order block ${snakeCaseToTitleCase(blockReason)}`,
          persist: false,
        });
      })
      .catch((error) => {
        enqueueSnackbar({
          messageHeader: 'Error',
          messageSubheader: 'Unable to resolve order',
          persist: false,
          variant: SNACKVARIANTS.ERROR,
        });
      });
  }, [enqueueSnackbar, revalidateOrderData, handleDialogClose, orderNumber, resolveOrderBlock]);

  return (
    <BaseDialog
      data-testid={`order:resolve-block-dialog-${orderNumber}`}
      open={dialogOpen}
      onClose={handleDialogClose}
      closeLabel="No"
      okLabel="Yes"
      onOk={submitOrderBlock}
      hideCloseIcon={true}
      dialogTitle={<Typography variant="h5">{`Confirm Resolve`}</Typography>}
      contentClassName={cn(classes.root)}
      pageName={pageName}
    >
      <form className={classes.form}>
        <div className={classes.formText}>
          {' '}
          Are you sure you want to resolve block:{' '}
          <span style={{ fontWeight: 'bold' }}>{snakeCaseToTitleCase(blockReason)}</span> ?
        </div>
      </form>
    </BaseDialog>
  );
};

ResolveBlockDialog.propTypes = {
  resolveBlockOrderDialogOpen: PropTypes.bool.isRequired,
  setParentClose: PropTypes.func.isRequired,
  orderNumber: PropTypes.string.isRequired,
  blockReason: PropTypes.string.isRequired,
  blockComment: PropTypes.string.isRequired,
  blockId: PropTypes.string.isRequired,
};

export default ResolveBlockDialog;
