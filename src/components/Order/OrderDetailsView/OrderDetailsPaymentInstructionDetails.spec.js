import { renderWrap } from '@/utils';
import orderDetailsViewData from '__mock__/orderdetails/orderdetailsview';
import OrderDetailsPaymentInstructionDetails from './OrderDetailsPaymentInstructionDetails';

const defaultProps = {
  ...orderDetailsViewData,
};

describe('<OrderDetailsPaymentInstructionDetails />', () => {
  const render = renderWrap(OrderDetailsPaymentInstructionDetails, { defaultProps });

  test('it should render children', () => {
    expect(render()).toMatchSnapshot();
  });
});
