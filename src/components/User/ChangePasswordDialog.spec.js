import { renderWrap } from '@utils';
import userEvent from '@testing-library/user-event';
import ChangePasswordDialog from './ChangePasswordDialog';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

window.bttUT = {
  start: jest.fn(),
  end: jest.fn(),
};

const defaultProps = {
  isOpen: true,
  onClose: jest.fn(),
  onOk: jest.fn(),
};

describe('<ChangePasswordDialog />', () => {
  const render = renderWrap(ChangePasswordDialog, { defaultProps });

  test('it should display change password dialog', () => {
    const { getByTestId } = render();
    expect(getByTestId(`passwordResetDialog`)).toBeTruthy();
    expect(getByTestId(`change-password-password-field`)).toBeTruthy();
    expect(getByTestId(`base-dialog-close-button`)).toBeTruthy();
    expect(getByTestId(`base-dialog-close-button`)).not.toHaveAttribute('disabled');

    expect(getByTestId(`base-dialog-ok-button`)).toBeTruthy();
    expect(getByTestId(`base-dialog-ok-button`)).toHaveAttribute('disabled');
  });

  test('it should enable ok button when password is entered', async () => {
    const { getByTestId } = render();

    expect(getByTestId(`base-dialog-ok-button`)).toHaveAttribute('disabled');

    const input = getByTestId('change-password-password-field').querySelector('input');
    const input2 = getByTestId('change-password-validated-password-field').querySelector('input');

    await userEvent.type(input, 'somepassword');
    await userEvent.type(input2, 'somepassword');

    expect(getByTestId(`base-dialog-ok-button`)).not.toHaveAttribute('disabled');
  });
});
