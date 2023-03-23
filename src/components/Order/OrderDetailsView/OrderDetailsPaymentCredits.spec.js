import { renderWrap } from '@/utils';
import orderDetailsViewData from '__mock__/orderdetails/orderdetailsview';
import OrderDetailsPaymentCredits from './OrderDetailsPaymentCredits';

const defaultProps = {
  ...orderDetailsViewData,
};

describe('<OrderDetailsPaymentCredits />', () => {
  const render = renderWrap(OrderDetailsPaymentCredits, { defaultProps });

  test('it should render children', () => {
    expect(render()).toMatchSnapshot();
  });
});
