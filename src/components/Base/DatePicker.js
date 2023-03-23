import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormControl, FormLabel, FormHelperText } from '@mui/material';
import { makeStyles } from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { formatRescheduleDate } from '@/utils';

const useStyles = makeStyles((theme) => ({
  root: {
    ...theme.utils.col,
    width: '100%',
    maxWidth: theme.utils.fromPx(338),
  },
  title: {
    ...theme.utils.title,
  },
  label: {
    ...theme.utils.label,
  },
  subLabel: {
    ...theme.utils.subLabel,
  },
}));

const DatePicker = ({
  id,
  name,
  title = '',
  subLabel = '',
  onChoose = () => null,
  onValidityChange = () => null,
  value: defaultValue = '',
  required = false,
  disabled = false,
  inputLabel,
}) => {
  const classes = useStyles();
  const [value, setValue] = useState(defaultValue);

  const onChange = useCallback(
    (date) => {
      setValue(formatRescheduleDate(date));
      onChoose();
    },
    [setValue, onChoose],
  );

  return (
    <FormControl className={classes.root}>
      <FormLabel className={classes.title}>{title}</FormLabel>
      <KeyboardDatePicker
        id={id}
        name={name}
        label={inputLabel}
        required={required}
        disabled={disabled}
        value={value}
        inputValue={value}
        autoOk={true}
        onChange={onChange}
        variant="inline"
        inputVariant="outlined"
        format="yyyy-MM-dd"
      />
      <FormHelperText>{subLabel}</FormHelperText>
    </FormControl>
  );
};

DatePicker.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  title: PropTypes.string,
  subLabel: PropTypes.string,
  onChoose: PropTypes.func,
  onValidityChange: PropTypes.func,
  value: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  inputLabel: PropTypes.string,
};

export default DatePicker;
