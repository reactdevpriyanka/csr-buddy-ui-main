import { renderWrap } from '@/utils';
import returnData from '__mock__/order-api/returnsData';
import ReturnAmountDetails from './ReturnAmountDetails';

const defaultProps = {
  ...returnData,
};

describe('<ReturnAmountDetails />', () => {
  const render = renderWrap(ReturnAmountDetails, { defaultProps });

  test('it should display the returnAmountDetails', () => {
    const { getByTestId } = render();
    expect(getByTestId(`returnAmountContainer`)).toBeTruthy();
  });
});
