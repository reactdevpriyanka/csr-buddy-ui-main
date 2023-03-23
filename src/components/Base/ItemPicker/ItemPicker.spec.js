import { renderWrap } from '@utils';
import { singleShipment, multipleLineItems } from '__mock__/item-picker';
import ItemPicker from './ItemPicker';

describe('<ItemPicker />', () => {
  describe('with shipments', () => {
    const defaultProps = {
      id: 'which-items-had-issues',
      lineItems: singleShipment.lineItems,
      shipments: singleShipment.shipments,
      onChoose: () => null,
    };

    const render = renderWrap(ItemPicker, { defaultProps });

    test('it should not render a label', () => {
      const { queryByText } = render();
      expect(queryByText('Select an item to continue')).not.toBeInTheDocument();
    });

    test('it should render a list of shipments', () => {
      const { getByText } = render();
      expect(getByText('Shipment 1 of 1')).toBeInTheDocument();
    });

    test('it should render lists of items for each shipment', () => {
      const [firstLineItem] = singleShipment.lineItems;
      const { getByText } = render();
      expect(getByText(firstLineItem.product.name)).toBeInTheDocument();
    });
  });

  describe('without shipments', () => {
    const defaultProps = {
      id: 'which-items-had-issues',
      lineItems: singleShipment.lineItems,
      shipments: [],
      onChoose: () => null,
    };

    const render = renderWrap(ItemPicker, { defaultProps });

    test('should not render any shipment text', () => {
      const { queryByText } = render();
      expect(queryByText('Shipment')).not.toBeInTheDocument();
    });

    test('should render the list of items', () => {
      const [item] = singleShipment.lineItems;
      const { getByText } = render();
      expect(getByText(item.product.name)).toBeInTheDocument();
    });
  });

  describe('with multiple line items', () => {
    const defaultProps = {
      id: 'which-items-had-issues',
      lineItems: multipleLineItems.lineItems,
      shipments: multipleLineItems.shipments,
      onChoose: () => null,
    };

    const render = renderWrap(ItemPicker, { defaultProps });

    test('it should render a label', () => {
      const { getByText } = render({ label: 'Select an item to continue' });
      expect(getByText('Select an item to continue')).toBeInTheDocument();
    });

    test('it should render a list of shipments', () => {
      const { getByText } = render();
      expect(getByText('Shipment 1 of 1')).toBeInTheDocument();
    });

    test('it should render lists of items for each shipment', () => {
      const firstLineItem = multipleLineItems.lineItems[0];
      const secondLineItem = multipleLineItems.lineItems[1];
      const thirdLineItem = multipleLineItems.lineItems[2];
      const { getByText } = render();
      expect(getByText(firstLineItem.product.name)).toBeInTheDocument();
      expect(getByText(secondLineItem.product.name)).toBeInTheDocument();
      expect(getByText(thirdLineItem.product.name)).toBeInTheDocument();
    });
  });
});
