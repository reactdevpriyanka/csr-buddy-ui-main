import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useCallback, useState } from 'react';
import { BaseDialog } from '@components/Base';
import useSubscription from '@/hooks/useSubscription';
import { frequencyUomMapper } from '../constants';

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
  },
  selectFrequency: {
    width: 220,
  },
  date: {
    width: 500,
  },
}));

const AutoshipChangeFrequencyDialog = ({
  id,
  name,
  customerId,
  fulfillmentFrequency,
  newFulfillmentFrequency,
  newFulfillmentFrequencyUom,
  fulfillmentFrequencyUom,
  isOpen,
  openDialog,
  postInteraction,
  onCancel,
}) => {
  const classes = useStyles();

  const [isRequestInFlight, setRequestInFlight] = useState(false);
  const frequency = newFulfillmentFrequency;
  const frequencyUOM = newFulfillmentFrequencyUom;
  const { updateSubscription } = useSubscription(id);

  const pageName = 'Autoship Change Frequency Dialog - VT';

  const handleCloseDialog = useCallback(() => {
    onCancel(newFulfillmentFrequency, newFulfillmentFrequencyUom);
    openDialog(false);
  }, [openDialog]);

  const captureInteraction = useCallback(() => {
    if (frequency || frequencyUOM) {
      const data = {
        name: name,
        fulfillment_frequency: frequency * 1,
        fulfillment_uom: frequencyUOM,
      };
      postInteraction('AUTOSHIP_FREQUENCY_UPDATED', data, 'CREATE');
    }
  }, [postInteraction, frequency, frequencyUOM, name]);

  const handleRescheduleAutoship = useCallback(() => {
    if (frequency || frequencyUOM) {
      setRequestInFlight(true);
      updateSubscription(
        {
          subscriptionId: id,
          customerId,
          data: {
            fulfillment_frequency: frequency * 1,
            fulfillment_uom: frequencyUOM,
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
  }, [newFulfillmentFrequency, fulfillmentFrequencyUom]);

  return isOpen ? (
    <BaseDialog
      data-testid="autoship-change-frequency"
      open={isOpen}
      onClose={handleCloseDialog}
      onOk={handleRescheduleAutoship}
      closeLabel="Cancel"
      okLabel="Update"
      requestInFlight={isRequestInFlight}
      pageName={pageName}
      dialogTitle={<span className={classes.dialogTitle}>Change Frequency</span>}
    >
      <span>
        {`Update frequency of Autoship ID #${id} from "Every ${fulfillmentFrequency} ${frequencyUomMapper[fulfillmentFrequencyUom]}" to 
        "Every ${frequency} ${frequencyUomMapper[frequencyUOM]}"`}
      </span>
    </BaseDialog>
  ) : null;
};

AutoshipChangeFrequencyDialog.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  customerId: PropTypes.string.isRequired,
  fulfillmentFrequency: PropTypes.number,
  newFulfillmentFrequency: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  newFulfillmentFrequencyUom: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fulfillmentFrequencyUom: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isOpen: PropTypes.bool,
  openDialog: PropTypes.func,
  postInteraction: PropTypes.func,
  onCancel: PropTypes.func,
};

export default AutoshipChangeFrequencyDialog;
