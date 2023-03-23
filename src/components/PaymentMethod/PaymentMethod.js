import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import cn from 'classnames';

export const IconPosition = { END: Symbol.for('END'), START: Symbol.for('START') };

const useStyles = makeStyles((theme) => ({
  iconStart: {
    marginLeft: theme.spacing(0.25),
  },
  iconEnd: {
    marginRight: theme.spacing(0.25),
  },
}));

const PaymentMethod = ({ icon, children, iconPosition = IconPosition.END, className }) => {
  const classes = useStyles();
  return (
    <li>
      {iconPosition === IconPosition.START && (
        <figure data-testid="payment-method:icon" className={className}>
          {icon}
        </figure>
      )}
      {children && (
        <span
          className={cn({
            [classes.iconStart]: icon && iconPosition === IconPosition.START,
            [classes.iconEnd]: icon && iconPosition === IconPosition.END,
          })}
          data-testid="payment-method:label"
        >
          {children}
        </span>
      )}
      {iconPosition === IconPosition.END && (
        <figure data-testid="payment-method:icon" className={className}>
          {icon}
        </figure>
      )}
    </li>
  );
};

PaymentMethod.propTypes = {
  icon: PropTypes.node,
  children: PropTypes.node,
  iconPosition: PropTypes.oneOf([IconPosition.END, IconPosition.START]),
  className: PropTypes.string,
};

export default PaymentMethod;
