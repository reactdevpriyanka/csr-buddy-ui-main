import { useRouter } from 'next/router';
import { renderActivity } from './testUtils';
import OrderActivity from './OrderActivity';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

useRouter.mockReturnValue({
  query: {
    id: '5555',
  },
});

describe('<OrderActivity />', () => {
  const render = renderActivity(OrderActivity, {
    activity: {
      id: '1234',
      orderNumber: '1234',
      orderDate: '12/25/2021',
      total: '123.45',
      itemMap: {},
      status: 'R',
      blocks: [],
      shipments: [],
      notShippedItems: [],
      canceledItems: [],
      updatedItems: [],
      notifications: [],
      trackingData: {},
      timeUpdated: '12/25/2021',
      detailsLink: '1234',
      orderAttributes: [],
      paymentDetails: null,
      returnItems: [],
      shippingAddress: {},
      subscriptionInfos: [],
      cancelReason: null,
    },
  });

  test('it should render an order ID', () => {
    const { getByText } = render();
    expect(getByText('Order #1234')).toBeInTheDocument();
  });
});
