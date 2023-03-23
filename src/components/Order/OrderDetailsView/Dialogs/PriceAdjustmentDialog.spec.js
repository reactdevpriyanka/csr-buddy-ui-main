import renderWrap from '@/utils/renderWrap';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import PriceAdjustmentDialog from './PriceAdjustmentDialog';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

useRouter.mockReturnValue({
  query: {
    id: '1234',
  },
  pathname: '/autoship',
});

describe('<PriceAdjustmentDialog />', () => {
  const render = renderWrap(PriceAdjustmentDialog, {
    defaultProps: {
      isOpen: true,
      openDialog: jest.fn(),
      orderNumber: '456',
    },
  });

  test('it should render the PriceAdjustmentDialog component', () => {
    const { getByTestId } = render();
    expect(getByTestId('order:add-adjustment-dialog')).toBeTruthy();
    expect(getByTestId('base-dialog-ok-button')).toBeDisabled();
    const priceAdjustmentInput = getByTestId('order:add-adjustment-dialog:text-field');
    expect(priceAdjustmentInput).toBeTruthy();
    fireEvent.change(priceAdjustmentInput.querySelector('input'), { target: { value: '1.00' } });
    expect(priceAdjustmentInput.querySelector('input')).toHaveValue(1);
    expect(getByTestId('base-dialog-ok-button')).not.toBeDisabled();
  });

  test('it should go to the confirmation screens of the dialog', async () => {
    const { getByTestId } = render();
    const priceAdjustmentInput = getByTestId('order:add-adjustment-dialog:text-field');
    expect(priceAdjustmentInput).toBeTruthy();
    fireEvent.change(priceAdjustmentInput.querySelector('input'), { target: { value: '1.00' } });
    fireEvent.click(getByTestId('base-dialog-ok-button'));
    await waitFor(() => {
      expect(
        screen.getByText('Are you sure you want to apply adjustment $1.00?'),
      ).toBeInTheDocument();
    });
  });
});
