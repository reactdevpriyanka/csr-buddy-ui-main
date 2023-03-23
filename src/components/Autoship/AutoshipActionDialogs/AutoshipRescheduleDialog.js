import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { formatRescheduleDate } from '@utils/dates';
import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from '@material-ui/core';
import useSubscription from '@/hooks/useSubscription';
import { BaseDialog } from '@components/Base';
import { frequencyUom, isValidFequency } from '../constants';

const useStyles = makeStyles((theme) => ({
  root: {},
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
    marginBottom: theme.spacing(2),
  },
  dialogTitle: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '24px',
    lineHeight: '28px',
    letterSpacing: '0.25%',
    color: '#000000',
  },
  dialogSubtitle: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '18px',
    lineHeight: '24px',
    color: '#031657',
  },
  rescheduleDialogTitle: {
    marginTop: theme.spacing(1),
    display: 'grid',
  },
  formControl: {
    marginTop: theme.spacing(2),
  },
  formControl2: {
    marginTop: theme.spacing(2),
  },
  formControl3: {
    marginTop: theme.spacing(2),
    width: '100%',
  },
  selectFrequency: {
    width: '220px',
  },
  date: {
    width: '100%',
    '& .MuiPickersToolbarText-toolbarTxt': {
      color: 'red',
    },
  },
  frequencyTextField: {
    width: '275px',
    marginRight: '10px',
    '& .MuiFormHelperText-root': {
      color: 'red',
      marginLeft: '0',
    },
  },
}));

const AutoshipRescheduleDialog = ({
  id,
  name,
  customerId,
  startDate,
  fulfillmentFrequency,
  fulfillmentFrequencyUom,
  nextFulfillmentDate,
  isOpen,
  openDialog,
  postInteraction,
}) => {
  const classes = useStyles();

  const { updateSubscription } = useSubscription(id);

  const [nextFrequencyDate, setNextFrequencyDate] = useState(nextFulfillmentDate);

  const [newFrequency, setNewFrequency] = useState(fulfillmentFrequency);

  const [newFrequencyUom, setNewFrequencyUom] = useState(fulfillmentFrequencyUom);

  const [valid, setValid] = useState(true);

  const [isRequestInFlight, setRequestInFlight] = useState(false);

  const helperText = 'Fulfillment frequency must not exceed 8 months';

  const pageName = 'Autoship Reschedule Dialog - VT';

  useEffect(() => {
    setNewFrequency(fulfillmentFrequency);
    setNewFrequencyUom(fulfillmentFrequencyUom);
  }, [fulfillmentFrequency, fulfillmentFrequencyUom]);

  const handleChangeFrequencyUOM = (event) => {
    setNewFrequencyUom(event.target.value);
    setValid(isValidFequency(newFrequency, event.target.value));
  };

  const handleNewFrequencyChange = (event) => {
    setNewFrequency(event.target.value);
    setValid(isValidFequency(event.target.value, newFrequencyUom));
  };

  const handleNewDateChange = (date) => {
    setNextFrequencyDate(date);
  };

  const handleCloseDialog = useCallback(() => {
    openDialog(false);
  }, [openDialog]);

  const captureInteraction = useCallback(() => {
    if (newFrequency || newFrequencyUom || nextFrequencyDate) {
      const data = {
        name: name,
        fulfillment_frequency: newFrequency * 1,
        fulfillment_uom: newFrequencyUom,
        fulfillment_next_date: nextFrequencyDate,
      };

      if (
        newFrequency.toString() !== fulfillmentFrequency.toString() ||
        newFrequencyUom !== fulfillmentFrequencyUom
      ) {
        postInteraction('AUTOSHIP_FREQUENCY_UPDATED', data, 'CREATE');
      }
      if (new Date(nextFrequencyDate).getTime() !== new Date(nextFulfillmentDate).getTime()) {
        postInteraction('AUSTOSHIP_RESCHEDULED', data, 'CREATE');
      }
    }
  }, [
    postInteraction,
    newFrequency,
    newFrequencyUom,
    nextFrequencyDate,
    name,
    fulfillmentFrequency,
    nextFulfillmentDate,
    fulfillmentFrequencyUom,
  ]);

  const handleRescheduleAutoship = useCallback(async () => {
    if (newFrequency || newFrequencyUom || nextFrequencyDate) {
      setRequestInFlight(true);
      await updateSubscription(
        {
          customerId,
          data: {
            fulfillment_frequency: newFrequency * 1,
            fulfillment_uom: newFrequencyUom,
            fulfillment_next_date: nextFrequencyDate,
          },
        },
        () => {
          captureInteraction();
          setRequestInFlight(false);
          openDialog(false);
        },
        () => {
          setRequestInFlight(false);
        },
      );
    }
  }, [newFrequency, newFrequencyUom, nextFrequencyDate]);

  return isOpen ? (
    <BaseDialog
      open={isOpen}
      onClose={handleCloseDialog}
      onOk={handleRescheduleAutoship}
      closeLabel="Cancel"
      okLabel="Reschedule"
      disableOkBtn={!valid}
      pageName={pageName}
      requestInFlight={isRequestInFlight}
      dialogTitle={<span className={classes.dialogTitle}>Reschedule Subscription</span>}
    >
      <form className={classes.form} data-testid="autoship-reschedule">
        <span className={classes.dialogSubtitle}>Frequency and NFD</span>
        <div className={classes.rescheduleDialogTitle}>
          Started on {formatRescheduleDate(startDate, false)}
        </div>
        <div className={classes.container}>
          <div className={classes.firstRow}>
            <FormControl className={classes.formControl}>
              <TextField
                className={classes.frequencyTextField}
                label="Frequency"
                value={newFrequency}
                name="fulfillmentFrequency"
                type="number"
                onChange={handleNewFrequencyChange}
                data-testid="change-frequency"
                variant="outlined"
                helperText={!valid && helperText}
              />
            </FormControl>
            <FormControl variant="outlined" className={classes.formControl2}>
              <InputLabel shrink>Units Of Measure</InputLabel>
              <Select
                className={classes.selectFrequency}
                required={true}
                value={newFrequencyUom}
                onChange={handleChangeFrequencyUOM}
                data-testid="dialog-change-frequency-uom"
                input={<OutlinedInput notched label="Units Of Measure" name="frequencyUom" />}
              >
                {frequencyUom?.map(({ id, value, label }) => (
                  <MenuItem key={id} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className={classes.secondRow}>
            <FormControl className={classes.formControl3}>
              <KeyboardDatePicker
                className={classes.date}
                variant="inline"
                label="Next Fulfillment Date"
                disablePast
                format="yyyy-MM-dd"
                value={nextFrequencyDate}
                onChange={handleNewDateChange}
                inputVariant="outlined"
                autoOk={true}
                name="nextFrequencyDate"
                data-testid="change-frequency-date"
              />
            </FormControl>
          </div>
        </div>
      </form>
    </BaseDialog>
  ) : null;
};

AutoshipRescheduleDialog.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  customerId: PropTypes.string.isRequired,
  nextFulfillmentDate: PropTypes.string,
  startDate: PropTypes.string,
  fulfillmentFrequency: PropTypes.number,
  fulfillmentFrequencyUom: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isOpen: PropTypes.bool,
  openDialog: PropTypes.func,
  postInteraction: PropTypes.func,
};

export default AutoshipRescheduleDialog;
