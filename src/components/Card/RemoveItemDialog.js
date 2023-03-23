import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import * as blueTriangle from '@utils/blueTriangle';

const useStyles = makeStyles((theme) => ({
  root: {
    width: theme.utils.fromPx(400),
  },
  title: {
    '& h2': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  },
  content: {
    fontSize: theme.fonts.size.md,
  },
  confirmButton: {
    minWidth: theme.utils.fromPx(96),
  },
}));

const RemoveItemDialog = ({ productTitle, orderNumber, lineItemId, onClose, onConfirm, show }) => {
  const classes = useStyles();

  const [deleteItemInFlight, setDeleteItemInFlight] = useState(false);

  const pageName = 'Remove Item Dialog - VT';

  useEffect(() => {
    blueTriangle.start(pageName);

    return () => {
      blueTriangle.end(pageName);
    };
  }, []);

  const handleConfirm = () => {
    setDeleteItemInFlight(true);
    onConfirm();
  };

  return (
    <Dialog open={show} onClose={onClose} aria-labelledby="Remove Item Modal">
      <div className={classes.root}>
        <DialogTitle className={classes.title}>
          <span> Remove Item</span>
          <IconButton aria-label="close" color="primary" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.content}>
          Remove {productTitle} from order <b>#{orderNumber}</b>?
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="primary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirm}
            data-testid="product:confirm-remove"
            className={classes.confirmButton}
            disabled={deleteItemInFlight}
          >
            {deleteItemInFlight ? (
              <CircularProgress size={24} sx={{ color: '#1C49C2' }} color="primary" />
            ) : (
              <span>Confirm</span>
            )}
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default RemoveItemDialog;

RemoveItemDialog.propTypes = {
  productTitle: PropTypes.string.isRequired,
  orderNumber: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  show: PropTypes.bool,
  lineItemId: PropTypes.string,
};
