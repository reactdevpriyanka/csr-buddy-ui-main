import { useCallback } from 'react';
import { Typography } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { BaseDialog } from '@components/Base';
import useCustomer from '@/hooks/useCustomer';
import { FeatureFlag } from '@/features';
import useAgentInteractions from '@/hooks/useAgentInteractions';
import PropTypes from 'prop-types';
import { SNACKVARIANTS } from '@components/SnackMessage/SnackMessage';
import useResetPassword from '@/hooks/useResetPassword';

const ResetPasswordModal = ({ isOpen, setOpenDialog }) => {
  const { resetPassword } = useResetPassword();
  const { captureInteraction } = useAgentInteractions();

  const { enqueueSnackbar } = useSnackbar();

  const { data: customer } = useCustomer();

  const pageName = 'Reset Password Modal - VT';

  const handleSnack = useCallback(() => {
    enqueueSnackbar({
      variant: SNACKVARIANTS.SUCCESS,
      messageHeader: 'Success!',
      messageSubheader: 'Reset link has been sent.',
    });
  }, [enqueueSnackbar]);

  const handleError = useCallback(() => {
    enqueueSnackbar({
      variant: SNACKVARIANTS.ERROR,
      messageHeader: 'Error!',
      messageSubheader: 'There was a problem sending that reset link.',
    });
  }, [enqueueSnackbar]);

  const postInteraction = useCallback(() => {
    captureInteraction({
      type: 'ACCOUNT_PASSWORD_RESET',
      action: 'UPDATE',
      currentVal: null,
      prevVal: null,
    });
  }, [captureInteraction]);

  const off = () => {
    setOpenDialog(false);
  };
  return isOpen ? (
    <FeatureFlag flag="feature.explorer.resetPasswordEnabled">
      <BaseDialog
        data-testid="reset-password-modal"
        dialogTitle={<Typography>{'Reset Password'}</Typography>}
        open={isOpen}
        onClose={off}
        pageName={pageName}
        onOk={() =>
          resetPassword({ logonId: customer?.email })
            .then(() => off())
            .then(() => handleSnack())
            .then(() => postInteraction())
            .catch(() => handleError())
        }
        okLabel="Ok"
        closeLabel="Cancel"
        primary
      >
        {`A password reset link will be sent to the customer email ${
          customer?.email ? '(' + customer.email + ')' : '(loading email)'
        }.
          Are you sure you want to send the link?`}
      </BaseDialog>
    </FeatureFlag>
  ) : null;
};

ResetPasswordModal.propTypes = {
  isOpen: PropTypes.bool,
  setOpenDialog: PropTypes.func,
};

export default ResetPasswordModal;
