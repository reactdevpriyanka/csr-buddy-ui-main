// import cn from 'classnames';
import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, FormLabel, TextField } from '@material-ui/core';
import _ from 'lodash';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.utils.fromPx(20),
  },
  textField: {
    minWidth: theme.utils.fromPx(400),
  },
  label: {
    ...theme.utils.title,
  },
}));

const testId = `gwf-input:integer`;

const Integer = ({
  name,
  title = '',
  label = '',
  placeholder = '',
  onChoose = () => null,
  onValidityChange = () => null,
  value: defaultValue = '',
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
          {title || label}
        </FormLabel>
        <TextField
          type="number"
          variant="outlined"
          name={name}
          className={classes.textField}
          data-testid={`${testId}:input`}
          placeholder={placeholder}
          inputProps={{ min, max }}
          onBlur={onBlur}
          onChange={onChange}
          value={value}
          required={required}
          disabled={disabled}
          helperText={!valid && helperText}
        />
      </FormControl>
    </div>
  );
};

Integer.propTypes = {
  name: PropTypes.string,
  title: PropTypes.string,
  label: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  onChoose: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  helperText: PropTypes.string,
  onValidityChange: PropTypes.func,
};

export default Integer;
