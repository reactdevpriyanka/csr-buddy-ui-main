import { renderWrap } from '@/utils';
import orderDetailsViewData from '__mock__/orderdetails/orderdetailsview';
import OrderDetailsViewBlocksDetails from './OrderDetailsViewBlocksDetails';

const defaultProps = {
  ...orderDetailsViewData,
};

describe('<OrderDetailsViewBlocksDetails />', () => {
  const render = renderWrap(OrderDetailsViewBlocksDetails, { defaultProps });

  test('it should display the orderDetailsViewBlocksDetailsContainer', () => {
    const { getByTestId } = render();
    expect(getByTestId(`orderDetailsViewBlockDetailsContainer`)).toBeTruthy();
  });
});
