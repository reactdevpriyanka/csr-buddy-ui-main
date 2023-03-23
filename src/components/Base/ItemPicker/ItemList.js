import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import ShipmentItem from './ShipmentItem';

const useStyles = makeStyles((theme) => ({
  root: { padding: theme.utils.fromPx(16) },
}));

const ItemList = ({
  lineItems = [],
  onChoose = () => null,
  value: defaultValue = null,
  disabled,
}) => {
  const classes = useStyles();
  const [selection, setSelection] = useState(defaultValue);

  const onSelect = useCallback(
    (choice) => {
      setSelection(choice);
      onChoose();
    },
    [setSelection, onChoose],
  );

  return (
    <div className={classes.root}>
      {lineItems.map((item) => (
        <ShipmentItem
          key={item.id}
          name={item.product.name || ''}
          total={item.product.totalProduct || ''}
          thumbnail={item.product.thumbnail}
          quantity={item.quantity}
          selected={selection && item.id === selection.id}
          disabled={item.disabled || disabled}
          onClick={() => onSelect(item)}
        />
      ))}
      <input type="hidden" name="currentItem" value={selection ? JSON.stringify(selection) : ''} />
    </div>
  );
};

ItemList.propTypes = {
  lineItems: PropTypes.array,
  onChoose: PropTypes.func,
  value: PropTypes.object,
  disabled: PropTypes.bool,
};

export default ItemList;
