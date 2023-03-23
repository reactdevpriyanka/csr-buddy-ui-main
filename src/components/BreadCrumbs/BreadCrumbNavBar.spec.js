import { render } from '@testing-library/react';
import { useRouter } from 'next/router';
import BreadCrumbNavBar from './BreadCrumbNavBar';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('BreadCrumbNavBar', () => {
  let defaultProps;
  let useRouterResult;

  beforeEach(() => {
    defaultProps = {
      divider: '/',
      breadcrumb: {
        id: '1',
        title: 'Home',
        link: '/',
        disabled: false,
      },
    };
    useRouterResult = {
      query: {},
    };
    useRouter.mockReturnValue(useRouterResult);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders the link', () => {
    const { getByTestId } = render(<BreadCrumbNavBar {...defaultProps} />);
    const linkElement = getByTestId('bread-crumb-nav-bar');
    expect(linkElement).toBeInTheDocument();
  });
});
