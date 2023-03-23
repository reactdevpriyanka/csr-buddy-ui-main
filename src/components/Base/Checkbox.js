/* eslint-disable react/jsx-props-no-spreading */
// import cn from 'classnames';
import { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Checkbox, FormControlLabel } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.utils.fromPx(20),
    '& .MuiCheckbox-root': {
      borderRadius: theme.utils.fromPx(4),
    },
    '& .MuiCheckbox-colorPrimary.Mui-checked': {
      color: '#1C49C2',
    },
  },
  label: { marginBottom: theme.spacing(0.5) },
  checkBox: {
    ...theme.utils.checkBox,
  },
}));

const testId = `gwf-input:checkbox`;

const CheckboxNode = ({
  name,
  label,
  onChoose,
  value: defaultValue = false,
  required = false,
  disabled = false,
}) => {
  const classes = useStyles();

  const [checked, setChecked] = useState(defaultValue);

  const onChange = useCallback(() => {
    setChecked(!checked);
    onChoose();
  }, [checked, setChecked, onChoose]);

  /**
   * Always load next outcome for a checkbox even if it is marked "required = true".
   */
  useEffect(() => {
    if (required) {
      onChoose();
    }
  }, [onChoose, required]);

  return (
    <div data-testid={testId} className={classes.root}>
      <FormControlLabel
        control={
          <Checkbox
            onChange={onChange}
            name={name}
            color="primary"
            checked={checked}
            value={checked}
            required={required}
            disabled={disabled}
            className={classes.checkBox}
          />
        }
        label={label}
      />
    </div>
  );
};

CheckboxNode.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string.isRequired,
  onChoose: PropTypes.func,
  value: PropTypes.bool,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default CheckboxNode;
