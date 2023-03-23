import { useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import { BaseDialog } from '@components/Base';
import useReturnDetails from '@/hooks/useReturnDetails';
import { useSnackbar } from 'notistack';
import { SNACKVARIANTS } from '@/components/SnackMessage/SnackMessage';
import useAgentInteractions from '@/hooks/useAgentInteractions';
import useCancelReturn from '@/hooks/useCancelReturn';
import useAthena from '@/hooks/useAthena';

const useStyles = makeStyles((theme) => ({
  root: {},
  baseDialog: {
    '& .MuiDialogTitle-root': {
      padding: '1rem 1.75rem',
      backgroundColor: theme.palette.gray[375],
    },
    '& .MuiDialogActions-root': {
      backgroundColor: theme.palette.gray[375],
      fontFamily: 'Roboto',
      fontStyle: 'normal',
      fontWeight: '700',
      fontSize: '16px',
      lineHeight: '20px',
    },
    '& .MuiPaper-root': {
      width: '582px',
      height: '222px',
    },
    '& .MuiDialogContent-root': {
      fontFamily: 'Roboto',
      fontStyle: 'normal',
      fontWeight: '400',
      fontSize: '20px',
      lineHeight: '23px',
    },
  },
  dialogTitle: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: '20px',
    lineHeight: '25px',
    letterSpacing: '1%',
    color: '#031657',
  },
}));

const CancelReturnDialog = ({ isOpen = false, openDialog, returnId, orderId }) => {
  const classes = useStyles();
  const { getLang } = useAthena();
  const { cancelReturn } = useCancelReturn();
  const { enqueueSnackbar } = useSnackbar();

  const { mutate } = useReturnDetails();

  const { captureInteraction } = useAgentInteractions();

  const pageName = 'Cancel Return Dialog - VT';

  const handleClose = useCallback((event) => {
    openDialog(false);
  }, []);

  const handleCancelReturn = useCallback(() => {
    openDialog(false);
    cancelReturn({ returnId })
      .then(() =>
        captureInteraction({
          type: 'CANCELLED_RETURN',
          subjectId: orderId,
          action: 'UPDATE',
          currentVal: { returnId: returnId },
          prevVal: {},
        }),
      )
      .then(() => {
        mutate();
        enqueueSnackbar({
          messageHeader: 'Success',
          variant: SNACKVARIANTS.SUCCESS,
          messageSubheader: `Return canceled`,
        });
      })
      .catch(() => {
        enqueueSnackbar({
          messageHeader: 'Error',
          variant: SNACKVARIANTS.ERROR,
          messageSubheader: `Failed to cancel return.`,
        });
      });
  }, [mutate]);

  return isOpen ? (
    <BaseDialog
      data-testid="cancel-return-dialog"
      contentClassName={classes.baseDialog}
      dialogTitle={
        <span className={classes.dialogTitle}>
          {getLang('confirmCancelText', { fallback: 'Confirm Cancel' })}
        </span>
      }
      open={isOpen}
      okLabel="Yes"
      onOk={handleCancelReturn}
      closeLabel="No"
      onClose={handleClose}
      pageName={pageName}
    >
      {getLang('cancelReturnAlertText', {
        fallback: 'Are you sure you want to cancel the return?',
      })}
    </BaseDialog>
  ) : null;
};

CancelReturnDialog.propTypes = {
  isOpen: PropTypes.bool,
  openDialog: PropTypes.func.isRequired,
  returnId: PropTypes.string.isRequired,
  orderId: PropTypes.string,
};

export default CancelReturnDialog;
