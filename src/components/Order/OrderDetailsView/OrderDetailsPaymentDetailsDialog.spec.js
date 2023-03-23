import { renderWrap } from '@/utils';
import orderDetailsViewData from '__mock__/orderdetails/orderdetailsview';
import OrderDetailsPaymentDetailsDialog from './OrderDetailsPaymentDetailsDialog';

const defaultProps = {
  ...orderDetailsViewData,
};

describe('<OrderDetailsPaymentDetailsDialog />', () => {
  const render = renderWrap(OrderDetailsPaymentDetailsDialog, { defaultProps });

  test('it should render children', () => {
    expect(render()).toMatchSnapshot();
  });
});
