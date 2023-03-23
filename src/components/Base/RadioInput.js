/* eslint-disable react/jsx-props-no-spreading */
// import cn from 'classnames';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.utils.fromPx(20),
  },
  label: {
    fontSize: theme.fonts.size.md,
    color: theme.palette.gray.medium,
    fontWeight: '500',
    marginBottom: theme.spacing(0.5),
  },
}));

const testId = `gwf-input:radio`;

const RadioInput = ({ title, name, choices, value, disabled = false, onChoose }) => {
  const classes = useStyles();

  return (
    <div data-testid={testId} className={classes.root}>
      <FormControl component="fieldset" data-testid={`${testId}:control`}>
        <FormLabel component="legend" className={classes.label} data-testid={`${testId}:label`}>
          {title}
        </FormLabel>
        <RadioGroup
          aria-label={title}
          name={name}
          value={value}
          data-testid={`${testId}:input-group`}
        >
          {choices.map((choice) => (
            <FormControlLabel
              data-testid={`${testId}:input-${choice.value}`}
              key={choice.value}
              value={choice.value}
              disabled={disabled}
              control={<Radio color="primary" />}
              label={choice.label}
              onChange={() => onChoose(choice.outcomeId)}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </div>
  );
};

RadioInput.propTypes = {
  title: PropTypes.string,
  value: PropTypes.any,
  name: PropTypes.string,
  choices: PropTypes.array,
  onChoose: PropTypes.func,
  disabled: PropTypes.bool,
};

export default RadioInput;
