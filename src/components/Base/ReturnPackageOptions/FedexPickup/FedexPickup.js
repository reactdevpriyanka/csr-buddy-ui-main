import NodeToggleCheck from '@/components/Workflow/NodeToggleCheck';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Dropdown from '../../Dropdown';
import Address from '../../Address';
import DatePicker from '../../DatePicker';
import { BOX_CHOICES } from '../utils';

const useStyles = makeStyles((theme) => ({
  sectionHeader: {
    color: theme.palette.primary.main,
    fontSize: theme.utils.fromPx(18),
    lineHeight: theme.utils.fromPx(24),
    fontWeight: 500,
  },
  labelsHelperText: {
    fontSize: theme.utils.fromPx(16),
    lineHeight: theme.utils.fromPx(22),
    padding: `${theme.utils.fromPx(24)} 0 ${theme.utils.fromPx(20)} 0`,
    color: '#1C49C2',
  },
  fedexHelperText: {
    fontSize: theme.utils.fromPx(16),
    lineHeight: theme.utils.fromPx(22),
    paddingTop: theme.utils.fromPx(10),
    color: '#1C49C2',
  },
  toggleSpacing: {
    paddingBottom: theme.utils.fromPx(16),
  },
  datePicker: {
    paddingBottom: theme.utils.fromPx(24),
  },
  disabled: {
    ...theme.utils.disabled,
  },
  toggleContent: {
    paddingLeft: theme.utils.fromPx(32),
  },
}));

const FedexPickup = ({
  onChoose,
  returnMailingAddresses,
  quantityOfFedexBoxes,
  fedexMailingAddress,
  returnFedexPickupDate,
  fedexToggle,
  setFedexToggle,
  disabled,
}) => {
  const classes = useStyles();
  const boxChoices = BOX_CHOICES;

  return (
    <div className={disabled ? classes.disabled : ''}>
      <NodeToggleCheck
        id="summaryDetails.fedexPickup"
        name="summaryDetails.fedexPickup"
        checked={fedexToggle}
        onChange={setFedexToggle}
        toggleLabel="FedEx Pickup"
      />
      {fedexToggle && (
        <div className={classes.toggleContent}>
          <div className={classes.toggleSpacing}>
            <Dropdown
              name="summaryDetails.quantityOfFedexBoxes"
              inputLabel="Boxes to Pickup"
              onChoose={onChoose}
              value={quantityOfFedexBoxes}
              choices={boxChoices}
            />
          </div>
          <div className={classes.datePicker}>
            <DatePicker
              name="summaryDetails.returnFedexPickupDate"
              inputLabel="Fed Ex Pickup Date"
              subLabel="Reminder: FedEx only picks up Monday through Friday and cannot be scheduled for same-day."
              onChoose={onChoose}
              value={returnFedexPickupDate}
            />
          </div>
          <div>
            <Address
              inputLabel="Mailing Address"
              name="summaryDetails.fedexMailingAddress"
              onChoose={onChoose}
              value={fedexMailingAddress}
              choices={returnMailingAddresses}
            />
          </div>
        </div>
      )}
    </div>
  );
};

FedexPickup.propTypes = {
  onChoose: PropTypes.func.isRequired,
  returnMailingAddresses: PropTypes.array,
  quantityOfFedexBoxes: PropTypes.string,
  fedexMailingAddress: PropTypes.object,
  returnFedexPickupDate: PropTypes.string,
  fedexToggle: PropTypes.bool,
  setFedexToggle: PropTypes.func,
  disabled: PropTypes.bool,
};

export default FedexPickup;
