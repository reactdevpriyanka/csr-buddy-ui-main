import { renderWrap } from '@/utils';
import orderDetailsViewData from '__mock__/orderdetails/orderdetailsview';
import OrderDetailsItemStatus from './OrderDetailsItemStatus';

const defaultProps = {
  ...orderDetailsViewData,
};

describe('<OrderDetailsItemStatus />', () => {
  const render = renderWrap(OrderDetailsItemStatus, { defaultProps });

  test('it should render children', () => {
    expect(render()).toMatchSnapshot();
  });
});
