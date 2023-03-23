import PropTypes from 'prop-types';
import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import Button from '@components/Button';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import cn from 'classnames';
import { SlideUpTransition } from '@/utils/transitions';
import { useEffect, useState } from 'react';
import * as blueTriangle from '@utils/blueTriangle';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme) => ({
  dialogContainer: {
    height: 'unset',
  },
  controlContainer: {
    display: 'flex',
  },
  leftControls: {
    marginRight: '4px',
  },
  dialogTitle: {
    padding: theme.utils.fromPx(24),
    '&.primaryBackground': {
      background: '#031657',
      color: 'white',
    },
    '&.greyTitleBackground': {
      background: 'rgba(145, 145, 145, 0.2)',
    },
  },
  dialogInnerTitle: {
    alignContent: 'center',
    display: 'grid',
    fontWeight: 500,
    paddingRight: theme.utils.fromPx(100),
  },
  closeButton: {
    '&.closeButtonPrimary': {
      color: theme.palette.white,
    },
    alignItems: 'start',
  },
  okButton: {
    backgroundColor: '#1C49C2',
    color: theme.palette.white,
    marginRight: '-12px',
  },
  dialogContentTitle: {
    marginBottom: theme.utils.fromPx(1),
  },
  subTitle: {
    marginBottom: theme.utils.fromPx(-4),
  },
  subTitl2: {
    marginBottom: theme.utils.fromPx(-4),
  },
  dialogContent: {
    fontSize: theme.utils.fromPx(16),
    padding: `${theme.utils.fromPx(24)} !important`,
  },
  dialogActions: {
    padding: `${theme.utils.fromPx(12)} ${theme.utils.fromPx(24)} !important`,
    borderTop: '1px solid lightgrey',
    '& .MuiButtonBase-root': {
      minWidth: theme.utils.fromPx(87),
      marginRight: 0,
    },
  },
  closeButtonAction: {
    color: theme.palette.blue.chewyBrand,
    border: `${theme.utils.fromPx(2)} solid ${theme.palette.blue.chewyBrand}`,
    marginRight: '-12px',
  },
  closeIcon: {
    color: 'black',
  },
  childrenContainer: {
    width: '100%',
    height: '100%',
  },
}));

export const CLOSE_BUTTONS = {
  X: 'X',
  OUTSIDE_DIALOG: 'OUTSIDE_DIALOG',
  CANCEL_BUTTON: 'CANCEL_BUTTON',
};

const BaseDialog = ({
  open,
  onClose,
  closeLabel,
  onOk,
  okLabel,
  dialogTitle,
  children,
  hideOutSideClick=false,
  hideCloseIcon = false,
  hideButtonPanel = false,
  contentClassName,
  dialogInnerTitleClassName,
  disableOkBtn = false,
  requestInFlight = false,
  primary = false,
  greyTitleBackground = false,
  maxWidth,
  fullWidth,
  fullHeight,
  showCloseButton = true,
  pageName = 'Base Dialog - VT',
  dialogQueryParam,
  ...props
}) => {
  const classes = useStyles();

  const router = useRouter();

  const [localOpen, setLocalOpen] = useState(open);

  useEffect(() => {
    if (open && dialogQueryParam) {
      router.query.activeDialog = dialogQueryParam;
      router.push(router, null, { shallow: true });
    }
  }, [open]);

  useEffect(() => {
    blueTriangle.start(pageName);

    return () => {
      blueTriangle.end(pageName);
    };
  }, []);

  const removeQueryParams = () => {
    const query = { ...router.query };

    if (query.activeDialog) {
      delete query.activeDialog;
      router.push({ query }, null, { shallow: true });
    }
  };

  const handleOnOKClick = () => {
    removeQueryParams();
    setTimeout(() => {
      onOk();
    }, 300);
  };

  const handleOnCloseClick = (buttonPressed) => {
    setLocalOpen(false);
    removeQueryParams();
    setTimeout(() => {
      onClose(buttonPressed);
    }, 300);
  };

  return (
    <Dialog
      open={localOpen}
      onClose={() => !hideOutSideClick && handleOnCloseClick(CLOSE_BUTTONS.OUTSIDE_DIALOG)}
      classes={{ container: cn(classes.dialogContainer, contentClassName) }}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      data-testid={props['data-testid']}
      TransitionComponent={SlideUpTransition}
      sx={{
        '& .MuiDialog-paper': {
          height: fullHeight ? '-webkit-fill-available' : 'auto',
        },
      }}
    >
      <DialogTitle
        className={cn(
          classes.dialogTitle,
          primary && 'primaryBackground',
          greyTitleBackground && 'greyTitleBackground',
        )}
      >
        <Box display="flex" justifyContent="space-between">
          <div className={cn(classes.dialogInnerTitle, dialogInnerTitleClassName)}>
            {dialogTitle}
          </div>
          {!hideCloseIcon && (
            <IconButton
              data-testid="close-dialog"
              color="secondary"
              aria-label="close"
              className={cn(classes.closeButton, primary && 'closeButtonPrimary')}
              onClick={() => handleOnCloseClick(CLOSE_BUTTONS.X)}
              size="small"
            >
              <CloseIcon className={classes.closeIcon} />
            </IconButton>
          )}
        </Box>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <div className={classes.childrenContainer}>{children}</div>
      </DialogContent>
      {!hideButtonPanel && (
        <DialogActions className={classes.dialogActions}>
          {showCloseButton && (
            <Button
              onClick={() => handleOnCloseClick(CLOSE_BUTTONS.CANCEL_BUTTON)}
              className={classes.closeButtonAction}
              data-testid="base-dialog-close-button"
            >
              {closeLabel}
            </Button>
          )}
          <Button
            onClick={handleOnOKClick}
            disabled={disableOkBtn || requestInFlight}
            solid
            primary="true"
            data-testid="base-dialog-ok-button"
            sx={{ backgroundColor: '#1C49C2' }}
          >
            {requestInFlight ? (
              <CircularProgress
                size={24}
                sx={{ float: 'right', color: '#1C49C2' }}
                color="primary"
              />
            ) : (
              <span>{okLabel}</span>
            )}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

BaseDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onOk: PropTypes.func,
  closeLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  okLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  dialogTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  hideButtonPanel: PropTypes.bool,
  hideOutSideClick:PropTypes.bool,
  hideCloseIcon: PropTypes.bool,
  contentClassName: PropTypes.string,
  dialogInnerTitleClassName: PropTypes.string,
  primary: PropTypes.bool,
  disableOkBtn: PropTypes.bool,
  greyTitleBackground: PropTypes.bool,
  maxWidth: PropTypes.string,
  fullWidth: PropTypes.bool,
  requestInFlight: PropTypes.bool,
  'data-testid': PropTypes.string,
  fullHeight: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  pageName: PropTypes.string,
  dialogQueryParam: PropTypes.string,
};

export default BaseDialog;
