import { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from '@mui/material';
import useAthena from '@/hooks/useAthena';
import BaseDialog from '../Base/BaseDialog';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiDialog-paper': {
      width: '500px !important',
    },
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  title: {
    ...theme.fonts.h3,
    color: theme.palette.blue.dark,
    fontWeight: '500',
    paddingLeft: `${theme.utils.fromPx(28)}`,
  },
  text: {
    color: '#121212',
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: theme.utils.fromPx(23),
    fontSize: theme.utils.fromPx(20),
    marginBottom: `${theme.utils.fromPx(24)}`,
  },
  password: {
    width: '100%',
  },

  validationPassword: {
    width: '100%',
  },
}));

const ChangePasswordDialog = ({ onOk, isOpen, onClose }) => {
  const classes = useStyles();
  const { getLang } = useAthena();
  const [isInvalidPassword, setIsInvalidPassword] = useState(true);
  const [password, setPassword] = useState('');
  const [validatedPassword, setValidatedPassword] = useState('');
  const [showValidatedPasswordError, setShowValidatedPasswordError] = useState(false);

  const pageName = 'Change Password Dialog - VT';

  const handleDialogClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleOnOk = useCallback(() => {
    onOk(password);
  }, [onOk, password]);

  const validatePassword = () => {
    const result = (password || '').length < 5 || validatedPassword !== password;
    setIsInvalidPassword(result);
    setShowValidatedPasswordError(validatedPassword !== password && (password || '').length > 5);
  };

  useEffect(() => {
    validatePassword();
  }, [validatePassword, password, validatedPassword]);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleValidatePasswordChange = (event) => {
    setValidatedPassword(event.target.value);
  };

  return (
    <BaseDialog
      open={isOpen}
      onClose={handleDialogClose}
      onOk={handleOnOk}
      hideCloseIcon={true}
      disableOkBtn={isInvalidPassword}
      contentClassName={classes.root}
      pageName={pageName}
      closeLabel={getLang('findUserApp_close', { fallback: 'Close' })}
      data-testid="passwordResetDialog"
      dialogTitle={getLang('findUserApp_resetPassword', { fallback: 'Change Password' })}
      okLabel={getLang('findUserApp_ok', { fallback: 'Ok' })}
    >
      <div className={classes.content}>
        <TextField
          className={classes.password}
          required
          variant="outlined"
          label="New Password"
          value={password}
          type="password"
          data-testid="change-password-password-field"
          onChange={handlePasswordChange}
          placeholder={getLang('findUserApp_newPassword', { fallback: 'New Password' })}
        />

        <TextField
          helperText={
            showValidatedPasswordError
              ? getLang('findUserApp_validationPassword', { fallback: 'Passwords must match' })
              : ''
          }
          error={showValidatedPasswordError}
          className={classes.validationPassword}
          required
          variant="outlined"
          label="Validate Password"
          value={validatedPassword}
          type="password"
          data-testid="change-password-validated-password-field"
          onChange={handleValidatePasswordChange}
          placeholder={getLang('findUserApp_validatedPassword', { fallback: 'Validate Password' })}
        />
      </div>
    </BaseDialog>
  );
};

ChangePasswordDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
};

export default ChangePasswordDialog;
