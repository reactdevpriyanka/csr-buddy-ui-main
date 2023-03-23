import PropTypes from 'prop-types';
import { BaseDialog } from '@components/Base';
import Button from '@components/Button';
import { makeStyles, Typography } from '@material-ui/core';
import useEnactment from '@/hooks/useEnactment';
import { useCallback } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {},
  modifyRescheduleTitle: {},
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
    marginBottom: theme.spacing(2),
  },
  dialogTitle: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.white,
    fontSize: 20,
  },
  btnSfwLogin: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.white,
    minWidth: '20px',
    width: '70px',
    display: 'inline-block',
  },
  btnSfwAutoship: {
    minWidth: '40px',
    width: '185px',
    display: 'inline-block',
  },
  buttonPanel: {
    display: 'inline-block',
    textAlign: 'right',
    marginTop: '20px',
  },
}));

const AutoshipModifyDialog = ({ id, isOpen, openDialog }) => {
  const classes = useStyles();
  const { openEnactmentLogin, openEnactmentPage } = useEnactment();

  const onLogin = useCallback(() => openEnactmentLogin(), [openEnactmentLogin]);

  const pageName = 'Autoship Modify Dialog - VT';

  const onChangeSubscription = useCallback(
    (id) => {
      openEnactmentPage(`/app/subs/manager/view/${id}`);
    },
    [openEnactmentPage],
  );

  const handleClose = () => {
    openDialog(false);
  };

  return isOpen ? (
    <BaseDialog
      hideButtonPanel={true}
      open={isOpen}
      onClose={handleClose}
      pageName={pageName}
      dialogTitle={<Typography variant="h6">Change Subscription</Typography>}
    >
      <form className={classes.form}>
        <div className={classes.modifyRescheduleTitle}>
          Change subscriptions is done by logging into storefront via Customer Enactment.
        </div>
        <div className={classes.buttonPanel}>
          <Button
            solid
            primary
            data-testid="swf-login"
            className={classes.btnSfwLogin}
            onClick={onLogin}
          >
            Login
          </Button>
          <Button
            data-testid="swf-subscription"
            className={classes.btnSfwAutoship}
            onClick={onChangeSubscription.bind(this, id)}
          >
            Change Subscription
          </Button>
        </div>
      </form>
    </BaseDialog>
  ) : null;
};

AutoshipModifyDialog.propTypes = {
  id: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  openDialog: PropTypes.func.isRequired,
};

export default AutoshipModifyDialog;
