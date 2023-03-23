import BaseDialog from '@/components/Base/BaseDialog';
import { SNACKVARIANTS } from '@/components/SnackMessage/SnackMessage';
import { DIALOGS } from '@/constants/dialogs';
import useAthena from '@/hooks/useAthena';
import useHealthcareConsent from '@/hooks/useHealthcareConsent';
import { makeStyles } from '@material-ui/core';
import { Divider } from '@mui/material';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';

const useStyles = makeStyles((theme) => ({
  scriptContainer: {
    paddingTop: '1rem',
    overflowY: 'auto',
    whiteSpace: 'pre-line',
    maxHeight: theme.utils.fromPx(250),
    lineHeight: theme.utils.fromPx(18.75),
  },
}));

const QuoteConsentDialog = ({ open, onClose }) => {
  const classes = useStyles();

  const [requestInFlight, setRequestInFlight] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const { captureQuoteConsent } = useHealthcareConsent();

  const { getLang } = useAthena();

  const consentScript = getLang('consentDisclosureScript');

  const handleSubmit = useCallback(() => {
    setRequestInFlight(true);
    captureQuoteConsent({ consent: true })
      .then(() => onClose(true))
      .catch(() => {
        enqueueSnackbar(
          {
            variant: SNACKVARIANTS.ERROR,
            messageHeader: 'Failed to save this quote consent disclosure for audit purposes',
          },
          { preventDuplicate: true },
        );
        onClose();
      })
      .finally(() => setRequestInFlight(false));
  }, [captureQuoteConsent, enqueueSnackbar, onClose]);

  return (
    <BaseDialog
      requestInFlight={requestInFlight}
      data-testid="quote-consent-dialog"
      dialogQueryParam={DIALOGS.QUOTE_CONSENT}
      okLabel="Agree"
      onOk={handleSubmit}
      closeLabel="Disagree"
      onClose={onClose}
      open={open}
      dialogTitle="Quote Consent Script"
    >
      <Divider sx={{ margin: '0rem -1.5rem', marginTop: '-1.5rem' }} />
      <div className={classes.scriptContainer}>{consentScript?.replace(/\n/g, '\n\n')}</div>
    </BaseDialog>
  );
};

QuoteConsentDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default QuoteConsentDialog;
