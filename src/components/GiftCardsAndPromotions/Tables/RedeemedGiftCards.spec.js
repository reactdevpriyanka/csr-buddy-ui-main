import { renderWrap } from '@/utils';
import redeemedGiftCardsData from '__mock__/giftcards/redeemedGiftCards';
import RedeemedGiftCards from './RedeemedGiftCards';

describe('<RedeemedGiftCards />', () => {
  const render = renderWrap(RedeemedGiftCards, {
    defaultProps: {
      giftcards: redeemedGiftCardsData,
      classes: { table: {} },
    },
  });

  test('it should render the redeemed gift cards table', () => {
    expect(render()).toMatchSnapshot();
  });
});
