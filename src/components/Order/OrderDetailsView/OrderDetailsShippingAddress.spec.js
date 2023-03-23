import { renderWrap } from '@/utils';
import orderDetailsViewData from '__mock__/orderdetails/orderdetailsview';
import OrderDetailsShippingAddress from './OrderDetailsShippingAddress';

describe('<OrderDetailsShippingAddress />', () => {
  const defaultProps = {
    ...orderDetailsViewData,
    isActionAllowed: () => true,
  };

  const render = renderWrap(OrderDetailsShippingAddress, { defaultProps });

  test('it should render children', () => {
    expect(render()).toMatchSnapshot();
  });

  test('it should render update address link', () => {
    const { getByTestId } = render();
    expect(getByTestId(`orderDetailsShippingAddress:update`)).toBeTruthy();
  });

  describe('when isActionAllowed equals false', () => {
    const defaultProps = {
      ...orderDetailsViewData,
      isActionAllowed: () => false,
    };

    const render = renderWrap(OrderDetailsShippingAddress, { defaultProps });

    test('it should not render update address link', () => {
      const { queryByTestId } = render();
      expect(queryByTestId(`orderDetailsShippingAddress:update`)).not.toBeInTheDocument();
    });
  });
});
