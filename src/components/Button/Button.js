/* eslint-disable react/jsx-props-no-spreading */
import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import MaterialButton from '@material-ui/core/Button';
import cn from 'classnames';

const useStyles = makeStyles((theme) => ({
  root: {
    background: 'transparent',
    border: '0.0625rem solid #163977',
    borderRadius: '0.25rem',
    color: '#163977',
    fontWeight: '500',
    fontSize: '0.9rem',
    padding: theme.spacing(0.375, 0.75),
    textTransform: 'none',
    '&:not(:last-child)': {
      marginRight: '0.5rem',
    },
    '&.full': {
      width: '100%',
    },
    '&.solid': {
      color: 'white',
      background: theme.palette.blue.dark,
      '&:hover': {
        background: theme.palette.blue.dark,
        color: 'white',
      },
    },
    '&.solidWhite': {
      color: theme.palette.blue.dark,
      background: 'white',
      '&:hover': {
        background: 'white',
        color: theme.palette.blue.dark,
      },
    },
    '&.disabled': {
      color: 'white',
      background: '#CCCCCC' /** @TODO : theme */,
      border: '0.0625rem solid #CCCCCC',
    },
  },
}));

const Button = forwardRef(
  (
    {
      onClick = () => {},
      children,
      disabled = false,
      full = false,
      solid = false,
      solidWhite = false,
      className,
      ...props
    },
    ref,
  ) => {
    const classes = useStyles();

    const classNameArray = [];

    if (full) classNameArray.push('full');
    if (solid) classNameArray.push('solid');
    if (disabled) classNameArray.push('disabled');
    if (solidWhite) classNameArray.push('solidWhite');

    const combinedClasses = cn(classNameArray.join(' '), className);

    return (
      <MaterialButton
        ref={ref}
        classes={classes}
        onClick={onClick}
        disabled={disabled}
        className={combinedClasses}
        {...props}
      >
        {children}
      </MaterialButton>
    );
  },
);

Button.displayName = 'Button';

Button.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  full: PropTypes.bool,
  solid: PropTypes.bool,
  solidWhite: PropTypes.bool,
  className: PropTypes.string,
};

export default Button;
