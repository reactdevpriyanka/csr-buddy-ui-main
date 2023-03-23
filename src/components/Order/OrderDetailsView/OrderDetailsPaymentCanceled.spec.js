import { renderWrap } from '@/utils';
import orderDetailsViewData from '__mock__/orderdetails/orderdetailsview';
import OrderDetailsPaymentCanceled from './OrderDetailsPaymentCanceled';

const defaultProps = {
  ...orderDetailsViewData,
};

describe('<OrderDetailsPaymentCanceled />', () => {
  const render = renderWrap(OrderDetailsPaymentCanceled, { defaultProps });

  test('it should render children', () => {
    expect(render()).toMatchSnapshot();
  });
});
