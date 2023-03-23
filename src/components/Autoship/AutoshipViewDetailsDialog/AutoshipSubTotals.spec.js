import { renderWrap } from '@utils';
import autoshipPromotionOrder from '__mock__/activities/autoship-promotion-order';
import AutoshipSubTotals from './AutoshipSubTotals';

describe('<AutoshipSubTotals />', () => {
  const render = renderWrap(AutoshipSubTotals, {
    defaultProps: {
      disableAdjustments: false,
      subscriptionData: autoshipPromotionOrder,
      autoshipTotals: {
        totalAdjustment: { value: '-6.55' },
      },
      expand: true,
      coloradoRetailDeliveryFee: '0.27',
    },
  });

  test('it should render title', () => {
    const { getByTestId } = render();
    expect(getByTestId('autoship:payment:viewdetails:subtotals')).toBeTruthy();
  });

  test('it should render all divs', () => {
    const { getByTestId } = render();
    const comp = getByTestId('autoship:payment:viewdetails:subtotals');
    expect(comp).toBeTruthy();
    expect(comp.children).toHaveLength(7);
  });

  test('it should render correct text for items', () => {
    const { getByTestId } = render();
    const comp = getByTestId('autoship:payment:viewdetails:subtotals');
    expect(comp).toBeTruthy();
    expect(comp.children[0]).toHaveTextContent('Item(s) Subtotal:$130.79');
    expect(comp.children[1]).toHaveTextContent('Shipping:$0');
    expect(comp.children[3]).toHaveTextContent('Total Before Tax:$124.24');
    expect(comp.children[4]).toHaveTextContent('Taxes:$7.77');
    expect(comp.children[5]).toHaveTextContent('Colorado Retail Delivery Fee:$0.27');
    expect(comp.children[6]).toHaveTextContent('Grand Total:$132.01');
  });

  test('it should render expanded accordion', () => {
    const { getByTestId } = render();
    const comp = getByTestId('autoship:payment:viewdetails:adjustment:accordion:details');
    expect(comp).toBeTruthy();
    expect(comp.children).toHaveLength(1);
    expect(comp.children[0]).toHaveTextContent(
      'PromotionAutoship & Save - 5% offCodeAUTOSHIPNSAVEValue',
    );
  });
});
