import { renderWrap } from '@/utils';
import returnData from '__mock__/order-api/returnsData';
import ReturnSubmitterDetails from './ReturnSubmitterDetails';

const defaultProps = {
  ...returnData,
};

describe('<ReturnSubmitterDetails />', () => {
  const render = renderWrap(ReturnSubmitterDetails, { defaultProps });

  test('it should display the returnSubmitterDetails', () => {
    const { getByTestId } = render();
    expect(getByTestId(`returnSubmitterContainer`)).toBeTruthy();
  });
});
