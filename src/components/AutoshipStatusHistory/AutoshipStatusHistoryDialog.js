import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import PropTypes from 'prop-types';
import CloseIcon from '@icons/close.svg';
import { makeStyles } from '@material-ui/core';
import { useRouter } from 'next/router';
import useCSPlatform from '@/hooks/useCSPlatform';
import { SlideUpTransition } from '@/utils/transitions';
import * as blueTriangle from '@utils/blueTriangle';
import Badge from '../Badge/Badge';
import AutoshipStatusHistoryTable from './AutoshipStatusHistoryTable';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '90%',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    lineheight: theme.utils.fromPx(25),
    paddingTop: theme.utils.fromPx(6),
  },
  closeIcon: {
    position: 'absolute !important',
    color: 'black !important',
    top: theme.utils.fromPx(24),
    right: theme.utils.fromPx(16),
  },
  table: {},
  subTitle: {
    fontSize: theme.utils.fromPx(14),
    fontWeight: 400,
    color: '#4D4D4D',
  },
  errorMessage: {
    color: 'red',
  },
}));

const AutoshipStatusHistoryDialog = ({ subscriptionId, status, open, onClose }) => {
  const classes = useStyles();

  const [isDialogOpen, setIsDialogOpen] = useState(open);

  const router = useRouter();
  const customerId = router?.query?.id;
  const { useSubscriptionStatuses } = useCSPlatform();

  const pageName = 'Autoship Status History Dialog - VT';

  useEffect(() => {
    blueTriangle.start(pageName);

    return () => {
      blueTriangle.end(pageName);
    };
  }, []);

  // TODO: Will eventually need to call tier-b for this call
  const { data: autoshipHistory, error } = useSubscriptionStatuses({
    subscriptionId: subscriptionId,
    customerId: customerId,
  });

  const handleClose = () => {
    setIsDialogOpen(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <Dialog
      open={isDialogOpen}
      classes={{ paper: classes.root }}
      fullWidth
      maxWidth="lg"
      TransitionComponent={SlideUpTransition}
      keepMounted
      onClose={handleClose}
      aria-describedby="autoship-status-history-dialog"
      data-testid="autoship-status-history-dialog"
      sx={{ pt: 4 }}
    >
      <DialogTitle sx={{ pb: 3, pt: 3 }}>
        <div className={classes.titleRow}>
          <span data-testid="subscription-id">Recurring Order #{subscriptionId}</span>
          <Badge title={status} clickable={false} />
          <IconButton
            classes={{ root: classes.closeIcon }}
            aria-label="close"
            onClick={handleClose}
            data-testid="status-history-close-button"
          >
            <CloseIcon />
          </IconButton>
          {error && (
            <span className={classes.errorMessage}>
              An error has occured loading the status history for this order
            </span>
          )}
        </div>
        <div className={classes.subTitle}>{`Subscription: ${subscriptionId}`}</div>
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <AutoshipStatusHistoryTable statuses={autoshipHistory} />
      </DialogContent>
    </Dialog>
  );
};

AutoshipStatusHistoryDialog.propTypes = {
  subscriptionId: PropTypes.number,
  status: PropTypes.string,
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default AutoshipStatusHistoryDialog;
