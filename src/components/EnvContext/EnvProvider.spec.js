import { renderWrap } from '@utils';
import Events from '@/components/OracleCommunicator/Events';
import { useRouter } from 'next/router';
import EnvProvider from './EnvProvider';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockReload = jest.fn();

useRouter.mockReturnValue({
  query: {
    id: '1234',
  },
  asPath: '/autoship',
  reload: mockReload,
});

describe('<EnvProvider />', () => {
  const render = renderWrap(EnvProvider);

  it('should dispatch event', () => {
    render();
    window.dispatchEvent(new CustomEvent(Events.REFRESH_PAGE));
    expect(mockReload).toHaveBeenCalledWith('/autoship');
  });
});
