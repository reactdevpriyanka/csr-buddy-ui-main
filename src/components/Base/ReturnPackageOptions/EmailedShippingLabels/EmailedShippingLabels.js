import NodeToggleCheck from '@/components/Workflow/NodeToggleCheck';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { LABEL_CHOICES } from '../utils';

const useStyles = makeStyles((theme) => ({
  toggleSpacing: {},
  labelsHelperText: {
    fontSize: theme.utils.fromPx(16),
    lineHeight: theme.utils.fromPx(22),
    color: theme.palette.blue.chewyBrand,
    paddingBottom: theme.utils.fromPx(16),
  },
  toggleContent: {
    paddingLeft: theme.utils.fromPx(32),
    '& $toggleSpacing:not(:last-child)': {
      paddingBottom: theme.utils.fromPx(16),
    },
  },
  location: {
    paddingBottom: theme.utils.fromPx(16),
  },
  dropdown: {
    ...theme.utils.col,
    width: '100%',
    maxWidth: theme.utils.fromPx(338),
    minWidth: theme.utils.fromPx(338),
  },
}));

const EmailedShippingLabels = ({
  onChoose,
  emailAddress,
  returnDestinations = {},
  returnLabelCounts = null,
}) => {
  const classes = useStyles();

  const [checked, setChecked] = useState(true);

  const [labelCounts, setLabelCounts] = useState(
    returnLabelCounts
      ? returnLabelCounts
      : Object.keys(returnDestinations).reduce((accum, location) => {
          return {
            [location]: 1,
            ...accum,
          };
        }, {}),
  );
  const labelChoices = LABEL_CHOICES;

  const handleStateChange = (location, event) => {
    setLabelCounts({ ...labelCounts, [location]: event.target.value });
    onChoose();
  };

  const hasMoreThanOneReturnDestination = useMemo(() => {
    return Object.keys(returnDestinations)?.length > 1;
  }, [returnDestinations]);

  return (
    <div>
      <div>
        <NodeToggleCheck
          id="summaryDetails.returnLabelChecked"
          name="summaryDetails.returnLabelChecked"
          checked={checked}
          onChange={setChecked}
          toggleLabel="Label(s) (email)"
          disabled={true}
        />
      </div>
      {checked && (
        <div className={classes.toggleContent}>
          {emailAddress && (
            <div className={classes.labelsHelperText}>
              All labels will be instantly created and sent to ({emailAddress})
            </div>
          )}
          {Object.entries(returnDestinations).map(([location, value]) => (
            <div key={location} className={classes.toggleSpacing}>
              {hasMoreThanOneReturnDestination && (
                <div className={classes.location}>
                  <span>{location}</span>
                  {value?.destination?.address?.city && (
                    <span>, {value?.destination?.address?.city}</span>
                  )}
                </div>
              )}
              <div className={classes.dropdown}>
                <FormControl>
                  <InputLabel htmlFor={location} id="select-label-id">
                    # of labels
                  </InputLabel>
                  <Select
                    variant="outlined"
                    id="select-label-id"
                    value={labelCounts[location]}
                    label="# of labels"
                    onChange={(event) => handleStateChange(location, event)}
                  >
                    {labelChoices.map(({ label, value }) => (
                      <MenuItem key={label} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
          ))}
        </div>
      )}
      <input
        type="hidden"
        name="summaryDetails.returnLabelCounts"
        value={JSON.stringify(labelCounts)}
      />
    </div>
  );
};

EmailedShippingLabels.propTypes = {
  onChoose: PropTypes.func.isRequired,
  emailAddress: PropTypes.string,
  returnDestinations: PropTypes.array,
  returnLabelCounts: PropTypes.object,
};

export default EmailedShippingLabels;
