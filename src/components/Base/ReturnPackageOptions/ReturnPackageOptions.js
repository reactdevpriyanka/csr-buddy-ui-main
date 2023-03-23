import { useRouter } from 'next/router';
import { getSessionStorage } from '@/utils/sessionStorage';
import { makeStyles } from '@material-ui/core/styles';
import { Divider } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';
import FeatureFlag from '@/features/FeatureFlag';
import useFeature from '@/features/useFeature';
import useGwfContext from '@/hooks/useGwfContext';
import SnailMailShippingLabels from './SnailMailShippingLabels/SnailMailShippingLabels';
import CustomerBoxes from './CustomerBoxes/CustomerBoxes';
import FedexPickup from './FedexPickup/FedexPickup';
import EmailedShippingLabels from './EmailedShippingLabels/EmailedShippingLabels';

const useStyles = makeStyles((theme) => ({
  divider: {
    height: '2px',
    marginBottom: '1.5rem !important',
    marginTop: '1.5rem !important',
  },
  sectionHeader: {
    color: theme.palette.primary.main,
    fontSize: theme.utils.fromPx(18),
    lineHeight: theme.utils.fromPx(24),
    fontWeight: 500,
    paddingBottom: theme.utils.fromPx(8),
  },
  labelsHelperText: {
    fontSize: theme.utils.fromPx(16),
    lineHeight: theme.utils.fromPx(22),
    padding: `${theme.utils.fromPx(24)} 0 ${theme.utils.fromPx(20)} 0`,
    color: '#1C49C2',
  },
  disabled: {
    ...theme.utils.disabled,
  },
  disbaledHelperText: {
    fontSize: theme.utils.fromPx(16),
    lineHeight: theme.utils.fromPx(22),
    paddingLeft: theme.utils.fromPx(32),
    color: theme.palette.blue.chewyBrand,
  },
}));

const ReturnPackageOptions = ({ onChoose }) => {
  const classes = useStyles();
  const router = useRouter();
  const { activityId } = router.query;
  const enableMultiLabel = useFeature('feature.explorer.summaryPageMultiLabelEnabled');

  const [snailMailToggle, setSnailMailToggle] = useState(false);
  const [fedexToggle, setFedexToggle] = useState(false);

  const sessionStorage = getSessionStorage('gwf:history') || {};
  const storageKey = `returns-continueToSummary-${activityId}`;

  const { context: contextFromHistory } = sessionStorage[storageKey] || {};
  const gwfContextFromProvider = useGwfContext();
  const gwfContext = contextFromHistory ? contextFromHistory : gwfContextFromProvider;

  const {
    returnItems,
    returnDestinations,
    summaryDetails: {
      returnMailingAddresses,
      quantityOfMailLabels,
      snailMailAddress,
      quantityOfBoxes,
      boxesMailingAddress,
      quantityOfFedexBoxes,
      fedexMailingAddress,
      returnFedexPickupDate,
      emailAddress,
      returnLabelCounts,
    },
  } = gwfContext;

  return (
    <div>
      <Divider className={classes.divider} />
      <div className={classes.sectionHeader}>{'Return Package Options'}</div>
      {!enableMultiLabel && returnItems?.length > 1 && (
        <div className={classes.labelsHelperText}>
          {'After submissions, for multiple labels go to 1.0'}
        </div>
      )}
      <FeatureFlag flag="feature.explorer.summaryPageMultiLabelEnabled">
        <EmailedShippingLabels
          onChoose={onChoose}
          quantityOfMailLabels={quantityOfMailLabels}
          emailAddress={emailAddress}
          returnDestinations={returnDestinations}
          returnLabelCounts={returnLabelCounts}
        />
      </FeatureFlag>
      <SnailMailShippingLabels
        onChoose={onChoose}
        returnMailingAddresses={returnMailingAddresses}
        quantityOfMailLabels={quantityOfMailLabels}
        snailMailAddress={snailMailAddress}
        snailMailToggle={snailMailToggle}
        setSnailMailToggle={setSnailMailToggle}
        disabled={fedexToggle}
      />
      {fedexToggle && (
        <div className={classes.disbaledHelperText}>
          Mailed shipping label unavailable if pickup selected
        </div>
      )}
      <CustomerBoxes
        onChoose={onChoose}
        returnMailingAddresses={returnMailingAddresses}
        quantityOfBoxes={quantityOfBoxes}
        boxesMailingAddress={boxesMailingAddress}
      />
      <FedexPickup
        onChoose={onChoose}
        returnMailingAddresses={returnMailingAddresses}
        quantityOfFedexBoxes={quantityOfFedexBoxes}
        fedexMailingAddress={fedexMailingAddress}
        returnFedexPickupDate={returnFedexPickupDate}
        fedexToggle={fedexToggle}
        setFedexToggle={setFedexToggle}
        disabled={snailMailToggle}
      />
      {snailMailToggle && (
        <div className={classes.disbaledHelperText}>
          Pickup unavailable with mailed shipping labels
        </div>
      )}
    </div>
  );
};

ReturnPackageOptions.propTypes = {
  onChoose: PropTypes.func.isRequired,
};

export default ReturnPackageOptions;
