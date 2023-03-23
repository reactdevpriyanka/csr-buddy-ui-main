import { renderWrap } from '@/utils';
import useFeature from '@/features/useFeature';
import OrderDetailsViewActionButtons from './OrderDetailsViewActionButtons';

jest.mock('@/features/useFeature');

describe('<OrderDetailsViewActionButtons />', () => {
  const defaultProps = {
    orderNumber: '12345',
    isActionAllowed: () => true,
  };

  useFeature.mockReturnValue(true);
  const render = renderWrap(OrderDetailsViewActionButtons, { defaultProps });

  test('it should display the orderDetailsViewActionButtonsContainer', () => {
    const { getByTestId } = render();
    expect(getByTestId(`orderDetailsViewActionButtonsContainer`)).toBeTruthy();
  });

  test('it should display the app promotion button', () => {
    const { getByTestId } = render();
    expect(getByTestId(`button:open-add-promotion-dialog`)).toBeTruthy();
  });

  test('it should display the price adjustment button', () => {
    const { getByTestId } = render();
    expect(getByTestId(`button:open-price-adjustment-dialog`)).toBeTruthy();
  });

  describe('when isActionAllowed equals false', () => {
    const defaultProps = {
      orderNumber: '12345',
      isActionAllowed: () => false,
    };

    useFeature.mockReturnValue(true);
    const render = renderWrap(OrderDetailsViewActionButtons, { defaultProps });

    test('it should display the app promotion button', () => {
      const { queryByTestId } = render();
      expect(queryByTestId(`button:open-add-promotion-dialog`)).not.toBeInTheDocument();
    });

    test('it should display the price adjustment button', () => {
      const { queryByTestId } = render();
      expect(queryByTestId(`button:open-price-adjustment-dialog`)).not.toBeInTheDocument();
    });
  });
});
