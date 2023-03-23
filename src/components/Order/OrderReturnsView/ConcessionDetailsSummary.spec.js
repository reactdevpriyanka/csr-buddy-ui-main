import { renderWrap } from '@/utils';
import returnData from '__mock__/order-api/returnsData';
import ConcessionDetailsSummary from './ConcessionDetailsSummary';

const defaultProps = {
  ...returnData,
};

describe('<ConcessionDetailsSummary />', () => {
  const render = renderWrap(ConcessionDetailsSummary, { defaultProps });

  test('it should display the concessionDetailsSummary', () => {
    const { getByTestId } = render();
    expect(getByTestId(`concessionDetails`)).toBeTruthy();
  });
});
