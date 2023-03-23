import { renderWrap } from '@/utils';
import orderDetailsViewData from '__mock__/orderdetails/orderdetailsview';
import OrderDetailsComponentLabel from './OrderDetailsComponentLabel';

const defaultProps = {
  ...orderDetailsViewData,
};

describe('<OrderDetailsComponentLabel />', () => {
  const render = renderWrap(OrderDetailsComponentLabel, { defaultProps });

  test('it should render children', () => {
    expect(render()).toMatchSnapshot();
  });
});
