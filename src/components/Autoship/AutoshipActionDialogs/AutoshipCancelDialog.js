import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import _keyBy from 'lodash/keyBy';
import { useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { BaseDialog } from '@components/Base';
import useSubscriptions from '@/hooks/useSubscriptions';
import cn from 'classnames';

const useStyles = makeStyles((theme) => ({
  root: {},
  form: {
    display: 'grid',
    flexDirection: 'row',
    gridTemplateColumns: '325px 300px',
    columnGap: '30px',
  },
  formControl1: {
    marginTop: theme.spacing(1),
  },
  formControlLabel1: {
    marginTop: theme.spacing(1),
  },
  formControl2: {
    marginTop: theme.spacing(1),
    '& .MuiInputLabel-asterisk': {
      color: 'red',
    },
  },
  formControlLabel2: {
    marginTop: theme.spacing(1),
  },
  dialogTitle: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.white,
    fontSize: 20,
  },
  dialogContentTitle: {
    color: theme.palette.primary.main,
  },
  dialogContent: {
    marginBottom: theme.utils.fromPx(20),
    '& .MuiDialog-paperWidthSm': {
      maxWidth: 'none',
      maxHeight: '90%',
    },
    '& .MuiDialogContent-root': {
      padding: '8px 10px',
    },
  },
  cancelForm: {
    '& .MuiDialog-paperWidthSm': {
      minHeight: '60%',
    },
  },
  dialog: {
    marginBottom: theme.utils.fromPx(20),
  },
}));

const ReasonCodes = Object.freeze({
  // make this a 'true const' by freezing it
  OTHER: 'ETC',
});

const AutoshipCancelDialog = ({
  id,
  name,
  customerId,
  cancelReasons = [],
  isOpen,
  openDialog,
  postInteraction,
}) => {
  const { cancelSubscription } = useSubscriptions();

  const cancellationReasonOptions = useMemo(
    () => cancelReasons.filter((reason) => reason?.is_support),
    [cancelReasons],
  );

  const classes = useStyles();

  const [newDescription, setNewDescription] = useState(null);

  const [newCancellationReason, setNewCancellationReason] = useState('NON');

  const [showConfirmation, setShowConfirmation] = useState(false);

  const pageName = 'Autoship Cancel Dialog - VT';

  const keyedCancelDescriptions = useMemo(() => {
    if (cancellationReasonOptions) {
      return _keyBy(cancellationReasonOptions, 'code');
    }

    return {};
  }, [cancellationReasonOptions]);

  const captureInteraction = useCallback(() => {
    const data = {
      name: name,
      subscriptionId: id,
      cancel_reason: 'ETC',
      cancel_comment: `Subscription was canceled due to ${
        newDescription || keyedCancelDescriptions['ETC']
      }`,
    };
    postInteraction('AUTOSHIP_CANCELLED', data, 'UPDATE');
  }, [postInteraction, name, id, newDescription, keyedCancelDescriptions]);

  const handleCancelSubmit = useCallback(
    (code, description = null) => {
      cancelSubscription(
        {
          subscriptionId: id,
          customerId: customerId,
          data: {
            subscriptionId: id,
            cancel_reason: code,
            cancel_comment: `Subscription was canceled due to ${
              description || keyedCancelDescriptions[code]
            }`,
          },
        },
        captureInteraction,
      );

      openDialog(false);
    },
    [cancelSubscription, customerId, keyedCancelDescriptions, id, openDialog],
  );

  const handleClose = () => {
    openDialog(false);
    setShowConfirmation(false);
    setNewDescription('');
    setNewCancellationReason('NON');
  };

  return isOpen ? (
    <BaseDialog
      data-testid="autoship-cancel"
      open={isOpen}
      onClose={handleClose}
      closeLabel="Cancel"
      okLabel={showConfirmation ? 'Confirm' : 'Next'}
      pageName={pageName}
      onOk={() =>
        showConfirmation ? handleCancelSubmit('ETC', newDescription) : setShowConfirmation(true)
      }
      dialogTitle={
        <Typography variant="h5" data-testid="autoship-cancel:title">
          {showConfirmation ? 'Confirm Cancellation' : 'Cancel Autoship'}
        </Typography>
      }
      contentClassName={cn(classes.dialogContent, !showConfirmation ? classes.cancelForm : '')}
    >
      {showConfirmation ? (
        <div data-testid={`autoship-cancel:confirmation:${id}`}>
          Confirm cancellation of Austoship ID #
          <span>
            <b>{id}</b>
          </span>
          ?
        </div>
      ) : (
        <form>
          <Typography variant="h6" className={classes.dialogContentTitle}>
            Select Cancellation Reason
          </Typography>
          <div className={classes.form}>
            <FormControl
              data-testid="auotship-cancel:reasons"
              variant="outlined"
              className={classes.formControl1}
            >
              <InputLabel shrink>Cancellation Reason</InputLabel>
              <Select
                className={classes.cancellationReasons}
                required
                MenuProps={{
                  anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'left',
                  },
                  transformOrigin: {
                    vertical: 'top',
                    horizontal: 'left',
                  },
                  getContentAnchorEl: null,
                }}
                value={newCancellationReason}
                onChange={(event) => setNewCancellationReason(event.target.value)}
                data-testid="change-cancellation-reason"
                input={<OutlinedInput notched label="Cancellation Reason" />}
              >
                {cancellationReasonOptions?.map(({ id, code, description }) => (
                  <MenuItem data-testid={`cancel-reason-option:${code}`} key={id} value={code}>
                    {description}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {newCancellationReason === ReasonCodes.OTHER && (
              <FormControl className={classes.formControl2}>
                <TextField
                  multiline
                  variant="outlined"
                  label="Details"
                  placeholder="Optional"
                  value={newDescription}
                  name="cancelReasonComments"
                  type="text"
                  onChange={(event) => setNewDescription(event.target.value)}
                  inputProps={{ maxLength: 100 }}
                />
              </FormControl>
            )}
          </div>
        </form>
      )}
    </BaseDialog>
  ) : null;
};
AutoshipCancelDialog.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  customerId: PropTypes.string,
  cancelReasons: PropTypes.array,
  isOpen: PropTypes.bool,
  openDialog: PropTypes.func,
  postInteraction: PropTypes.func,
};
export default AutoshipCancelDialog;
