import { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import PropTypes from 'prop-types';
import CloseIcon from '@icons/close.svg';
import { makeStyles } from '@material-ui/core';
import useEventHistory from '@/hooks/useEventHistory';
import { SlideUpTransition } from '@/utils/transitions';
import * as blueTriangle from '@utils/blueTriangle';
import Badge from '../Badge/Badge';
import EventHistoryTable from './EventHistoryTable';

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
    paddingLeft: theme.utils.fromPx(8),
  },
  orderNumber: {
    paddingRight: theme.utils.fromPx(8),
  },
}));

const EventHistoryDialog = ({ orderNumber, status, open, onClose }) => {
  const classes = useStyles();

  const [isDialogOpen, setIsDialogOpen] = useState(open);

  const { data: eventHistory, error } = useEventHistory(orderNumber);

  const pageName = 'Event History Dialog - VT';

  useEffect(() => {
    blueTriangle.start(pageName);

    return () => {
      blueTriangle.end(pageName);
    };
  }, []);

  const handleClose = () => {
    setIsDialogOpen(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const trimStatus = (status) => {
    if (status.includes('-')) {
      return status.split('-')?.[1];
    }
    return status;
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
      aria-describedby="event-history-dialog"
      sx={{ pt: 4 }}
    >
      <DialogTitle sx={{ pb: 3, pt: 3 }}>
        <div className={classes.titleRow}>
          <span data-testid="order-number" className={classes.orderNumber}>
            Order #{orderNumber}
          </span>
          <Badge title={status} clickable={false} />
          <IconButton
            classes={{ root: classes.closeIcon }}
            aria-label="close"
            onClick={handleClose}
            data-testid="event-history-close-button"
          >
            <CloseIcon />
          </IconButton>
          {error && (
            <span className={classes.errorMessage}>
              An error has occured loading the event history for this order
            </span>
          )}
        </div>
        <div className={classes.subTitle}>{trimStatus(status)}</div>
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <EventHistoryTable events={eventHistory} />
      </DialogContent>
    </Dialog>
  );
};

EventHistoryDialog.propTypes = {
  orderNumber: PropTypes.number,
  status: PropTypes.string,
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default EventHistoryDialog;
