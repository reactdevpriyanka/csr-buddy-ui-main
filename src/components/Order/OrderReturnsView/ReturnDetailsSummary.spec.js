import { renderWrap } from '@/utils';
import returnData from '__mock__/order-api/returnsData';
import ReturnDetailsSummary from './ReturnDetailsSummary';

const defaultProps = {
  ...returnData,
};

describe('<ReturnDetailsSummary />', () => {
  const render = renderWrap(ReturnDetailsSummary, { defaultProps });

  test('it should display the returnDetailsSummary', () => {
    const { getByTestId } = render();
    expect(getByTestId(`returnDetailsSummaryContainer`)).toBeTruthy();
  });
});
