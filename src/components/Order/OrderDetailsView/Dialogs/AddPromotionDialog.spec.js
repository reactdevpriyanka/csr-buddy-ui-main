import renderWrap from '@/utils/renderWrap';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import AddPromotionDialog from './AddPromotionDialog';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

useRouter.mockReturnValue({
  query: {
    id: '1234',
  },
  pathname: '/autoship',
});

describe('<AddPromotionDialog />', () => {
  const render = renderWrap(AddPromotionDialog, {
    defaultProps: {
      isOpen: true,
      openDialog: jest.fn(),
      orderNumber: '456',
    },
  });

  test('it should render the AddPromotionDialog component', () => {
    const { getByTestId } = render();
    expect(getByTestId('base-dialog-ok-button')).toBeDisabled();
    const addPromotionInput = getByTestId('order:add-promotion-dialog:text-field');
    expect(addPromotionInput).toBeTruthy();
    fireEvent.change(addPromotionInput.querySelector('input'), { target: { value: 'ABC' } });
    expect(addPromotionInput.querySelector('input')).toHaveValue('ABC');
    expect(getByTestId('base-dialog-ok-button')).not.toBeDisabled();
  });

  test('it should go to the confirmation screens of the dialog', async () => {
    const { getByTestId } = render();
    const addPromotionInput = getByTestId('order:add-promotion-dialog:text-field');
    expect(addPromotionInput).toBeTruthy();
    fireEvent.change(addPromotionInput.querySelector('input'), { target: { value: 'ABC' } });
    fireEvent.click(getByTestId('base-dialog-ok-button'));
    await waitFor(() => {
      expect(
        screen.getByText('Are you sure you want to add promotion ABC to the order?'),
      ).toBeInTheDocument();
    });
  });
});
