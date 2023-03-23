import { useRouter } from 'next/router';
import useEnactment from '@/hooks/useEnactment';
import { renderWrap } from '@utils';
import useCustomer from '@/hooks/useCustomer';
import EnactButton from './EnactButton';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/hooks/useEnactment');
jest.mock('@/hooks/useCustomer');

describe('<EnactButton />', () => {
  const render = renderWrap(EnactButton);

  const { openEnactmentLogin } = useEnactment(); // call the mock to get access to the jest fn

  useRouter.mockReturnValue({
    query: {
      id: '123123',
    },
  });

  useCustomer.mockReturnValue({
    data: 'ACTIVE',
  });

  test('it should render a button', () => {
    const { getByLabelText } = render();
    expect(getByLabelText('Login as customer')).toBeInTheDocument();
  });

  describe('when login button is clicked', () => {
    test('it should enact as customer', async () => {
      const { getByLabelText } = render();
      render.trigger.click(getByLabelText('Login as customer'));
      const delay = (ms) => new Promise((res) => setTimeout(res, ms));
      await delay(2000);
      expect(openEnactmentLogin).toHaveBeenCalled();
    });
  });
});
