import { renderWrap } from '@/utils';
import { generateItemMap } from '@utils/items';
import mockActivity from '__mock__/activities/order';
import { useRouter } from 'next/router';
import { fireEvent, within } from '@testing-library/react';
import PaymentDetails from '@components/PaymentDetails';
import * as features from '@/features';
import * as allowableActionsHook from '@/hooks/useAllowableActions';
import mockOrderWithSpreadItems from '__mock__/activities/order-shipments-with-spread-items+returns';
import Order from './Order';

jest.mock('axios', () => {
  return {
    create: () => {
      return { defaults: {}, interceptors: { request: { use: () => {} } } };
    },
  };
});

window.bttUT = {
  start: jest.fn(),
  end: jest.fn(),
};

const pushHandler = jest.fn();

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

let activity = { ...mockActivity };
const {
  data: {
    order,
    order: {
      payments: { paymentInstructions },
    },
  },
} = mockActivity;

useRouter.mockImplementation(() => {
  return {
    query: { id: customerId },
    push: pushHandler,
  };
});

const mockAllowedActions = jest.spyOn(allowableActionsHook, 'default');

const itemMap = generateItemMap(order.lineItems);

const customerId = 123123;

const defaultProps = {
  status: 'READY_TO_RELEASE',
  orderNumber: order.id,
  orderDate: activity.createdAt.toString(),
  paymentDetails: <PaymentDetails details={paymentInstructions?.map((p) => p.paymentMethod)} />,
  shipments: order.shipments,
  itemMap,
  detailsLink: `/order/${order.id}`,
  total: '10.00',
};

