import { renderWrap } from '@utils';
import { useRouter } from 'next/router';
import CustomerInteraction from './CustomerInteraction';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('<CustomerInteraction />', () => {
  useRouter.mockReturnValue({
    query: {
      id: '123123',
    },
  });

  const render = renderWrap(CustomerInteraction);

  test('it should render children', () => {
    expect(render()).toMatchSnapshot();
  });
});
