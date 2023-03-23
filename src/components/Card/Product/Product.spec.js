import { act, fireEvent, within } from '@testing-library/react';
import { renderWrap } from '@utils';
import { LINE_ITEM_ATTRIBUTE } from '@/components/Order/utils';
import Product from './Product';

const mockReduceItemQuantity = jest.fn();

jest.mock('@/hooks/useAllowableActions', () => {
  return () => ({
    isActionAllowed: () => true,
  });
});

jest.mock('@/hooks/useOrder', () => {
  return () => {
    return {
      removeQty: mockReduceItemQuantity,
    };
  };
});

window.bttUT = {
  start: jest.fn(),
  end: jest.fn(),
};

jest.mock('@/hooks/useAgentInteractions');
jest.mock('@/hooks/useEnactment');

const defaultProps = {
  thumbnail: 'http://placehold.it/300x300',
  title: 'Bonkers! Bacon Strips for Dogs',
  price: '12.99',
  quantity: '10',
  orderNumber: '12345',
  externalId: '123',
  catalogEntryId: '789',
  id: '456',
  partNumber: '789',
  personalizationAttributes: {
    ScheduledDate: '2023-02-06',
    Message: 'Enjoy your Chewy eGift Card!',
    RecipientEmail: 'a@a.com',
  },
  returns: [
    {
      returnId: 'returnid',
      lineItemId: 'itemid',
      type: 'REPLACEMENT',
      state: 'PROCESSED',
      reasonCategory: 'DAMAGED',
    },
    {
      returnId: 'returnid',
      lineItemId: 'itemid',
      type: 'REFUND',
      state: 'PAY_WAIT',
      reasonCategory: 'DOES_NOT_WANT',
    },
    {
      returnId: 'returnid',
      lineItemId: 'itemid',
      type: 'SHIPPING_CONCESSION',
      state: 'FAILED',
      reasonCategory: 'DEFECTIVE',
    },
    {
      returnId: 'returnid',
      lineItemId: 'itemid',
      type: 'PRODUCT_CONCESSION',
      state: 'CANCELED',
      reasonCategory: 'DAMAGED',
    },
    {
      returnId: 'returnid',
      lineItemId: 'itemid',
      type: 'UNKNOWN_TYPE',
      state: 'UNKNOWN_STATE',
      reasonCategory: 'UNKNOWN',
    },
  ],
};

describe('<Product />', () => {
  const render = (props = {}) =>
    renderWrap(Product, { testId: 'card:product', defaultProps: { ...defaultProps, ...props } })();

  const elements = [
    ['thumbnail', 'product:thumbnail', ''],
    ['title', 'product:title', 'Bonkers! Bacon Strips for Dogs'],
    ['quantity', 'product:qty', 'Qty 1'],
    ['price', 'product:price', '$12.99'],
  ];

  for (const [attr, testId, textContent] of elements) {
    test(`it should render a ${attr}`, () => {
      const { getByTestId } = render();
      const product = getByTestId('card:product:456');
      const el = getByTestId(testId);
      expect(product).toContainElement(el);
      expect(el).toBeInTheDocument();

      // Had to do this because the image doesn't contain content and Jest complained
      if (attr !== 'thumbnail') {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(el).toHaveTextContent(textContent);
      }
    });
  }

  describe('It should render return items', () => {
    test(`returnid-REPLACEMENT should render Replacement Completed`, () => {
      const { getByTestId } = render();
      const returnObj = getByTestId(`product:return:pill:returnid-REPLACEMENT`);
      expect(returnObj).toBeInTheDocument();
      expect(returnObj).toHaveTextContent('REPLACEMENT COMPLETED');
    });

    test(`returnid-REFUND should render Refund Pending`, () => {
      const { getByTestId } = render();
      const returnObj = getByTestId(`product:return:pill:returnid-REFUND`);
      expect(returnObj).toBeInTheDocument();
      expect(returnObj).toHaveTextContent('REFUND PENDING');
    });

    test(`returnid-SHIPPING_CONCESSION should render Shipping Concession Failed`, () => {
      const { getByTestId } = render();
      const returnObj = getByTestId(`product:return:pill:returnid-SHIPPING_CONCESSION`);
      expect(returnObj).toBeInTheDocument();
      expect(returnObj).toHaveTextContent('SHIPPING CONCESSION FAILED');
    });

    test(`returnid-PRODUCT_CONCESSION should render Concession Canceled`, () => {
      const { getByTestId } = render();
      const returnObj = getByTestId(`product:return:pill:returnid-PRODUCT_CONCESSION`);
      expect(returnObj).toBeInTheDocument();
      expect(returnObj).toHaveTextContent('CONCESSION CANCELED');
    });

    test(`returnid-UNKNOWN_TYPE should render UNKNOWN TYPE UNKNOWN STATE (unknown type/state fallthrough)`, () => {
      const { getByTestId } = render();
      const returnObj = getByTestId(`product:return:pill:returnid-UNKNOWN_TYPE`);
      expect(returnObj).toBeInTheDocument();
      expect(returnObj).toHaveTextContent('UNKNOWN TYPE UNKNOWN STATE');
    });

    test(`return render item link`, () => {
      const { getByTestId } = render();
      const LinkObj = getByTestId(`product:catalogEntryId:link:456`);
      expect(LinkObj).toBeInTheDocument();
      expect(LinkObj).toHaveTextContent('ITEM #789');
    });
  });

  describe('edit actions', () => {
    beforeEach(() => {
      mockReduceItemQuantity.mockReset();
    });

    test('should render the quantity selector when quanity is updatable', () => {
      const { queryByTestId } = render({ lineItemAttributes: [LINE_ITEM_ATTRIBUTE.QTY_REDUCIBLE] });
      expect(queryByTestId('product:qty-update-select')).toBeInTheDocument();
    });

    test('should render the remove button when item is removable', () => {
      const { queryByTestId } = render({ lineItemAttributes: [LINE_ITEM_ATTRIBUTE.CANCELLABLE] });
      expect(queryByTestId('product:remove-button')).toBeInTheDocument();
    });

    test('should update the item quantity on select change', async () => {
      const { getByTestId, getByText } = render({
        lineItemAttributes: [LINE_ITEM_ATTRIBUTE.QTY_REDUCIBLE],
      });
      const newQuantity = 5;
      const select = getByTestId('product:qty-update-select');
      fireEvent.mouseDown(within(select).getByRole('button'));
      const option = getByText(`${newQuantity}`);
      fireEvent.click(option);

      await act(() => Promise.resolve());

      expect(mockReduceItemQuantity).toHaveBeenCalledWith({
        itemId: defaultProps.externalId,
        orderId: defaultProps.orderNumber,
        quantity: defaultProps.quantity - newQuantity,
      });
    });

    test('should remove item on remove button click', async () => {
      const { getByTestId, queryByTestId } = render({
        lineItemAttributes: [LINE_ITEM_ATTRIBUTE.CANCELLABLE],
      });

      fireEvent.click(getByTestId('product:remove-button'));

      const confirmRemove = queryByTestId('product:confirm-remove');
      expect(confirmRemove).toBeInTheDocument();

      fireEvent.click(confirmRemove);

      await act(() => Promise.resolve());

      expect(mockReduceItemQuantity).toHaveBeenCalledWith({
        itemId: defaultProps.externalId,
        orderId: defaultProps.orderNumber,
        quantity: defaultProps.quantity,
      });
    });
  });
});
