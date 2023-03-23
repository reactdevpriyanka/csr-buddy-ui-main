import PropTypes from 'prop-types';
import { CircularProgress, Typography } from '@mui/material';
import BaseDialog from '@/components/Base/BaseDialog';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { SNACKVARIANTS } from '@/components/SnackMessage/SnackMessage';
import useAgentInteractions from '@/hooks/useAgentInteractions';
import useAthena from '@/hooks/useAthena';
import useReturnDetails from '@/hooks/useReturnDetails';

const ResendLabelsDialog = ({ isOpen, handleClose, returnId, orderId }) => {
  const { getLang } = useAthena();

  const { enqueueSnackbar } = useSnackbar();

  const { resendReturnLabels } = useReturnDetails();

  const { captureInteraction } = useAgentInteractions();

  const [requestInProgress, setRequestInProgress] = useState(false);

  const pageName = 'Resend Labels Dialog - VT';

  const handleLabelSubmit = () => {
    setRequestInProgress(true);

    resendReturnLabels(returnId)
      .then(() =>
        captureInteraction({
          type: 'RESEND_RETURN_LABELS',
          subjectId: orderId,
          action: 'UPDATE',
          currentVal: null,
          prevVal: null,
        }),
      )
      .then(() => {
        enqueueSnackbar({
          messageHeader: 'Success',
          variant: SNACKVARIANTS.SUCCESS,
          messageSubheader: `Label(s) have been resent to customer`,
        });
        handleClose();
      })
      .catch(() => {
        enqueueSnackbar({
          messageHeader: 'Error',
          variant: SNACKVARIANTS.ERROR,
          messageSubheader: `Failed to resend labels to customer`,
        });
      })
      .finally(() => {
        setRequestInProgress(false);
      });
  };

  return (
    <BaseDialog
      open={isOpen}
      onClose={handleClose}
      closeLabel="No"
      pageName={pageName}
      okLabel={!requestInProgress ? 'Yes' : <CircularProgress size={26} sx={{ color: 'white ' }} />}
      onOk={handleLabelSubmit}
      greyTitleBackground
      maxWidth="sm"
      fullWidth={true}
      dialogTitle={
        <Typography sx={{ color: '#031657', fontSize: '20px' }} variant="h5">
          {getLang('resendLabelDialogHeaderText', { fallback: 'Confirm Resend Labels' })}
        </Typography>
      }
    >
      <Typography sx={{ color: '#031657', fontSize: '20px' }} variant="h5">
        {getLang('resendLabelDialogText', {
          fallback: 'Are you sure you want to resend label(s)?',
        })}
      </Typography>
    </BaseDialog>
  );
};

ResendLabelsDialog.propTypes = {
  isOpen: PropTypes.bool,
  handleClose: PropTypes.func,
  returnId: PropTypes.string,
  orderId: PropTypes.string,
};

export default ResendLabelsDialog;
