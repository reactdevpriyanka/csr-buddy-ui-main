import NodeToggleCheck from '@/components/Workflow/NodeToggleCheck';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Dropdown from '../../Dropdown';
import Address from '../../Address';
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
  toggleSpacing: {
    paddingBottom: theme.utils.fromPx(16),
  },
  toggleContent: {
    paddingLeft: theme.utils.fromPx(32),
  },
}));

const CustomerBoxes = ({
  onChoose,
  returnMailingAddresses,
  quantityOfBoxes,
  boxesMailingAddress,
}) => {
  const classes = useStyles();

  const [boxesToggle, setBoxestoggle] = useState(false);
  const boxChoices = BOX_CHOICES;

  return (
    <div>
      <NodeToggleCheck
        id="summaryDetails.quantityOfBoxesChecked"
        name="summaryDetails.quantityOfBoxesChecked"
        checked={boxesToggle}
        onChange={setBoxestoggle}
        toggleLabel="Send box(es) to customer"
      />
      {boxesToggle && (
        <div className={classes.toggleContent}>
          <div className={classes.toggleSpacing}>
            <Dropdown
              name="summaryDetails.quantityOfBoxes"
              inputLabel="Boxes Needed"
              onChoose={onChoose}
              value={quantityOfBoxes}
              choices={boxChoices}
            />
          </div>
          <div>
            <Address
              inputLabel="Mailing Address"
              name="summaryDetails.boxesMailingAddress"
              onChoose={onChoose}
              value={boxesMailingAddress}
              choices={returnMailingAddresses}
            />
          </div>
        </div>
      )}
    </div>
  );
};

CustomerBoxes.propTypes = {
  onChoose: PropTypes.func.isRequired,
  returnMailingAddresses: PropTypes.array,
  quantityOfBoxes: PropTypes.string,
  boxesMailingAddress: PropTypes.object,
};

export default CustomerBoxes;
