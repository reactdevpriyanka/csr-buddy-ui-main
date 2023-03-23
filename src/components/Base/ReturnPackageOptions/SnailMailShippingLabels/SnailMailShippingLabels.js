import NodeToggleCheck from '@/components/Workflow/NodeToggleCheck';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Dropdown from '../../Dropdown';
import Address from '../../Address';
import { LABEL_CHOICES } from '../utils';

const useStyles = makeStyles((theme) => ({
  toggleSpacing: {
    paddingBottom: theme.utils.fromPx(16),
  },
  labelsHelperText: {
    fontSize: theme.utils.fromPx(16),
    lineHeight: theme.utils.fromPx(22),
    color: theme.palette.blue.chewyBrand,
    paddingBottom: theme.utils.fromPx(16),
  },
  disabled: {
    ...theme.utils.disabled,
  },
  toggleContent: {
    paddingLeft: theme.utils.fromPx(32),
  },
}));

const SnailMailShippingLabels = ({
  onChoose,
  returnMailingAddresses,
  quantityOfMailLabels,
  snailMailAddress,
  snailMailToggle,
  setSnailMailToggle,
  disabled,
}) => {
  const classes = useStyles();
  const labelChoices = LABEL_CHOICES;

  return (
    <div className={disabled ? classes.disabled : ''}>
      <NodeToggleCheck
        id="summaryDetails.snailMailLabels"
        name="summaryDetails.snailMailLabels"
        checked={snailMailToggle}
        onChange={setSnailMailToggle}
        toggleLabel="Mailed shipping label(s) (snail mail)"
      />
      {snailMailToggle && (
        <div className={classes.toggleContent}>
          <div className={classes.labelsHelperText}>
            Mailed labels will be sent to customer via supply team
          </div>
          <div className={classes.toggleSpacing}>
            <Dropdown
              name="summaryDetails.quantityOfMailLabels"
              inputLabel="# of labels"
              onChoose={onChoose}
              value={quantityOfMailLabels}
              choices={labelChoices}
            />
          </div>
          <div>
            <Address
              inputLabel="Mailing Address"
              name="summaryDetails.snailMailAddress"
              onChoose={onChoose}
              value={snailMailAddress}
              choices={returnMailingAddresses}
            />
          </div>
        </div>
      )}
    </div>
  );
};

SnailMailShippingLabels.propTypes = {
  onChoose: PropTypes.func.isRequired,
  returnMailingAddresses: PropTypes.array,
  quantityOfMailLabels: PropTypes.string,
  snailMailAddress: PropTypes.object,
  snailMailToggle: PropTypes.bool,
  setSnailMailToggle: PropTypes.func,
  disabled: PropTypes.bool,
};

export default SnailMailShippingLabels;
