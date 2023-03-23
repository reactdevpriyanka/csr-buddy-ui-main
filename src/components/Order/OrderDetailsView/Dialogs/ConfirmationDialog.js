import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import BaseDialog from '@/components/Base/BaseDialog';
import useAthena from '@/hooks/useAthena';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiDialogTitle-root': {
      padding: '16px 28px',
      backgroundColor: theme.palette.gray[375],
      '& > h2': {
        color: theme.palette.blue[800],
        fontFamily: 'Poppins, sans-serif',
        fontSize: '20px',
        lineHeight: '25px',
        '& button': {
          color: theme.palette.blue[800],
        },
      },
    },
    '& .MuiDialogContent-root': {
      width: '600px',
      padding: '32px 16px',
    },
    '& .MuiDialogActions-root': {
      padding: '16px 24px',
    },
  },
  dialogInnerTitle: {
    fontWeight: 600,
  },
}));

export default function ConfirmationDialog({
  children,
  closeLabel,
  confirmText,
  dialogTitle,
  disableOkBtn,
  isOpen = false,
  okLabel,
  onClose,
  onSubmit,
  inFlightRequest,
  pageName = 'Confirmation Dialog - VT',
  ...props
}) {
  const classes = useStyles();

  const { getLang } = useAthena();

  const [isConfirming, setIsConfirming] = useState(false);

  const strings = useMemo(
    () => ({
      closeLabel: isConfirming
        ? getLang('noText', { fallback: 'No' })
        : getLang('cancelText', { fallback: 'Cancel' }),

      dialogTitle: isConfirming
        ? getLang('confirmChangesTitle', { fallback: 'Confirm Changes' })
        : dialogTitle,

      okLabel: isConfirming ? getLang('yesText', { fallback: 'Yes' }) : okLabel,
    }),
    [closeLabel, dialogTitle, getLang, isConfirming, okLabel],
  );

  return (
    isOpen && (
      <BaseDialog
        closeLabel={strings.closeLabel}
        contentClassName={classes.root}
        data-testid={props['data-testid']}
        dialogTitle={strings.dialogTitle}
        dialogInnerTitleClassName={classes.dialogInnerTitle}
        disableOkBtn={disableOkBtn}
        requestInFlight={inFlightRequest}
        okLabel={strings.okLabel}
        onClose={onClose}
        onOk={isConfirming ? onSubmit : () => setIsConfirming(true)}
        open={!!isOpen}
        pageName={pageName}
      >
        {isConfirming ? <Typography>{confirmText}</Typography> : children}
      </BaseDialog>
    )
  );
}

ConfirmationDialog.propTypes = {
  children: PropTypes.node,
  closeLabel: PropTypes.node,
  confirmText: PropTypes.string,
  'data-testid': PropTypes.string,
  dialogTitle: PropTypes.node,
  disableOkBtn: PropTypes.bool,
  inFlightRequest: PropTypes.bool,
  isOpen: PropTypes.bool,
  okLabel: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  pageName: PropTypes.string,
};
