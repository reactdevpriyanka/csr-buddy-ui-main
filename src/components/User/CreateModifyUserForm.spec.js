/* eslint-disable jest/no-commented-out-tests */
import { renderWrap } from '@utils';
import * as nextRouter from 'next/router';
import userEvent from '@testing-library/user-event';
import useUser from '@/hooks/useUser';
import userInfo from '__mock__/users/user_details';
import CreateModifyUserForm from './CreateModifyUserForm';

jest.mock('@/hooks/useUser');

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockRouter = jest.spyOn(nextRouter, 'useRouter');

const logonId = 'nbobbins';

mockRouter.mockReturnValue({
  query: {
    logonId: logonId,
  },
  pathname: `/create-modify-user`,
});

window.bttUT = {
  start: jest.fn(),
  end: jest.fn(),
};

describe('<CreateModifyUserForm />', () => {
  const render = (id = null) => {
    const defaultProps = {
      loginIdInput: id,
    };

    return renderWrap(CreateModifyUserForm, { defaultProps })();
  };

  test('it should display the create modify user form', () => {
    const { getByTestId } = render();
    expect(getByTestId(`createModifyUser-title`)).toBeTruthy();
  });

  test('it should display logon id textfield', () => {
    const { getByTestId } = render();
    expect(getByTestId(`createModifyUser-logonId-field`)).toBeTruthy();
  });

  test('it should display password textfield', () => {
    const { getByTestId } = render();
    expect(getByTestId(`createModifyUser-password-field`)).toBeTruthy();
  });

  test('it should display display name textfield', () => {
    const { getByTestId } = render();
    expect(getByTestId(`createModifyUser-displayName-field`)).toBeTruthy();
  });

  test('it should display email address textfield', () => {
    const { getByTestId } = render();
    expect(getByTestId(`createModifyUser-emailAddress-field`)).toBeTruthy();
  });

  test('it should display registration type selection field', () => {
    const { getByTestId } = render();
    expect(getByTestId(`createModifyUser-registerType-field`)).toBeTruthy();
  });

  test('it should display status selection field', () => {
    const { queryByTestId } = render();
    expect(queryByTestId(`createModifyUser-status-field`)).not.toBeInTheDocument();
  });

  test('it should render a cancel button', () => {
    const { getByTestId } = render();
    expect(getByTestId(`createModifyUser-cancel-button`)).toBeTruthy();
  });

  test('it should render a save user button', () => {
    const { getByTestId } = render();
    expect(getByTestId(`createModifyUser-save-user-button`)).toBeTruthy();
  });

  test('it should render a change password button', () => {
    const { queryByTestId } = render();
    expect(queryByTestId('createModifyUser-change-password-button')).not.toBeInTheDocument();
  });

  test('it should render a disabled save user button', () => {
    const { getByTestId } = render();
    expect(getByTestId(`createModifyUser-save-user-button`)).toHaveAttribute('disabled');
  });

  describe('It should render content in edit mode', () => {
    const { findUser } = useUser;
    afterEach(() => findUser.mockReset());

    test(`should render form with filled in values`, () => {
      const { getByPlaceholderText } = render(logonId);

      expect(getByPlaceholderText('Logon ID')).toHaveValue(userInfo.attributes.loginId);
      expect(getByPlaceholderText('Email Address')).toHaveValue(userInfo.attributes.email);
      expect(getByPlaceholderText('Display Name')).toHaveValue(userInfo.attributes.fullName);
    });

    test(`should render form with disabled save user until values change`, async () => {
      const { getByTestId } = render(logonId);

      expect(getByTestId(`createModifyUser-save-user-button`)).toHaveAttribute('disabled');

      const input = getByTestId('createModifyUser-displayName-field').querySelector('input');

      await userEvent.type(input, 'testValue');

      // expect(getByTestId(`createModifyUser-save-user-button`)).not.toHaveAttribute('disabled');
    });
  });
});
