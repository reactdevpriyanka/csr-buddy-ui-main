import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import { useState, useEffect, useCallback } from 'react';
import Button from '@components/Button';
import { useRouter } from 'next/router';
import { DIALOGS } from '@/constants/dialogs';
import { Checkbox, Divider } from '@mui/material';
import { closeConsentDialog } from '../utils';
import SalesDisclosureDialog from './SalesDisclosureDialog';

const useStyles = makeStyles((theme) => ({
  root: {},
  disclosureButton: {
    color: '#1C49C2',
    backgroundColor: 'transparent',
    transition: 'all 0.2s',
    textTransform: 'none',
    alignSelf: 'flex-end',
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '700',
    border: 'none !important',
    textDecoration: 'none',
    cursor: 'pointer',
    '&[disabled]': {
      color: '#666666',
      textDecoration: 'none',
      backgroundColor: 'transparent',
      border: 'none',
    },
    '&:active': {
      textDecoration: 'underline',
      color: '#1C49C2',
      backgroundColor: 'transparent',
      border: 'none',
    },
    '&:hover': {
      textDecoration: 'underline',
      backgroundColor: 'transparent',
    },
  },
  disabledText: {
    ...theme.utils.disabled,
  },
  consentRow: {
    paddingTop: theme.utils.fromPx(6),
  },
}));

const SalesDisclosure = ({ pets = [] }) => {
  const classes = useStyles();

  const router = useRouter();

  const [dialogOpen, setDialogOpen] = useState(false);

  const [consentGiven, setConsentGiven] = useState(false);

  const openSalesConsentDialog = useCallback(() => {
    setDialogOpen(true);
  }, [setDialogOpen]);

  useEffect(() => {
    if (router?.query?.activeDialog === DIALOGS.SALES_DISCLOSURE) {
      setDialogOpen(true);
    }
  }, [router]);

  return (
    <div>
      <span data-testid="sales-disclosure:description">
        Sales consent is required to purchase insurance plan
      </span>
      <Button
        className={classes.disclosureButton}
        onClick={openSalesConsentDialog}
        data-testid="sales-disclosure:open-script-btn"
      >
        Sales Disclosure Script
      </Button>
      <div className={classes.disabledText}>
        <Checkbox
          disabled={true}
          checked={consentGiven}
          data-testid="sales-disclosure:checkbox"
          sx={{
            paddingLeft: '0rem',
            '&.Mui-checked': { color: '#1C49C2' },
          }}
        />
        <span>Customer gives consent</span>
      </div>
      <Divider sx={{ marginTop: '0.75rem', marginBottom: '1.5rem' }} />
      {dialogOpen && (
        <SalesDisclosureDialog
          pets={pets}
          open={dialogOpen}
          onClose={(response) => closeConsentDialog(response, setConsentGiven, setDialogOpen)}
        />
      )}
    </div>
  );
};

SalesDisclosure.propTypes = {
  pets: PropTypes.arrayOf(PropTypes.object),
};

export default SalesDisclosure;
