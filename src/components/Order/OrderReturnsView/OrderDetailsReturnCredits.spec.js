import { renderWrap } from '@/utils';
import returnData from '__mock__/order-api/returnsData';
import OrderDetailsReturnCredits from './OrderDetailsReturnCredits';

const defaultProps = {
  ...returnData,
};

describe('<OrderDetailsReturnCredits />', () => {
  const render = renderWrap(OrderDetailsReturnCredits, { defaultProps });

  test('it should display the orderDetailsReturnCredits', () => {
    const { getByTestId } = render();
    expect(getByTestId(`returnDetailsCredits`)).toBeTruthy();
  });
});
