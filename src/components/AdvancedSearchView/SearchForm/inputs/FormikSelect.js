import PropTypes from 'prop-types';
import cn from 'classnames';
import { FormHelperText, FormControl, MenuItem, TextField } from '@mui/material';
import { isEqual } from 'lodash';
import formikHOC from './inputHOC';

function FormikSelect({
  classes: inputClasses = {},
  className,
  disabled = false,
  displayEmpty = false,
  fullWidth = true,
  label,
  margin = 'dense',
  name,
  placeholder,
  noSelectionText = <em>{'None'}</em>,
  noSelectionTextDisabled = false,
  required,
  options = [],
  id = `${name}-field`,
  testId,
  fieldInputProps,
  fieldMetaProps,
  onChange,
  size = 'small',
  children = null,
}) {
  const error = Boolean(fieldMetaProps.touched && fieldMetaProps.error);

  let value;
  if (typeof fieldMetaProps.value === 'string' || typeof fieldMetaProps.value === 'undefined') {
    value = fieldMetaProps.value;
  } else {
    const selectedValueIndex = options.findIndex((option) => option.id === fieldMetaProps.value.id);
    value = options[selectedValueIndex] || {};
  }

  const handleChange = (event) => {
    if (onChange) {
      onChange(event);
    }
    fieldInputProps.onChange(event);
  };

  return (
    <FormControl
      variant="outlined"
      fullWidth={fullWidth}
      className={cn(inputClasses.formControl, className)}
      disabled={disabled}
      margin={margin}
      required={required}
    >
      <TextField
        select
        size={size}
        id={id}
        className={cn(inputClasses.textField)}
        disabled={disabled}
        error={error}
        name={fieldInputProps.name}
        label={label}
        placeholder={placeholder}
        onChange={(event) => handleChange(event)}
        onBlur={fieldInputProps.onBlur}
        value={value}
        data-testid={testId ?? id}
      >
        {noSelectionText && (
          <MenuItem value="" disabled={noSelectionTextDisabled}>
            {noSelectionText}
          </MenuItem>
        )}
        {children}
      </TextField>
      {!fieldMetaProps.error || typeof fieldMetaProps.error !== 'string' ? (
        <span>{fieldMetaProps.error}</span>
      ) : (
        <FormHelperText error>
          <span>
            {/* Render the label string in place of the field name Formik uses */}
            {fieldMetaProps.error.replace(name, label)}
          </span>
        </FormHelperText>
      )}
    </FormControl>
  );
}

FormikSelect.propTypes = {
  classes: PropTypes.any,
  className: PropTypes.any,
  disabled: PropTypes.bool,
  displayEmpty: PropTypes.bool,
  fullWidth: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.string,
  margin: PropTypes.oneOf(['dense', 'normal', 'none']),
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  noSelectionText: PropTypes.string,
  noSelectionTextDisabled: PropTypes.bool,
  required: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
  testId: PropTypes.string,
  fieldInputProps: PropTypes.any,
  fieldMetaProps: PropTypes.any,
  onChange: PropTypes.func,
  size: PropTypes.string,
  children: PropTypes.any,
};

export default formikHOC(FormikSelect, isEqual);

// {
//   () => {
//     if (!fieldMetaProps.error || typeof fieldMetaProps.error !== 'string') {
//       return fieldMetaProps.error;
//     }
//     return (
//       <FormHelperText error>
//         <span>
//           {/* Render the label string in place of the field name Formik uses */}
//           {fieldMetaProps.error.replace(name, label)}
//         </span>
//       </FormHelperText>
//     );
//   }
// }
