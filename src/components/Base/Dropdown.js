import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

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

const Dropdown = ({
  choices,
  name,
  id,
  title,
  value: initialValue = '',
  disabled = false,
  inputLabel,
  onChoose = () => null,
}) => {
  const classes = useStyles();
  const [value, setValue] = useState(initialValue);

  const onChange = useCallback(
    (event) => {
      setValue(event.target.value);
      onChoose();
    },
    [setValue, onChoose],
  );

  return (
    <div className={classes.root}>
      <FormControl disabled={disabled} input>
        {inputLabel && (
          <InputLabel htmlFor={id} id="select-label-id">
            {inputLabel}
          </InputLabel>
        )}
        <Select
          name={name}
          variant="outlined"
          id="select-label-id"
          value={value}
          label={inputLabel}
          onChange={onChange}
          data-testid="gwf-input:dropdown"
        >
          {choices?.map(({ label, value, disabled = false }) => (
            <MenuItem value={value} key={`${id}-${value}`} disabled={disabled}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

Dropdown.propTypes = {
  choices: PropTypes.array,
  title: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  onChoose: PropTypes.func,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  inputLabel: PropTypes.string,
};

export default Dropdown;
