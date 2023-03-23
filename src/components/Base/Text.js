/* eslint-disable react/jsx-props-no-spreading */
// import cn from 'classnames';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, FormLabel, TextField } from '@material-ui/core';
import { useState } from 'react';

const useStyles = makeStyles((theme) => ({
  root: { marginBottom: theme.spacing(1.25) },
  input: {
    minWidth: theme.utils.fromPx(400),
  },
  label: {
    ...theme.utils.title,
  },
  inputWrap: { display: 'flex', flexDirection: 'row', alignItems: 'center' },
}));

const testId = 'gwf-input:text';

const TextNode = ({
  name,
  title,
  label,
  subLabel,
  onChoose,
  onValidityChange,
  value: defaultValue = '',
  required,
  disabled,
  placeholder,
  helperText,
}) => {
  const classes = useStyles();
  const [value, setValue] = useState(defaultValue);

  const [valid, setValid] = useState(true);

  const onChange = (event) => {
    const val = event.target.value;
    setValue(val);
    /** Add in additional logic for further validation/props */
    if (val !== '') {
      onChoose();
      setValid(true);
      onValidityChange(true);
    } else {
      onValidityChange(false);
      setValid(false);
    }
  };

  return (
    <div data-testid={testId} className={classes.root}>
      <FormControl component="fieldset" data-testid={`${testId}:control`}>
        <FormLabel component="legend" className={classes.label} data-testid={`${testId}:label`}>
          {title}
        </FormLabel>
        <div className={classes.inputWrap}>
          {
            subLabel && subLabel //NOSONAR
          }
          <TextField
            data-testid={`${testId}:input`}
            variant="outlined"
            className={classes.input}
            label={label}
            name={name}
            placeholder={placeholder}
            helperText={!valid && helperText}
            onChange={onChange}
            value={value}
            required={required}
            disabled={disabled}
          />
        </div>
      </FormControl>
    </div>
  );
};

TextNode.propTypes = {
  name: PropTypes.string,
  title: PropTypes.string,
  label: PropTypes.string,
  subLabel: PropTypes.string,
  onChoose: PropTypes.func,
  onValidityChange: PropTypes.func,
  value: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  helperText: PropTypes.string,
};

export default TextNode;
