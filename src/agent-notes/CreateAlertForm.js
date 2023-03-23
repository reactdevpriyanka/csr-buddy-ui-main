import { useCallback, useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import {
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { SNACKVARIANTS } from '@/components/SnackMessage/SnackMessage';
import ModalContext from '@/components/ModalContext';
import Button from '@/components/Button';
import useAgentAlert from '@/hooks/useAgentAlert';
import useCSRInfo from '@/hooks/useCSRInfo';
import useOracle from '@/hooks/useOracle';
import useAthena from '@/hooks/useAthena';
import { ROLES } from '@/hooks/useRoles';
import useEnv from '@/hooks/useEnv';
import ATHENA_KEYS from '@/constants/athena';
import useFeature from '@/features/useFeature';
import { alertTypes } from './alertTypes';

const CHARACTER_LIMIT = 280;

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiFormControl-root': {
      display: 'flex',
    },
  },
  titleLabel: {
    color: theme.palette.primary.main,
    marginTop: '0px',
  },
  inputLabel: {
    paddingLeft: theme.utils.fromPx(16),
    lineHeight: '0',
  },
  dropdown: {
    height: '56px',
    marginBottom: `${theme.spacing(1)}`,
    border: '1px',
    textAlign: 'left',
  },
  textField: {
    height: '72px',
    marginTop: '8px',
    marginBottom: `${theme.spacing(1.5)}`,
    border: '1px',
    textAlign: 'left',
    justifyContent: 'space-between',
  },
  buttonGrid: {
    backgroundColor: '#EEEEEE',
    position: 'fixed',
    bottom: 0,
    width: '-webkit-fill-available',
    padding: `${theme.utils.fromPx(16)} 0`,
    marginLeft: theme.utils.fromPx(-24),
    paddingLeft: theme.utils.fromPx(24),
  },
  helperText: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 2px',
  },
  submitButton: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.white,
    width: '96px',
    height: '42px',
    marginLeft: '5px',
  },
  cancelButton: {
    color: '#333333',
    width: '96px',
    height: '42px',
  },
}));

export default function CreateAlertForm({ onAfterSubmit = () => {}, onClose = () => {} }) {
  const classes = useStyles();
  const { getLang } = useAthena();
  const { enqueueSnackbar } = useSnackbar();
  const { setInitialLoad } = useContext(ModalContext);
  const [newAlertType, setNewAlertType] = useState();
  const [newAlertNote, setAlertNote] = useState('');

  const router = useRouter();
  const { id: customerId } = router.query;
  const { data: csr } = useCSRInfo();
  const oracle = useOracle();
  const incidentData = oracle?.getIncidentStartData();
  const { createAgentAlert } = useAgentAlert();
  const { userRoles } = useEnv();
  const healthcareEnabled = useFeature(ATHENA_KEYS.HEALTHCARE_TAB_ENABLED);

  const handleClose = useCallback((event) => {
    event.preventDefault();
    onClose();
  }, []);

  const hasLCSRRole = useMemo(() => {
    return userRoles && userRoles?.includes(ROLES.LCSR);
  }, [userRoles]);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      setInitialLoad(false);
      createAgentAlert({
        data: {
          customerId,
          type: 'NEXT_AGENT_NOTE',
          details: {
            agentName: csr.agentName,
            issueType: newAlertType,
            nextAgentNote: newAlertNote,
            acknowledged: 'false',
            interactionId: incidentData.interactionId,
            agentId: csr.logonId,
          },
        },
      })
        .then(() => {
          onAfterSubmit();
          setNewAlertType();
          setAlertNote('');
          enqueueSnackbar({
            messageHeader: 'Success',
            variant: SNACKVARIANTS.SUCCESS,
            messageSubheader: 'Success! Agent Alert Saved',
          });
        })
        .catch(() => {
          enqueueSnackbar({
            messageHeader: 'Error',
            variant: SNACKVARIANTS.ERROR,
            messageSubheader: 'Failed to create agent alert',
          });
        });
    },
    [
      createAgentAlert,
      csr,
      enqueueSnackbar,
      incidentData,
      newAlertNote,
      newAlertType,
      onAfterSubmit,
      setInitialLoad,
    ],
  );

  return (
    <>
      <form
        className={classes.root}
        data-testid="create-agent-alert"
        onSubmit={(event) => event.preventDefault()}
      >
        <h2 className={classes.titleLabel} data-testid="alert:agent alert title">
          {getLang('createAgentAlertText', { fallback: 'Create Agent Alert' })}
        </h2>
        <p data-testid="alert:agent alert paragraph">
          Agent Alerts are for passing <span style={{ fontWeight: 'bold' }}>critical</span> customer
          or order information to the next agent(s).
        </p>
        <Grid item xs={12}>
          <FormControl>
            <InputLabel id="agent-type" className={classes.inputLabel}>
              {getLang('agentAlertTypeText', { fallback: 'Alert Type' })}
            </InputLabel>
            <Select
              className={classes.dropdown}
              data-testid="add-alert-type"
              labelId="agent-type"
              label={getLang('agentAlertTypeText', { fallback: 'Alert Type' })}
              MenuProps={{
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
                getContentAnchorEl: null,
              }}
              onChange={(event) => setNewAlertType(event.target.value)}
              value={newAlertType ?? ''}
              variant="outlined"
            >
              {hasLCSRRole && healthcareEnabled && (
                <MenuItem data-testid="alert:type-care-plus" value="CarePlus">
                  CarePlus
                </MenuItem>
              )}
              {alertTypes &&
                alertTypes.map((alertType) => (
                  <MenuItem
                    data-testid={`alert:type-${alertType.value}`}
                    key={alertType.name}
                    value={alertType.value}
                  >
                    {alertType.value}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={16}>
          <FormControl>
            <TextField
              className={classes.textField}
              data-testid="add-alert-note"
              helperText={
                <div className={classes.helperText}>
                  <span>
                    {getLang('agentAlertNoteText', {
                      fallback: 'Note: 2 alerts per agent maximum',
                    })}
                  </span>
                  <span>{`${newAlertNote.length}/${CHARACTER_LIMIT}`}</span>
                </div>
              }
              inputProps={{ maxlength: CHARACTER_LIMIT }}
              label="Agent Alert"
              maxRows={20}
              multiline
              value={newAlertNote}
              variant="outlined"
              onChange={(event) => setAlertNote(event.target.value)}
            />
          </FormControl>
        </Grid>
      </form>
      <div className={classes.buttonGrid}>
        <Button
          aria-label="Cancel"
          className={classes.cancelButton}
          data-testid="add-agent-alert-cancel"
          onClick={handleClose}
        >
          {getLang('agentAlertCancelText', { fallback: 'Cancel' })}
        </Button>
        <Button
          aria-label="Save Alert"
          className={classes.submitButton}
          data-testid="save-agent-alert"
          disabled={!(newAlertNote && newAlertType)}
          onClick={handleSubmit}
          solid
          type="submit"
        >
          {getLang('agentAlertSaveText', { fallback: 'Save Alert' })}
        </Button>
      </div>
    </>
  );
}

CreateAlertForm.propTypes = {
  onAfterSubmit: PropTypes.func,
  onClose: PropTypes.func,
};
