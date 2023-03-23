import { useRef, useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import { useField } from 'formik';

/**
 * The Form management library we are using, Formik, has performance issues espcially
 * when creating large forms with custom input components. Most of this issue comes from
 * the fact that the default behavior is for everything to re-render when a field changes.
 * This HOC provides memoized access to formik's useField api which prevents rerendering
 * more than is needed.
 */

// Wrap useField so as to prevent it from changing its return values
// unnecessarily.
// https://github.com/formium/formik/issues/2268#issuecomment-602135640
function useFieldFast(props) {
  const [field, meta, helpers] = useField(props);

  // Helper shim
  const helperRef = useRef();
  helperRef.current = helpers;

  const helperShim = useRef({
    setValue: (args) => helperRef.current.setValue(args),
    setTouched: (args) => helperRef.current.setTouched(args),
    setError: (args) => helperRef.current.setError(args),
  });

  // Field shim
  const fieldRef = useRef();
  fieldRef.current = field;
  const makeFieldShim = (field) => ({
    ...field,
    onBlur: (args) => fieldRef.current.onBlur(args),
    onChange: (args) => fieldRef.current.onChange(args),
  });

  const fieldShim = useRef(makeFieldShim(field));
  if (
    Object.entries(fieldShim.current).some(([key, value]) => {
      if (key === 'onBlur' || key === 'onChange') return false;
      return value !== field[key];
    })
  ) {
    fieldShim.current = makeFieldShim(field);
  }

  // Meta shim
  const metaShim = useRef({ ...meta });
  if (Object.entries(metaShim.current).some(([key, value]) => value !== meta[key])) {
    metaShim.current = { ...meta };
  }

  return [fieldShim.current, metaShim.current, helperShim.current];
}

// Wrap to give the component access to the useForm properties.
function AccessProvider(props) {
  const [fieldInputProps, fieldMetaProps, fieldHelperProps] = useFieldFast(props.name);
  return useMemo(() => {
    return (
      <props.FieldComponent
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        fieldInputProps={fieldInputProps}
        fieldMetaProps={fieldMetaProps}
        fieldHelperProps={fieldHelperProps}
      />
    );
  }, [props, fieldHelperProps, fieldMetaProps, fieldInputProps]);
}
AccessProvider.propTypes = {
  name: PropTypes.string,
  FieldComponent: PropTypes.any,
};

// Dynamically take the component to be wrapped. The memoFunction
// allows the field components to control which props they should
// actually update for.
export default function formikHOC(FieldComponent, memoFunction) {
  const MemoAccess = memo(AccessProvider, memoFunction);
  return function Wrapper(props) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <MemoAccess FieldComponent={FieldComponent} {...props} />;
  };
}
