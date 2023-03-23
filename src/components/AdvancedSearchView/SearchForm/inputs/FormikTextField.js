import PropTypes from 'prop-types';
import cn from 'classnames';
import { TextField, FormHelperText } from '@mui/material';
import { isEqual } from 'lodash';
import formikHOC from './inputHOC';

function FormikTextField({
  autoComplete,
  classes: inputClasses = {},
  className,
  disabled = false,
  fullWidth = true,
  label,
  margin = 'dense',
  name,
  placeholder,
  required,
  startAdornment,
  type = 'text',
  id = `${name}-field`,
  variant = 'outlined',
  multiline = false,
  rows = multiline ? 4 : undefined,
  rowsMax = multiline ? 4 : undefined,
  InputLabelProps,
  testId,
  fieldInputProps,
  fieldMetaProps,
  helperText,
  size = 'small',
}) {
  // const classes = useStyles();
  const classes = {};
  const error = Boolean(fieldMetaProps.touched && fieldMetaProps.error);
  const InputProps = { startAdornment };

  return (
    <>
      <TextField
        size={size}
        id={id}
        autoComplete={autoComplete}
        fullWidth={fullWidth}
        className={cn(
          inputClasses.formControl,
          classes.formControl,
          className,
          inputClasses.textField,
          classes.textField,
        )}
        disabled={disabled}
        error={error}
        margin={margin}
        name={fieldInputProps.name}
        label={label}
        placeholder={placeholder}
        InputProps={InputProps}
        onChange={fieldInputProps.onChange}
        onBlur={fieldInputProps.onBlur}
        type={type}
        required={required}
        value={fieldMetaProps.value}
        variant={variant}
        InputLabelProps={InputLabelProps}
        multiline={multiline}
        rows={rows}
        data-testid={testId ?? id}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      {!fieldMetaProps.error || typeof fieldMetaProps.error !== 'string' ? (
        fieldMetaProps.error
      ) : (
        <FormHelperText error>
          <span>
            {/* Render the label string in place of the field name Formik uses */}
            {fieldMetaProps.error.replace(name, label)}
          </span>
        </FormHelperText>
      )}
    </>
  );
}

FormikTextField.propTypes = {
  autoComplete: PropTypes.string,
  classes: PropTypes.any,
  className: PropTypes.any,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.string,
  margin: PropTypes.oneOf(['dense', 'normal', 'none']),
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  startAdornment: PropTypes.node,
  type: PropTypes.string,
  variant: PropTypes.string,
  InputLabelProps: PropTypes.any,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
  rowsMax: PropTypes.number,
  testId: PropTypes.string,
  fieldInputProps: PropTypes.any,
  fieldMetaProps: PropTypes.any,
  helperText: PropTypes.string,
  size: PropTypes.string,
};

export default formikHOC(FormikTextField, isEqual);
