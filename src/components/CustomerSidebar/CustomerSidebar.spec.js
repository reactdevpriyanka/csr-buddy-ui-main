import { useRouter } from 'next/router';
import { renderWrap } from '@/utils';
import { CustomerSidebar } from './CustomerSidebar';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('<CustomerSidebar />', () => {
  useRouter.mockReturnValue({
    query: {
      id: '123123',
    },
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
  });

  const render = renderWrap(CustomerSidebar, {
    testId: 'customer-sidebar',
  });

  test('it should render the sidebar', () => {
    const sidebar = render.andGetByTestId();
    expect(sidebar).toBeInTheDocument();
  });
});
