import { renderWrap } from '@/utils';
import purchasedGiftCardsData from '__mock__/giftcards/purchasedGiftCards';
import PurchasedGiftCards from './PurchasedGiftCards';

describe('<PurchasedGiftCards />', () => {
  const render = renderWrap(PurchasedGiftCards, {
    defaultProps: {
      giftcards: purchasedGiftCardsData,
      classes: { table: {} },
    },
  });

  test('it should render the purchased gift cards table', () => {
    expect(render()).toMatchSnapshot();
  });
});
