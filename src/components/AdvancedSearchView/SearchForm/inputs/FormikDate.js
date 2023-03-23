import PropTypes from 'prop-types';
import cn from 'classnames';
import { parse } from 'date-fns';
import { FormHelperText } from '@mui/material';
import { KeyboardDatePicker } from '@material-ui/pickers';
import { isEqual } from 'lodash';
import formikHOC from './inputHOC';

const displayDateFormat = 'yyyy-MM-dd';

/**
 * Mimic a SyntheticEvent for Formik
 */
function mimicSyntheticEvent(value, name, formatTime) {
  const eventValue = value ? value + formatTime : null;
  return { target: { value: eventValue, name } };
}

function FormikDate({
  classes: inputClasses = {},
  className,
  disabled = false,
  fullWidth = true,
  label,
  margin = 'dense',
  name,
  // Mirror KeyboardDatePicker defaults
  maxDate = '2100-01-01',
  minDate = '1900-01-01',
  disableFuture,
  disablePast,
  required,
  id = `${name}-field`,
  testId,
  fieldInputProps,
  fieldMetaProps,
  size = 'small',
  formatTime = 'T00:00:00',
}) {
  const classes = {};

  const error = Boolean(fieldMetaProps.error);
  // Parse using the user's local Date() to get a correct timezone
  const date = fieldMetaProps.value
    ? parse(fieldMetaProps.value?.split('T')[0], displayDateFormat, new Date())
    : null;

  /**
   * @param {Date} date new Date value
   * @param {string} string string version of `date` in `format`
   */
  const onChange = (date, string) => {
    fieldInputProps.onChange(mimicSyntheticEvent(string, fieldInputProps.name, formatTime));
  };

  return (
    <>
      <KeyboardDatePicker
        size={size}
        id={id}
        className={cn(
          inputClasses.formControl,
          classes.formControl,
          className,
          inputClasses.textField,
          classes.textField,
        )}
        disabled={disabled}
        error={error}
        name={fieldInputProps.name}
        label={label}
        margin={margin}
        onChange={onChange}
        onBlur={fieldInputProps.onBlur}
        required={required}
        value={date}
        fullWidth={fullWidth}
        autoOk
        disableFuture={disableFuture}
        disablePast={disablePast}
        maxDate={maxDate}
        minDate={minDate}
        // Clear validation messages since we're using Formik/Yup
        maxDateMessage=""
        minDateMessage=""
        invalidDateMessage=""
        variant="inline" // "dialog" for floating popup calendar, "inline" for popover calendar, "static" for in-form calendar
        inputVariant="outlined"
        format={displayDateFormat}
        data-testid={testId ?? id}
      />
      {error && typeof fieldMetaProps.error === 'string' && (
        <FormHelperText error>{fieldMetaProps.error}</FormHelperText>
      )}
    </>
  );
}
FormikDate.propTypes = {
  classes: PropTypes.object,
  className: PropTypes.any,
  name: PropTypes.string.isRequired,
  disabled: PropTypes.any,
  id: PropTypes.string,
  label: PropTypes.string,
  margin: PropTypes.oneOf(['dense', 'normal', 'none']),
  disableFuture: PropTypes.bool,
  disablePast: PropTypes.bool,
  maxDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  minDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  fullWidth: PropTypes.bool,
  required: PropTypes.bool,
  testId: PropTypes.string,
  fieldInputProps: PropTypes.any,
  fieldMetaProps: PropTypes.any,
  size: PropTypes.string,
  formatTime: PropTypes.string,
};

export default formikHOC(FormikDate, isEqual);
