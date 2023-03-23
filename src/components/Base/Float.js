import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, FormLabel, TextField } from '@material-ui/core';
import _ from 'lodash';

const useStyles = makeStyles((theme) => ({
  root: { marginBottom: theme.utils.fromPx(20) },
  textField: {
    minWidth: theme.utils.fromPx(400),
  },
  label: { marginBottom: theme.spacing(0.5) },
}));

const testId = `gwf-input:float`;

const Float = ({
  value: defaultValue = '',
  placeholder,
  name,
  label,
  onChoose = () => null,
  onValidityChange = () => null,
  required = false,
  disabled = false,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
  helperText = '',
}) => {
  const classes = useStyles();

  const [value, setValue] = useState(defaultValue);

  const [valid, setValid] = useState(true);

  const selectOutcome = (latestValue) => {
    if (latestValue <= max && latestValue >= min) {
      onChoose();
      setValid(true);
      onValidityChange(true);
    } else {
      setValid(false);
      onValidityChange(false);
    }
  };

  const debounceSelectOutcome = useMemo(() => _.debounce(selectOutcome, 300), [
    onChoose,
    onValidityChange,
  ]);

  const onBlur = () => {
    selectOutcome(value);
  };

  const onChange = (event) => {
    setValue(event.target.value);
    debounceSelectOutcome(event.target.value);
  };

  return (
    <div data-testid={testId} className={classes.root}>
      <FormControl component="fieldset" data-testid={`${testId}:control`}>
        <FormLabel component="legend" className={classes.label} data-testid={`${testId}:label`}>
          {label}
        </FormLabel>
        <TextField
          type="number"
          variant="outlined"
          name={name}
          className={classes.textField}
          data-testid={`${testId}:input`}
          placeholder={placeholder}
          inputProps={{ min, max }}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          disabled={disabled}
          helperText={!valid && helperText}
        />
      </FormControl>
    </div>
  );
};

Float.propTypes = {
  placeholder: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChoose: PropTypes.func,
  onValidityChange: PropTypes.func,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  min: PropTypes.number,
  max: PropTypes.number,
  helperText: PropTypes.string,
};

export default Float;
