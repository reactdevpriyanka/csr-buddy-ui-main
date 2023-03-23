import { renderWrap } from '@/utils';
import promotionsHistoryData from '__mock__/promotions/promotionsHistory';
import PromotionCodeHistory from './PromotionCodeHistory';

describe('<PromotionCodeHistory />', () => {
  const render = renderWrap(PromotionCodeHistory, {
    defaultProps: {
      promotions: promotionsHistoryData,
      classes: { table: {} },
    },
  });

  test('it should render the promotions history table', () => {
    expect(render()).toMatchSnapshot();
  });
});
