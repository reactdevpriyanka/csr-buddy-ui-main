import { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { generateItemMap } from '@utils/items';
import Shipment from './Shipment';
import ShipmentItem from './ShipmentItem';

const arrangeShipments = (shipments, itemMap) => {
  const choices = [];
  let shipmentOrdinal = 1;
  for (const shipment of shipments) {
    const items = [];
    for (const shipmentItem of shipment.shipmentItems) {
      const { id, product, disabled = false } = itemMap[shipmentItem.lineItemId];

      const item = {
        id,
        disabled,
        name: product.name || '',
        total: product.totalProduct || '',
        thumbnail: product.thumbnail,
        quantity: `Qty ${shipmentItem.quantity}`,
      };

      items.push(item);
    }
    const { trackingData } = shipment;
    const choice = {
      ordinal: shipmentOrdinal,
      headingText: `Shipment ${shipmentOrdinal} of ${shipments.length}`,
      state: trackingData.shippingStep,
      variant: shipmentOrdinal > 1 ? 'bordered' : 'rounded',
      items,
    };
    choices.push(choice);
    shipmentOrdinal += 1;
  }
  return choices;
};

const ShipmentList = ({
  shipments = [],
  lineItems = [],
  onChoose = () => null,
  value: defaultValue = null,
  orientation = 'HORIZONAL',
  disabled = false,
}) => {
  const [selection, setSelection] = useState(defaultValue);

  const itemMap = useMemo(() => generateItemMap(lineItems), [lineItems]);

  const choices = useMemo(() => arrangeShipments(shipments, itemMap), [shipments, itemMap]);

  const onSelect = useCallback(
    (choice) => {
      setSelection(choice);
      onChoose();
    },
    [setSelection, onChoose],
  );

  return (
    <>
      {choices.map(({ ordinal, headingText, state, items, variant }) => (
        <Shipment key={ordinal} headingText={headingText} state={state} variant={variant}>
          {items.map(({ id, name, total, thumbnail, quantity, disabled: itemDisabled = false }) => (
            <ShipmentItem
              key={id}
              name={name}
              total={total}
              thumbnail={thumbnail}
              quantity={quantity}
              selected={selection && id === selection.id}
              disabled={disabled || itemDisabled}
              onClick={() => onSelect({ id, name, total, thumbnail, quantity })}
            />
          ))}
        </Shipment>
      ))}
      <input
        type="hidden"
        name="currentItem"
        value={selection ? JSON.stringify(itemMap[selection.id]) : ''}
      />
    </>
  );
};

ShipmentList.propTypes = {
  shipments: PropTypes.array,
  lineItems: PropTypes.array,
  onChoose: PropTypes.func,
  value: PropTypes.object,
  orientation: PropTypes.string,
  disabled: PropTypes.bool,
};

export default ShipmentList;
