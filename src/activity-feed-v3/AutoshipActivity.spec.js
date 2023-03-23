import { useRouter } from 'next/router';
import { renderActivity } from './testUtils';
import AutoshipActivity from './AutoshipActivity';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

useRouter.mockReturnValue({
  query: {
    id: '1234',
  },
  pathname: '/autoship',
});

describe('<AutoshipActivity />', () => {
  const render = renderActivity(AutoshipActivity, {
    activity: {
      action: '',
      status: '',
      cancelDate: null,
      isUpcoming: true,
      frequency: 5,
      fulfillmentFrequency: 5,
      fulfillmentFrequencyUom: 'DAY',
      id: '1234',
      name: 'Some Autoship',
      nextFulfillmentDate: '12/25/2022',
      lastShipmentDate: '12/25/2022',
      paymentDetails: null,
      shippingAddress: null,
      products: [],
    },
  });

  test('it should render the autoship card', () => {
    const { getByText } = render();
    expect(getByText('Upcoming Shipment for "Some Autoship" Autoship')).toBeInTheDocument();
  });
});
