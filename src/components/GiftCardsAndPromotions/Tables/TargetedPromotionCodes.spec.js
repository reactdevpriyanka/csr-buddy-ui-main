import { renderWrap } from '@/utils';
import targetedPromotionsData from '__mock__/promotions/targetedPromotions';
import TargetedPromotionCodes from './TargetedPromotionCodes';

describe('<TargetedPromotionCodes />', () => {
  const render = renderWrap(TargetedPromotionCodes, {
    defaultProps: {
      giftcards: targetedPromotionsData,
      classes: { table: {} },
    },
  });

  test('it should render the targeted promotions table', () => {
    expect(render()).toMatchSnapshot();
  });
});
