import { renderWrap } from '@/utils';
import ShippingFlow from './ShippingFlow';

const stepLabels = {
  PENDING: 'Pending',
  ORDER_PLACED: 'Order Placed',
  PACKING_ITEMS: 'Packing Items',
  IN_TRANSIT: 'In-Transit',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
};
const defaultProps = {
  shipper: 'FDXHD',
  step: 'IN_TRANSIT',
  statusText: 'ON TIME',
  orderNumber: '123',
  trackingLink: '/orders/123/shipments',
  issueLink: '/orders/123/issues',
};
describe('<ShippingFlow />', () => {
  const render = renderWrap(ShippingFlow, {
    defaultProps,
  });

  test('it should render 5 shipping steps', () => {
    const { container } = render();
    const elements = container.querySelectorAll('[data-testid="shipping-flow-step"]');
    expect(elements).toHaveLength(5);
  });

  ['ORDER_PLACED', 'PACKING_ITEMS', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].map((step) =>
    test(`it should render ${step} step`, () => {
      const { getByLabelText } = render();
      expect(getByLabelText(stepLabels[step])).toBeTruthy();
    }),
  );

  [
    ['PENDING', 1],
    ['ORDER_PLACED', 1],
    ['PACKING_ITEMS', 2],
    ['IN_TRANSIT', 3],
    ['OUT_FOR_DELIVERY', 4],
    ['DELIVERED', 5],
  ].map(([step, complete]) =>
    describe(`with step = ${step}`, () => {
      test(`it should render ${complete} complete steps`, () => {
        const { container } = render({ step });
        const elements = container.querySelectorAll('[aria-checked="true"]');
        expect(elements).toHaveLength(complete);
      });

      test(`it should render ${5 - complete} incomplete steps`, () => {
        const { container } = render({ step });
        const elements = container.querySelectorAll('[aria-checked="false"]');
        expect(elements).toHaveLength(5 - complete);
      });
    }),
  );
  test(`it should render a company logo`, () => {
    const { getByTestId } = render();
    expect(getByTestId(`shipping-flow-logo`)).toBeTruthy();
  });
  ['ORDER_PLACED', 'PACKING_ITEMS', 'PENDING'].map((step) =>
    test(`it should render Chewy Logo in steps preceeding to 'In Transit'`, () => {
      const { getByTestId } = render({ step });
      expect(getByTestId(`shipping-flow-chewy-logo`)).toBeTruthy();
    }),
  );
  ['IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].map((step) =>
    test(`it should render Shipper Logo in steps subsequent to 'Packing Items'`, () => {
      const { getByTestId } = render({ step });
      expect(getByTestId(`shipping-flow-shipper-logo`)).toBeTruthy();
    }),
  );

  describe(`buttons`, () => {
    test(`it should render 'Track Package' button`, () => {
      const { getByTestId } = render();
      expect(getByTestId(`shipping-flow-track-package`)).toBeTruthy();
    });

    ['ORDER_PLACED', 'PACKING_ITEMS', 'PENDING'].map((step) =>
      test(`'Track Package' button should be disabled in step ${step}`, () => {
        const { getByTestId } = render({ step });
        expect(getByTestId(`shipping-flow-track-package`)).toHaveAttribute('aria-disabled', 'true');
      }),
    );
    ['IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].map((step) =>
      test(`'Track Package' button should not be disabled in step ${step}`, () => {
        const { getByTestId } = render({ step });
        expect(getByTestId(`shipping-flow-track-package`)).toHaveAttribute(
          'aria-disabled',
          'false',
        );
      }),
    );
  });
});
