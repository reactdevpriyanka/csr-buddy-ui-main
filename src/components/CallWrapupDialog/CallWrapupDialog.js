import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import Button from '@components/Button';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@components/TextField';
import SelectTree from '@components/SelectTree';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
// eslint-disable-next-line import/no-unresolved
import { useContactReasonCategories } from '@hooks/useContactReasonCategories';
// eslint-disable-next-line import/no-unresolved
import useOracle from '@hooks/useOracle';
// import useEnactment from '@/hooks/useEnactment';
import LabelSpecialNote from '@components/CallWrapupDialog/LabelSpecialNote';
import { Events } from '@components/OracleCommunicator';
import useCustomer from '@/hooks/useCustomer';
import useFeature from '@/features/useFeature';
import * as blueTriangle from '@utils/blueTriangle';

const useStyles = makeStyles((theme) => ({
  dialogContainer: {
    height: 'unset',
    minWidth: theme.utils.fromPx(500),
  },
  controlContainer: {
    display: 'flex',
  },
  leftControls: {
    marginRight: '8px',
  },
  dialogTitle: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.white,
  },
  closeButton: {
    color: theme.palette.white,
    marginRight: '-12px',
  },
  dialogContentTitle: {
    marginBottom: theme.utils.fromPx(16),
  },
  customerFullName: {
    marginBottom: theme.utils.fromPx(-4),
  },
  dialogContent: {
    marginTop: theme.utils.fromPx(8),
  },
  dialogActions: {
    paddingLeft: '24px',
    paddingRight: '24px',
  },
  selectRoot: {
    marginTop: theme.utils.fromPx(4),
  },
  specialNote: {
    '& label ': {
      textTransform: 'inherit',
    },
  },
  wowRequestLabel: {
    marginTop: '8px',
    marginBottom: '-10px',
  },
  radioLabel: {
    fontSize: '0.85rem',
    marginLeft: '-4px',
  },
  selectPrimaryReason: {
    width: '240px',
  },
  asterisk: {
    color: theme.palette.red['500'],
  },
}));

