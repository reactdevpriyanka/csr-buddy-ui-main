import { makeStyles } from '@material-ui/core/styles';
import PlusIcon from '@icons/plus.svg';
import MinusIcon from '@icons/minus.svg';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { CircularProgress } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  root: { display: 'flex', alignItems: 'center' },
  selector: {
    width: theme.utils.fromPx(110),
    minHeight: theme.utils.fromPx(44),
    maxHeight: theme.utils.fromPx(44),
    border: `1px solid ${theme.palette.gray[100]}`,
    display: 'flex',
    alignItems: 'center',
    borderRadius: theme.utils.fromPx(32),
    justifyContent: 'space-around',
    padding: `0 ${theme.utils.fromPx(8)}`,
    '& button': {
      padding: `${theme.utils.fromPx(15)} ${theme.utils.fromPx(10)}`,
      backgroundColor: 'transparent',
      border: 'none',
      display: 'flex',
      color: theme.palette.gray.medium,
      cursor: 'pointer',
      '&.disabled': {
        cursor: 'default',
        color: theme.palette.gray[100],
      },
    },
  },
  grayOut: {
    color: theme.palette.gray.light,
  },
  error: {
    border: `1px solid #d32f2f`, // matches the MUI error state
  },
  quantity: {
    padding: `0 ${theme.utils.fromPx(8)}`,
    ...theme.fonts.body.bold,
  },
  totalCount: {
    marginLeft: `${theme.utils.fromPx(10)}`,
    ...theme.fonts.body.bold,
  },
}));

const QuantitySelector = ({ max, onUpdate, error, quantity, isLoading = false }) => {
  const classes = useStyles();

  const handleUpdate = (newQty) => {
    if (newQty <= max && newQty >= 0) {
      onUpdate(newQty);
    }
  };

  return (
    <div className={cn(classes.root)}>
      <div className={cn(classes.selector, { [classes.error]: error })}>
        {isLoading ? (
          <CircularProgress size={24} sx={{ float: 'center', color: '#1C49C2' }} />
        ) : (
          <>
            <button
              onClick={() => handleUpdate(quantity - 1)}
              className={cn({ disabled: quantity === 0 })}
              data-testid="gwf:multi-item-quantity-minus"
            >
              <MinusIcon />
            </button>
            <span className={classes.quantity}>{quantity}</span>
            <button
              onClick={() => handleUpdate(quantity + 1)}
              className={cn({ disabled: quantity === max })}
              data-testid="gwf:multi-item-quantity-plus"
            >
              <PlusIcon />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

QuantitySelector.propTypes = {
  max: PropTypes.number.isRequired,
  onUpdate: PropTypes.func,
  error: PropTypes.bool,
  quantity: PropTypes.number,
  isLoading: PropTypes.bool,
};

export default QuantitySelector;
