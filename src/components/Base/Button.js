import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Button as MaterialButton } from '@material-ui/core';
import { useRouter } from 'next/router';
import cn from 'classnames';
import useNavigationContext from '@/hooks/useNavigationContext';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.utils.fromPx(10),
    display: 'flex',
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    padding: `${theme.utils.fromPx(6)} ${theme.utils.fromPx(16)}`,
    color: '#1C49C2',
    marginRight: theme.utils.fromPx(16),
  },
}));

const variants = {
  CONTAINED: 'contained',
  OUTLINE: 'outline',
};

const testId = `gwf-input:button`;

const Button = ({
  required = false,
  label,
  variant,
  onChoose,
  disabled,
  isFormValid,
  hasCancel,
}) => {
  const classes = useStyles();
  const router = useRouter();
  const { prevRoute, resetPrevRoute } = useNavigationContext();

  const handleCancel = () => {
    const { id: customerId } = router.query;
    prevRoute ? router.push(prevRoute) : router.push(`/customers/${customerId}/activity`);
    resetPrevRoute();
  };

  return (
    <div data-testid={testId} className={classes.root}>
      {hasCancel && (
        <MaterialButton
          type="button"
          className={cn(classes.cancelBtn, classes.root)}
          color="secondary"
          variant="text"
          onClick={handleCancel}
        >
          {'Cancel'}
        </MaterialButton>
      )}
      <MaterialButton
        type={required ? 'submit' : 'button'}
        classes={classes}
        color="primary"
        variant={variants[variant]}
        onClick={() => onChoose()}
        disabled={disabled || !isFormValid}
      >
        {label}
      </MaterialButton>
    </div>
  );
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  variant: PropTypes.string,
  onChoose: PropTypes.func,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  isFormValid: PropTypes.bool,
  hasCancel: PropTypes.bool,
};

export default Button;
