import { makeStyles } from '@material-ui/core/styles';
import PlusIcon from '@icons/plus.svg';
import MinusIcon from '@icons/minus.svg';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { useContext, useEffect, useState, useRef, useMemo } from 'react';
import { ReplaceRefundContext } from '../ReplaceRefund/ReplaceRefundTable';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    '&.start': {
      justifyContent: 'start',
    },
    '&.center': {
      justifyContent: 'center',
    },
    '&.end': {
      justifyContent: 'end',
    },
  },
  selector: {
    width: theme.utils.fromPx(110),
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

const QuantitySelector = ({
  itemId,
  max,
  onUpdate,
  error,
  initialQuantity,
  outOfStock,
  discontinued,
  returnType,
  showTotalCount = true,
  justifyContent = 'center',
  availability,
}) => {
  const classes = useStyles();
  const [currentQty, setCurrentQty] = useState(initialQuantity || 0);
  const { allSelected } = useContext(ReplaceRefundContext) || {};

  const selectAllClicked = useRef(false);

  const handleUpdate = (newQty) => {
    if (newQty <= max && newQty >= 0) {
      setCurrentQty(newQty);
      onUpdate(newQty);
    }
  };

  useEffect(() => {
    if (allSelected) {
      selectAllClicked.current = true;
      handleUpdate(refundNotAllowed ? 0 : max);
      /* We only want to reset if the Select All
      button has actually been clicked, not on
      initial load */
    } else if (selectAllClicked.current) {
      handleUpdate(0);
    }
  }, [allSelected]);

  const refundNotAllowed = useMemo(() => {
    return (
      returnType === 'REPLACEMENT' &&
      (availability ? availability?.quantityAvailable - max < 0 : false)
    );
  }, [availability, max, returnType]);

  return (
    <div
      className={cn(classes.root, justifyContent, { [classes.grayOut]: allSelected || outOfStock })}
    >
      <div className={cn(classes.selector, { [classes.error]: error })}>
        <button
          disabled={allSelected || refundNotAllowed}
          onClick={() => handleUpdate(currentQty - 1)}
          className={cn({ disabled: currentQty === 0 || allSelected || refundNotAllowed })}
          data-testid={`gwf:multi-item-quantity-minus:${itemId}`}
        >
          <MinusIcon />
        </button>
        <span className={classes.quantity}>{currentQty}</span>
        <button
          disabled={allSelected || refundNotAllowed}
          onClick={() => handleUpdate(currentQty + 1)}
          className={cn({ disabled: currentQty >= max || allSelected || refundNotAllowed })}
          data-testid={`gwf:multi-item-quantity-plus:${itemId}`}
        >
          <PlusIcon />
        </button>
      </div>
      {showTotalCount && <span className={classes.totalCount}>of {max}</span>}
    </div>
  );
};

QuantitySelector.propTypes = {
  itemId: PropTypes.string,
  max: PropTypes.number.isRequired,
  onUpdate: PropTypes.func,
  error: PropTypes.bool,
  initialQuantity: PropTypes.number,
  discontinued: PropTypes.bool,
  outOfStock: PropTypes.bool,
  returnType: PropTypes.string,
  showTotalCount: PropTypes.bool,
  justifyContent: PropTypes.string,
  availability: PropTypes.object,
};

export default QuantitySelector;
