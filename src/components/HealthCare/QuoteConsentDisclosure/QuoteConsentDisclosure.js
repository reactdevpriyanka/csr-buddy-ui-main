import { makeStyles } from '@material-ui/core';
import { Checkbox } from '@mui/material';
import Button from '@components/Button';
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { DIALOGS } from '@/constants/dialogs';
import useEnactment from '@/hooks/useEnactment';
import { CLOSE_BUTTONS } from '@/components/Base/BaseDialog';
import useHealthcareConsent from '@/hooks/useHealthcareConsent';
import { SNACKVARIANTS } from '@/components/SnackMessage/SnackMessage';
import { useSnackbar } from 'notistack';
import cn from 'classnames';
import { closeConsentDialog } from '../utils';
import QuoteConsentDialog from './QuoteConsentDialog';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: theme.utils.fromPx(12),
    marginTop: theme.utils.fromPx(-10),
  },
  quoteButton: {
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
  shopButton: {
    color: 'white',
    backgroundColor: '#1C49C2',
    marginLeft: '1.5rem',
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
      color: '#FFFFFF',
      backgroundColor: '#1C49C2',
    },
    '&:hover': {
      color: '#FFFFFF',
      backgroundColor: '#1C49C2',
    },
  },
  disabledText: {
    ...theme.utils.disabled,
  },
  consentRow: {
    paddingTop: theme.utils.fromPx(8),
  },
}));

const QuoteConsentDisclosure = () => {
  const classes = useStyles();

  const router = useRouter();

  const [dialogOpen, setDialogOpen] = useState(false);

  const [consentGiven, setConsentGiven] = useState(false);

  const { openEnactmentPage } = useEnactment();

  const { captureQuoteConsent, getLatestQuoteConsent } = useHealthcareConsent(true);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    getLatestQuoteConsent()
      .then((data) => {
        setConsentGiven(!!data?.consent);
      })
      .catch(() => setConsentGiven(false));
  }, []);

  useEffect(() => {
    if (router?.query?.activeDialog === DIALOGS.QUOTE_CONSENT) {
      setDialogOpen(true);
    }
  }, [router]);

  const openSalesConsentDialog = useCallback(() => {
    setDialogOpen(true);
  }, [setDialogOpen]);

  const shopForPlans = useCallback(() => {
    openEnactmentPage('/pet-insurance');
  }, [openEnactmentPage]);

  const handleCloseDialog = useCallback(
    (response) => {
      if (response === CLOSE_BUTTONS.CANCEL_BUTTON && consentGiven === true) {
        captureQuoteConsent({ consent: false })
          .then(() => closeConsentDialog(response, setConsentGiven, setDialogOpen))
          .catch(() => {
            enqueueSnackbar(
              {
                variant: SNACKVARIANTS.ERROR,
                messageHeader: 'Failed to save this quote consent disclosure for audit purposes',
              },
              { preventDuplicate: true },
            );
          });
      } else {
        closeConsentDialog(response, setConsentGiven, setDialogOpen);
      }
    },
    [captureQuoteConsent, closeConsentDialog, setConsentGiven, setDialogOpen],
  );

  return (
    <div className={classes.root}>
      <span data-testid="quote-disclosure:description">
        Quote consent is required to see insurance plan pricing
      </span>
      <Button
        className={classes.quoteButton}
        onClick={openSalesConsentDialog}
        data-testid="quote-disclosure:open-script-btn"
      >
        Quote Consent Script
      </Button>
      <div className={classes.consentRow}>
        <span className={classes.disabledText}>
          <span>
            <Checkbox
              disabled={true}
              checked={consentGiven}
              data-testid="quote-disclosure:checkbox"
              sx={{
                paddingLeft: '0rem',
                '&.Mui-checked': { color: '#1C49C2' },
              }}
            />
          </span>
          <span>Customer gives consent</span>
        </span>
        <span className={cn(!consentGiven && classes.disabledText)}>
          <Button
            onClick={shopForPlans}
            className={classes.shopButton}
            data-testid="quote-disclosure:shop-for-plans"
          >
            Shop Plans for Customer
          </Button>
        </span>
      </div>
      {dialogOpen && (
        <QuoteConsentDialog open={dialogOpen} onClose={(response) => handleCloseDialog(response)} />
      )}
    </div>
  );
};

QuoteConsentDisclosure.propTypes = {};

export default QuoteConsentDisclosure;
