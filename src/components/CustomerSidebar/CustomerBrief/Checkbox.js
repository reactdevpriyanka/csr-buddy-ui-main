import PropTypes from 'prop-types';
import { Typography, Checkbox as MaterialCheckbox, FormLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {},
  checkbox: {
    paddingLeft: 0,
  },
  label: {
    color: theme.palette.gray.medium,
    fontSize: theme.utils.fromPx(14),
  },
  description: {
    fontSize: theme.utils.fromPx(14),
    paddingLeft: theme.utils.fromPx(33),
  },
}));

const Checkbox = ({ checked = false, description, displayName, name, onChange }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <MaterialCheckbox
        checked={checked}
        onChange={onChange}
        name={name}
        id={`option-${name}`}
        className={classes.checkbox}
      />
      <FormLabel className={classes.label} htmlFor={`option-${name}`}>
        {displayName}
      </FormLabel>
      {description && <Typography className={classes.description}>{description}</Typography>}
    </div>
  );
};

Checkbox.propTypes = {
  checked: PropTypes.bool,
  description: PropTypes.string,
  displayName: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
};

export default Checkbox;
