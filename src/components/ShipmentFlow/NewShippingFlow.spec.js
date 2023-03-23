import { renderWrap } from '@/utils';
import NewShippingFlow from './NewShippingFlow';

const defaultProps = {
  orderCanceled: false,
  ordinal: 0,
  released: false,
  status: 'RELEASED',
  statusText: 'ON_TIME',
  step: 'PACKING_ITEMS',
  trackingId: '123456',
  total: 0,
};

describe('<NewShippingFlow />', () => {
  const render = renderWrap(NewShippingFlow, {
    defaultProps,
  });
  test('it should render tracking status', () => {
    const { getByText } = render();
    expect(getByText('Tracking Status:')).toBeInTheDocument();
  });

  test(`it should render estimated delivery when order status is not DELIVERED`, () => {
    const { getByText } = render();
    expect(getByText('Estimated Delivery:')).toBeInTheDocument();
  });

  describe(`buttons`, () => {
    test(`it should render 'Track Package' button`, () => {
      const { getByTestId } = render();
      expect(getByTestId(`shipping-flow-track-package`)).toBeTruthy();
    });
    test(`'Track Package' button should be disabled`, () => {
      const { getByTestId } = render();
      expect(getByTestId(`shipping-flow-track-package`)).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe(`it should render Pending Shipment for Released package status`, () => {
    const render = renderWrap(NewShippingFlow, {
      defaultProps,
    });

    test('it should render tracking status', () => {
      const { getByText } = render();
      expect(getByText('Pending Shipment')).toBeInTheDocument();
    });
  });
});
