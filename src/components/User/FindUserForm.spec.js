import { renderWrap } from '@utils';
import * as nextRouter from 'next/router';
import userEvent from '@testing-library/user-event';
import FindUserForm from './FindUserForm';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockRouter = jest.spyOn(nextRouter, 'useRouter');

const logonId = 'testUser';

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

describe('<FindUserForm />', () => {
  const render = renderWrap(FindUserForm);

  test('it should display the cancel order dialog', () => {
    const { getByTestId } = render();
    expect(getByTestId(`find-user-title`)).toBeTruthy();
  });

  test('it should display cancel comments textfield', () => {
    const { getByTestId } = render();
    expect(getByTestId(`find-user-logonId-field`)).toBeTruthy();
  });

  test('it should render a create user button', () => {
    const { getByTestId } = render();
    expect(getByTestId(`find-user-create-user-button`)).toBeTruthy();
  });

  test('it should render a disabled find user button', () => {
    const { getByTestId } = render();
    expect(getByTestId(`find-user-find-user-button`)).toHaveAttribute('disabled');
  });

  test('it should render an enabled find user button when logon id is filled in', async () => {
    const { getByTestId } = render();

    expect(getByTestId(`find-user-find-user-button`)).toHaveAttribute('disabled');

    const input = getByTestId('find-user-logonId-field').querySelector('input');

    await userEvent.type(input, logonId);

    expect(getByTestId(`find-user-find-user-button`)).not.toHaveAttribute('disabled');
  });
});