const CallWrapupDialog = () => {
  const classes = useStyles();

  const [openDialogWrapScreen, setOpenDialogWrapScreen] = useState(false);
  const [initialPrimaryContactReason, setInitialPrimaryContactReason] = useState(null);
  const [icrLabel, setIcrLabel] = useState(null);
  const [incidentId, setIncidentId] = useState(-1);
  const [valueWow, setValueWow] = useState('no');
  const [primaryContactReason, setPrimaryContactReason] = useState(null);
  const [specialNote, setSpecialNote] = useState('');
  const { optionsTree, dictionary } = useContactReasonCategories();
  const specialNoteFlag = useFeature('feature.explorer.specialNotesEnabled');
  const oracle = useOracle();

  const pageName = 'Call Wrapup Dialog - VT';

  useEffect(() => {
    blueTriangle.start(pageName);

    return () => {
      blueTriangle.end(pageName);
    };
  }, []);

  const { data: { customerFullName = '', id: customerId = 0 } = {} } = useCustomer();

  const openDialog = useCallback(
    (event) => {
      const { reqJson: dialogProps } = event?.detail;
      setInitialPrimaryContactReason(dialogProps?.category_id);
      setIncidentId(dialogProps?.incidentId);
      setIcrLabel(dialogProps?.category_label);
      if (dialogProps?.category_label) {
        setPrimaryContactReason({ id: dialogProps?.category_id });
      }
      setOpenDialogWrapScreen(true);
    },
    [setOpenDialogWrapScreen, setInitialPrimaryContactReason, setIncidentId, setIcrLabel],
  );

  useEffect(() => {
    window.addEventListener(Events.OPEN_WRAP_SCREEN, openDialog); //emitted from Communicator.js / osvc
    return () => window.removeEventListener(Events.OPEN_WRAP_SCREEN, openDialog);
  }, [openDialog]);

  //close button
  const handleClose = useCallback(() => {
    setOpenDialogWrapScreen(false);
  }, [setOpenDialogWrapScreen]);

  const handleOnClickFinishWrapScreen = useCallback(() => {
    const payload = {
      customerId,
      primaryContactReasonId: primaryContactReason?.id,
      isWowRequest: valueWow === 'yes',
      specialNote: specialNote.length > 0 ? `::specialNote:: ${specialNote} ::specialNote::` : '',
    };
    oracle?.emit(Events.WRAPSCREENCOMPLETE, payload);

    handleSetSpecialNote('');
    setValueWow('no');
    setPrimaryContactReason(null);
    //drop();

    handleClose();
  }, [
    customerId,
    /* drop, */ handleClose,
    oracle,
    primaryContactReason?.id,
    specialNote,
    valueWow,
  ]);

  const handleSetSpecialNote = (note) => setSpecialNote(note);

  useEffect(() => {
    if (dictionary.hasOwnProperty(initialPrimaryContactReason)) {
      setPrimaryContactReason({
        id: initialPrimaryContactReason,
        name: dictionary[initialPrimaryContactReason],
      });
    }
  }, [incidentId]);

  return (
    <Dialog
      open={openDialogWrapScreen}
      onClose={handleClose}
      classes={{ container: classes.dialogContainer, paperWidthSm: classes.dialogContainer }}
      data-testid="callwrapdialog"
      data-cy="callwrapdialog"
    >
      <DialogTitle
        disableTypography
        className={classes.dialogTitle}
        data-testid="callwrapdialog:title"
      >
        <Box display="flex" justifyContent="space-between">
          <div>
            <Typography variant="subtitle2" className={classes.customerFullName}>
              {' '}
              {customerFullName}
            </Typography>
            <Typography variant="h6"> Customer Interaction Details</Typography>
          </div>
          <IconButton
            color="secondary"
            aria-label="close"
            className={classes.closeButton}
            onClick={handleClose}
            data-cy="callwrapdialogclose"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Typography variant="h6" className={classes.dialogContentTitle}>
          Review and Finalize Interaction
        </Typography>
        <Box className={classes.controlContainer}>
          <div className={classes.leftControls}>
            {icrLabel && (
              <TextField
                name="wrapupReadonlyTextField"
                id="wrapupReadonlyTextField"
                disabled={true}
                value={icrLabel}
                data-testid="wrap-up:read-only-textfield"
                data-cy="wrapupReadonlyTextField"
              />
            )}
            {!icrLabel && (
              <SelectTree
                disabled={
                  dictionary.hasOwnProperty(initialPrimaryContactReason) &&
                  primaryContactReason !== null
                }
                label={
                  <>
                    <span>Initial Contact Reason</span>
                    <span className={classes.asterisk}> * </span>
                  </>
                }
                classes={{
                  root: classes.selectPrimaryReason,
                }}
                value={primaryContactReason}
                onSelect={(reason) => setPrimaryContactReason(reason)}
                optionsTree={optionsTree}
              />
            )}
            <FormLabel component="legend" className={classes.wowRequestLabel}>
              <Typography variant="subtitle2">Start a WOW Request?</Typography>
            </FormLabel>
            <RadioGroup
              name="wowrequest"
              row
              aria-label="wowrequest"
              value={valueWow}
              onChange={(event) => setValueWow(event.target.value)}
            >
              <FormControlLabel
                value="yes"
                control={<Radio color="primary" />}
                label="Yes"
                classes={{ label: classes.radioLabel }}
              />
              <FormControlLabel
                value="no"
                control={<Radio color="primary" />}
                label="No"
                classes={{ label: classes.radioLabel }}
              />
            </RadioGroup>
          </div>
          {specialNoteFlag && (
            <TextField
              id="specialnote"
              name="specialnote"
              data-testid="specialnote"
              label={<LabelSpecialNote />}
              className={classes.specialNote}
              multiline
              rows={4}
              inputProps={{ maxLength: 200 }}
              variant="outlined"
              value={specialNote}
              onChange={(event) => handleSetSpecialNote(event.target.value)}
              data-cy="wrapScreenSpecialNote"
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button
          disabled={primaryContactReason === null}
          onClick={handleOnClickFinishWrapScreen}
          data-testid="callwrapdialog:commit"
          data-cy="wrapScreenFinishButton"
        >
          Finish
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CallWrapupDialog;
