import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, FormLabel, TextField } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    '&:not(:last-of-type)': {
      marginBottom: theme.utils.fromPx(20),
    },
  },
  label: {
    ...theme.utils.title,
  },
}));

const useInputStyles = makeStyles((theme) => ({
  root: {
    minWidth: theme.utils.fromPx(400),
  },
}));

const testId = 'gwf-input:email';

const Email = ({
  name,
  label,
  value: defaultValue = '',
  required = false,
  disabled = false,
  onChoose = () => null,
  onValidityChange = () => null,
  placeholder = '',
  helperText = '',
}) => {
  const classes = useStyles();

  const inputClasses = useInputStyles();

  const [value, setValue] = useState(defaultValue);

  const [valid, setValid] = useState(true);

  const inputProps = { type: 'email' };

  const onChange = useCallback(
    (event) => {
      setValue(event.target.value);
    },
    [setValue],
  );

  const onBlur = useCallback(
    (event) => {
      const { target: email } = event;
      required && email?.validity?.valid && onChoose();
      setValid(required ? email.validity.valid : true);
      onValidityChange(required ? email.validity.valid : true);
    },
    [onChoose, required, onValidityChange],
  );

  return (
    <div className={classes.root} data-testid={testId}>
      <FormControl>
        <FormLabel className={classes.label}>{label}</FormLabel>
        <TextField
          type="email"
          classes={inputClasses}
          inputProps={inputProps}
          variant="outlined"
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          helperText={!valid && helperText}
          placeholder={placeholder}
        />
      </FormControl>
    </div>
  );
};

Email.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  onChoose: PropTypes.func,
  onValidityChange: PropTypes.func,
  helperText: PropTypes.string,
  placeholder: PropTypes.string,
};

export default Email;
