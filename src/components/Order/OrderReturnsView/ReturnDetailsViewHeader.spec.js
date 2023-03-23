import { renderWrap } from '@/utils';
import returnData from '__mock__/order-api/returnsData';
import ReturnDetailsViewHeader from './ReturnDetailsViewHeader';

const defaultProps = {
  ...returnData,
  isActionAllowed: () => true,
};

describe('<ReturnDetailsViewHeader />', () => {
  const render = renderWrap(ReturnDetailsViewHeader, { defaultProps });

  test('it should display the returnDetailsViewHeader', () => {
    const { getByTestId } = render();
    expect(getByTestId(`returnDetailsViewHeaderContainer`)).toBeTruthy();
  });
});