describe('<Order />', () => {
  const render = (props = {}) =>
    renderWrap(Order, { defaultProps: { ...defaultProps, ...props } })();

  afterEach(() => {
    pushHandler.mockClear();
    mockAllowedActions.mockClear();
  });

  test('it should render an order with 1 shipment and 4 items awaiting shipment', () => {
    jest.spyOn(features, 'useFeature').mockImplementation(() => true);
    const { getByTestId } = render();
    expect(getByTestId(`order:shipment-418803177`)).toBeInTheDocument();
  });

  test('it should render the Activity Header', () => {
    jest.spyOn(features, 'useFeature').mockImplementation(() => true);
    const { getByTestId } = render();
    expect(getByTestId(`card:activity-header`)).toBeInTheDocument();
  });

  test('it should render an order with 4 items awaiting shipment', () => {
    jest.spyOn(features, 'useFeature').mockImplementation(() => true);
    const { getByTestId } = render({ notShippedItems: order.notShippedItems });
    expect(getByTestId(`order:awaiting-shipment`)).toBeInTheDocument();
    const itemsAwaitingShipment = getByTestId(`order:awaiting-shipment`);
    expect(itemsAwaitingShipment).toBeInTheDocument();
    expect(within(itemsAwaitingShipment).getByTestId(`card:product:1463283944`)).toBeTruthy();
    expect(within(itemsAwaitingShipment).getByTestId(`card:product:1463283945`)).toBeTruthy();
    expect(within(itemsAwaitingShipment).getByTestId(`card:product:1463283946`)).toBeTruthy();
    expect(within(itemsAwaitingShipment).getByTestId(`card:product:1463283947`)).toBeTruthy();
  });

  test('it should render order blocks', () => {
    jest.spyOn(features, 'useFeature').mockImplementation(() => true);
    const { getByTestId } = render({ blocks: order.blocks });
    expect(getByTestId(`order:blocks`)).toBeTruthy();
  });

  test('it should render canceled items', () => {
    jest.spyOn(features, 'useFeature').mockImplementation(() => true);
    const { getByTestId } = render({ canceledItems: order.canceledItems });
    expect(getByTestId(`order:canceled-items`)).toBeTruthy();
  });

  // TODO: find an emaple of an order that has order notifications

  test('it should render order update items', () => {
    jest.spyOn(features, 'useFeature').mockImplementation(() => true);
    const { getByTestId } = render({ updatedItems: order.updatedItems });
    expect(getByTestId(`order:updated-items`)).toBeTruthy();
  });

  test('should render payment details', () => {
    jest.spyOn(features, 'useFeature').mockImplementation(() => true);
    const { queryByText } = render();
    expect(queryByText('Sumit Singh')).toBeInTheDocument();
    expect(queryByText('AMEX ending in 1347')).toBeInTheDocument();
  });

  test('should only display the Fix Issue button when not editable', () => {
    mockAllowedActions.mockReturnValue({ isActionAllowed: () => true });
    jest.spyOn(features, 'useFeature').mockImplementation(() => false);
    const { queryByText } = render();
    expect(queryByText('Fix Issue')).toBeInTheDocument();
    expect(queryByText('Manage Order')).not.toBeInTheDocument();
  });

  test('should only display Manage Order menu when editable', () => {
    mockAllowedActions.mockReturnValue({ isActionAllowed: () => false });
    jest.spyOn(features, 'useFeature').mockImplementation(() => false);
    const { queryByText } = render();
    expect(queryByText('Manage Order')).toBeInTheDocument();
    expect(queryByText('Fix Issue')).not.toBeInTheDocument();
  });

  test('should navigate to the gwf on Fix Issue click', () => {
    mockAllowedActions.mockReturnValue({ isActionAllowed: () => true });
    jest.spyOn(features, 'useFeature').mockImplementation(() => false);
    const { queryByText } = render();
    fireEvent.click(queryByText('Fix Issue'));
    expect(pushHandler).toHaveBeenCalledWith(
      `/customers/${customerId}/workflows/fixIssue-start/${defaultProps.orderNumber}`,
    );
  });

  test('should show a snackbar message when order total is $0 and Fix Issue is clicked', () => {
    jest.spyOn(features, 'useFeature').mockImplementation(() => false);
    const { queryByText } = render({ total: '0' });
    fireEvent.click(queryByText('Fix Issue'));
    expect(pushHandler).not.toHaveBeenCalled();
    expect(queryByText('To Fix Issue use the original order')).toBeInTheDocument();
  });

  test('should navigate to the gwf on Fix Issue click - Do not display a Toast Notification', () => {
    jest.spyOn(features, 'useFeature').mockImplementation(() => false);
    const { queryByText } = render({ status: 'Shipped' });
    fireEvent.click(queryByText('Fix Issue'));
    expect(pushHandler).toHaveBeenCalledWith(
      `/customers/${customerId}/workflows/fixIssue-start/${defaultProps.orderNumber}`,
    );
  });

  test('Do not display a Toast Notification for Deposited Order status', () => {
    jest.spyOn(features, 'useFeature').mockImplementation(() => false);
    const { queryByText } = render({ status: 'Deposited' });
    fireEvent.click(queryByText('Fix Issue'));
    expect(pushHandler).toHaveBeenCalledWith(
      `/customers/${customerId}/workflows/fixIssue-start/${defaultProps.orderNumber}`,
    );
  });

  test('should show a snackbar message when Fix Issue is clicked for order with no shipments', () => {
    jest.spyOn(features, 'useFeature').mockImplementation(() => false);
    const { queryByText } = render({ shipments: [] });
    fireEvent.click(queryByText('Fix Issue'));
    expect(pushHandler).not.toHaveBeenCalled();
    expect(queryByText('Unable to Fix Issue. Item(s) status is not shipped')).toBeInTheDocument();
  });

  test('should render the new manage order button', () => {
    jest.spyOn(features, 'useFeature').mockImplementation(() => true);
    const { getByTestId } = render();
    expect(getByTestId(`order-actions-button:${defaultProps.orderNumber}`)).toBeInTheDocument();
  });

  describe('when an order has multiple shipments with the same item in them', () => {
    const spreadItemsOrder = {
      ...mockOrderWithSpreadItems,
    };
    const orderWithSpreadItemsRender = (props = {}) =>
      renderWrap(Order, { defaultProps: { ...spreadItemsOrder, ...props } })();

    test('it should display an order with line items spread across shipments with only 1 return', () => {
      jest.spyOn(features, 'useFeature').mockImplementation(() => true);
      const { getAllByTestId, getByTestId } = orderWithSpreadItemsRender();
      expect(getByTestId(`order:shipment-626430533`)).toBeInTheDocument();
      expect(getByTestId(`order:shipment-626430536`)).toBeInTheDocument();
      expect(getByTestId(`order:shipment-626430537`)).toBeInTheDocument();
      expect(getByTestId(`order:shipment-626430540`)).toBeInTheDocument();
      expect(
        getAllByTestId(`product:return:pill:06f81094-7215-40be-9572-7f670f91e304-REFUND`),
      ).toHaveLength(1);
    });
  });
});
