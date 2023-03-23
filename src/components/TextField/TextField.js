import PropTypes from 'prop-types';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import MaterialTextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  root: {
    '&:not(:last-child)': {
      marginBottom: theme.spacing(1.5),
    },
    border: 0,
    '& .MuiOutlinedInput-adornedEnd': {
      paddingRight: '0px',
    },
  },
  label: {
    display: 'block',
    fontFamily: 'Roboto',
    fontSize: '12px',
    lineHeight: '16px',
    textTransform: 'uppercase',
    color: theme.palette.gray.light,
  },
  textField: {
    marginTop: '0.25rem',
    width: '100%',
    '& .Mui-disabled': {
      color: theme.palette.black,
      backgroundColor: '#F2F2F2',
    },
  },
  inputOutlined: {
    color: theme.palette.black,
    backgroundColor: theme.palette.common.white,
    '&.Mui-disabled': {
      //todo discuss moving to theme
      color: theme.palette.black,
      backgroundColor: '#F2F2F2',
    },
  },
  '&.MuiOutlinedInput-root input': {
    padding: '6px 0 7px', //copied from .MuiInputBase-input testAbstraction
  },
}));

const TextField = ({
  id,
  label,
  name,
  className = '',
  inputClassName = '',
  disabled = false,
  required = false,
  value = '',
  type = 'text',
  onChange = () => {},
  color = 'secondary',
  ...props
}) => {
  const classes = useStyles();

  return (
    <div className={cn(classes.root, className)}>
      <label className={classes.label} htmlFor={id}>
        {label}
      </label>
      <MaterialTextField
        variant="outlined"
        color={color}
        className={classes.textField}
        label=""
        inputProps={{ 'aria-label': name }}
        InputProps={{ className: cn(classes.inputOutlined, inputClassName) }}
        data-testid={props['data-testid']}
        disabled={disabled}
        id={id}
        name={name}
        type={type}
        defaultValue={value}
        required={required}
        onChange={onChange}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      />
    </div>
  );
};

TextField.propTypes = {
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  color: PropTypes.string,
  'data-testid': PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  required: PropTypes.bool,
  onChange: PropTypes.func,
  type: PropTypes.oneOf([
    'text',
    'password',
    'date',
    'datetime-local',
    'email',
    'search',
    'tel',
    'url',
  ]),
};

export default TextField;
