/* eslint-disable react/jsx-props-no-spreading */
import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Select, FormLabel, MenuItem, InputLabel, FormControl } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';

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

const testId = 'gwf-input:address';

const Address = ({
  title = '',
  label = '',
  subLabel = '',
  value: initialValue = '',
  name,
  inputLabel,
  choices = [],
  onChoose = () => null,
}) => {
  const classes = useStyles();

  const [value, setValue] = useState(JSON.stringify(initialValue));

  const renderValue = (value) => {
    value = JSON.parse(value);

    if (value && value.addressLine1 && value.city && value.state && value.postcode) {
      return `${value.addressLine1}, ${value.city} ${value.state} ${value.postcode}`;
    }
    return value;
  };

  const onChange = useCallback(
    (event) => {
      setValue(JSON.stringify(event.target.value));
      onChoose();
    },
    [setValue, onChoose],
  );

  return (
    <div className={classes.root}>
      <FormControl input>
        {title && <FormLabel className={classes.title}>{title}</FormLabel>}
        {label && <span className={classes.label}>{label}</span>}
        {subLabel && <span className={classes.subLabel}>{subLabel}</span>}
        {inputLabel && <InputLabel id="select-label-id"> {inputLabel} </InputLabel>}
        <Select
          label={inputLabel}
          variant="outlined"
          renderValue={renderValue}
          onChange={onChange}
          id="select-label-id"
          value={value}
          data-testid={testId}
          name={name}
        >
          {choices.map((choice) => (
            <MenuItem data-testid={`${testId}:${choice.id}`} key={choice.id} value={choice}>
              {choice.addressLine1}, {choice.city} {choice.state} {choice.postcode}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

Address.propTypes = {
  title: PropTypes.string,
  label: PropTypes.string,
  subLabel: PropTypes.string,
  value: PropTypes.object,
  name: PropTypes.string,
  inputLabel: PropTypes.string,
  choices: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      addressLine1: PropTypes.string,
      addressLine2: PropTypes.string,
      city: PropTypes.string,
      state: PropTypes.string,
      postcode: PropTypes.string,
    }),
  ),
  onChoose: PropTypes.func,
};

export default Address;
