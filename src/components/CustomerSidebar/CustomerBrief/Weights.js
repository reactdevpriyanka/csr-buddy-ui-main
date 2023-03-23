import { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormControl, FormControlLabel, Radio, RadioGroup } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.utils.fromPx(33),
    marginTop: theme.utils.fromPx(16),
  },
  fieldLabel: {
    color: theme.palette.gray.medium,
    fontSize: theme.utils.fromPx(16),
    fontWeight: 500,
    marginBottom: theme.utils.fromPx(8),
  },
}));

const Weights = ({ name, disabled = false, defaultValue = '', onChange }) => {
  const classes = useStyles();

  const [value, setValue] = useState(defaultValue);

  const handleChange = useCallback(
    (event) => {
      setValue(event.target.value);
      onChange(event);
    },
    [onChange],
  );

  useEffect(() => setValue(defaultValue), [defaultValue]);

  return (
    <FormControl component="fieldset" className={classes.root}>
      <RadioGroup name={name} value={value} onChange={handleChange}>
        <FormControlLabel
          label="10 lbs"
          value={10}
          control={<Radio color="primary" />}
          disabled={disabled}
          data-testid="weight-10"
        />
        <FormControlLabel
          label="20 lbs"
          value={20}
          control={<Radio color="primary" />}
          disabled={disabled}
          data-testid="weight-20"
        />
        <FormControlLabel
          label="30 lbs"
          value={30}
          control={<Radio color="primary" />}
          disabled={disabled}
          data-testid="weight-30"
        />
        <FormControlLabel
          label="40 lbs"
          value={40}
          control={<Radio color="primary" />}
          disabled={disabled}
          data-testid="weight-40"
        />
      </RadioGroup>
    </FormControl>
  );
};

Weights.propTypes = {
  name: PropTypes.string,
  defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

export default Weights;
