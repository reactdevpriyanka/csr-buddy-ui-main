/* eslint-disable react/jsx-props-no-spreading */
// import cn from 'classnames';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.utils.fromPx(20),
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

const testId = `gwf-input:radio`;

const generateLabel = (choice) => {
  let label = '';
  if (choice.label) label += choice.label;
  if (choice.subLabel) label += ` ${choice.subLabel}`;
  return label;
};

const MultipleChoice = ({
  id = '',
  parentId,
  name = '',
  title = '',
  label = '',
  subLabel = '',
  choices = [],
  onChoose = () => null,
  value: defaultValue = '',
  required = false,
  disabled = false,
}) => {
  const classes = useStyles();

  const [value, setValue] = useState(
    defaultValue !== null && defaultValue.value ? defaultValue.value : defaultValue,
  );

  return (
    <div data-testid={testId} className={classes.root}>
      <FormControl component="fieldset" data-testid={`${testId}:control`}>
        <FormLabel component="legend" className={classes.title} data-testid={`${testId}:label`}>
          {title}
        </FormLabel>
        {label && <span className={classes.label}>{label}</span>}
        {subLabel && <span className={classes.subLabel}>{subLabel}</span>}
        <RadioGroup
          aria-label={title}
          name={name}
          data-testid={`${testId}:input-group`}
          value={value}
          required={required}
        >
          {choices.map((choice) => (
            <FormControlLabel
              data-testid={`${testId}:input-${choice.value}`}
              key={choice.value}
              value={choice.value}
              checked={value !== null && value.toString() === choice.value.toString()}
              disabled={disabled || choice?.disabled || false}
              control={<Radio color="primary" />}
              label={generateLabel(choice)}
              onChange={(event) => {
                setValue(event.target.value);
                onChoose(choice.outcomeId);
              }}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </div>
  );
};

MultipleChoice.propTypes = {
  id: PropTypes.string,
  parentId: PropTypes.string,
  title: PropTypes.string,
  label: PropTypes.string,
  subLabel: PropTypes.string,
  name: PropTypes.string,
  choices: PropTypes.array,
  onChoose: PropTypes.func,
  value: PropTypes.any,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default MultipleChoice;
