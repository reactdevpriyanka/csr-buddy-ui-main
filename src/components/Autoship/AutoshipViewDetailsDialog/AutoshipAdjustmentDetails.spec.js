import { renderWrap } from '@utils';
import AutoshipAdjustmentDetails from './AutoshipAdjustmentDetails';

describe('<AutoshipAdjustmentDetails />', () => {
  const promotions = [
    {
      promotion: 'Autoship & Save 5% off',
      code: 'AUTOSHIPNSAVE',
      amount: { value: '4.95' },
    },
    {
      promotion: 'CSR 10% off',
      code: 'CSR-10PCT-X11',
      amount: { value: '4.95' },
    },
    {
      promotion: 'CSR Free Shipping',
      code: 'CSR-FS-X11',
      amount: { value: '4.95' },
    },
  ];

  const render = renderWrap(AutoshipAdjustmentDetails, {
    defaultProps: {
      disableAdjustments: false,
      adjustmentTotal: '-14.07',
      promotions,
      expand: true,
    },
  });

  test('it should render expanded accordion', () => {
    const { getByTestId } = render();
    const comp = getByTestId('autoship:payment:viewdetails:adjustment:accordion:details');
    expect(comp).toBeTruthy();
    expect(comp.children).toHaveLength(3);
    expect(comp.children[0]).toHaveTextContent('PromotionCodeAUTOSHIPNSAVEValue$4.95');
    expect(comp.children[1]).toHaveTextContent('PromotionCodeCSR-10PCT-X11Value$4.95');
    expect(comp.children[2]).toHaveTextContent('PromotionCodeCSR-FS-X11Value$4.95');
  });
});
