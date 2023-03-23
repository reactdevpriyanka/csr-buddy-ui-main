import { render } from '@testing-library/react';
import { useRouter } from 'next/router';
import BreadCrumbNavLink from './BreadCrumbNavLink';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('BreadCrumbNavLink', () => {
  let defaultProps;
  let useRouterResult;

  beforeEach(() => {
    defaultProps = {
      id: '1',
      title: 'Home',
      link: '/',
      disabled: false,
    };
    useRouterResult = {
      query: {},
    };
    useRouter.mockReturnValue(useRouterResult);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders the title', () => {
    const { getByText } = render(<BreadCrumbNavLink {...defaultProps} />);
    const titleElement = getByText(defaultProps.title);
    expect(titleElement).toBeInTheDocument();
  });

  it('renders the link', () => {
    const { getByTestId } = render(<BreadCrumbNavLink {...defaultProps} />);
    const linkElement = getByTestId('bread-crumb-nav-bar');
    expect(linkElement).toBeInTheDocument();
  });
});
