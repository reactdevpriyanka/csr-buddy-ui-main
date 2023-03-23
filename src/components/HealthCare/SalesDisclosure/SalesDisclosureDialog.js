import BaseDialog from '@/components/Base/BaseDialog';
import { makeStyles } from '@material-ui/core';
import { Box, Tab, Tabs } from '@mui/material';
import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import cn from 'classnames';
import useHealthcareConsent from '@/hooks/useHealthcareConsent';
import { SNACKVARIANTS } from '@/components/SnackMessage/SnackMessage';
import { useSnackbar } from 'notistack';
import PetConsentScript from './PetConsentScript/PetConsentScript';
import PetConsentSelection from './PetConsentSelection/PetConsentSelection';

const useStyles = makeStyles((theme) => ({
  tab: {
    color: '#121212',
    textTransform: 'none',
    fontSize: theme.utils.fromPx(14),
    fontWeight: '400',
    lineHeight: '1rem',
  },
  activeTab: {
    color: '#1C49C2',
  },
  indicator: {
    backgroundColor: '#1C49C2 !important',
  },
  scriptContainer: {
    overflowY: 'auto',
    whiteSpace: 'pre-line',
    maxHeight: theme.utils.fromPx(250),
    lineHeight: theme.utils.fromPx(18.75),
  },
}));

export const TABS = {
  LEMONADE: 'lemonade',
  TRUPANION: 'trupanion',
};

const SalesDisclosureDialog = ({ pets = [], open, onClose }) => {
  const classes = useStyles();

  const [selectedTab, setSelectedTab] = useState(TABS.LEMONADE);

  const [selectedPet, setSelectedPet] = useState();

  const [requestInFlight, setRequestInFlight] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const { captureSalesDisclosure } = useHealthcareConsent();

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleSubmit = useCallback(() => {
    setRequestInFlight(true);
    captureSalesDisclosure({
      disclosure: true,
      petId: selectedPet,
    })
      .then(() => onClose(true))
      .catch(() => {
        enqueueSnackbar(
          {
            variant: SNACKVARIANTS.ERROR,
            messageHeader: 'Failed to save this sales disclosure for audit purposes',
          },
          { preventDuplicate: true },
        );
        onClose();
      })
      .finally(() => setRequestInFlight(false));
  }, [captureSalesDisclosure, onClose]);

  return (
    <BaseDialog
      requestInFlight={requestInFlight}
      dialogQueryParam="salesDisclosure"
      okLabel="Agree"
      onOk={handleSubmit}
      disableOkBtn={!selectedPet || selectedPet?.length === 0}
      closeLabel="Disagree"
      onClose={onClose}
      open={open}
      dialogTitle="Sales Disclosure Script"
    >
      <div>
        <Box
          sx={{
            margin: '0rem -1.5rem',
            borderTop: 1,
            borderColor: 'divider',
            marginTop: '-1.5rem',
          }}
        >
          <Tabs
            classes={{ indicator: classes.indicator }}
            value={selectedTab}
            onChange={handleTabChange}
            variant="fullWidth"
          >
            <Tab
              data-testid="tab-lemonade"
              id="tab-lemonade"
              aria-controls="tabpanel-lemonade"
              value={TABS.LEMONADE}
              label={
                <span
                  className={cn(classes.tab, selectedTab === TABS.LEMONADE && classes.activeTab)}
                >
                  Lemonade Quote Consent
                </span>
              }
            />
            <Tab
              data-testid="tab-trupanion"
              id="tab-trupanion"
              aria-controls="tabpanel-trupanion"
              value={TABS.TRUPANION}
              label={
                <span
                  className={cn(classes.tab, selectedTab === TABS.TRUPANION && classes.activeTab)}
                >
                  Trupanion Quote Consent
                </span>
              }
            />
          </Tabs>
        </Box>
        <div className={classes.scriptContainer}>
          <PetConsentSelection
            pets={pets}
            vendor={selectedTab}
            selectedPet={selectedPet}
            setSelectedPet={setSelectedPet}
          />
          <PetConsentScript
            vendor={selectedTab}
            selectedPetName={pets?.find((pet) => pet?.id.toString() === selectedPet)?.name}
          />
        </div>
      </div>
    </BaseDialog>
  );
};

SalesDisclosureDialog.propTypes = {
  pets: PropTypes.arrayOf(PropTypes.object),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SalesDisclosureDialog;
