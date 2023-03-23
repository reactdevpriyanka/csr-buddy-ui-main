import { renderWrap } from '@utils';
import ProfileInfo from './ProfileInfo';

describe('<ProfileInfo />', () => {
  const render = renderWrap(ProfileInfo, {
    testId: 'card:profile-info',
  });

  test('it should render a header', () => {
    const { getByText } = render({
      header: 'Payment Details',
    });

    expect(getByText('Payment Details')).toHaveTextContent('Payment Details');
  });

  test('it should render content', () => {
    const { getByText } = render({
      content: '247 Main St, Boston, MA 02216',
    });

    expect(getByText('247 Main St, Boston, MA 02216')).toBeTruthy();
  });

  test('it should alternatively render children', () => {
    const { getByText } = render({
      children: '247 Main St, Boston, MA 02216',
    });

    expect(getByText('247 Main St, Boston, MA 02216')).toBeTruthy();
  });

  describe('with disabled={true}', () => {
    test('it should render with disabled class', () => {
      const { getByTestId } = render({ disabled: true });
      expect(getByTestId('card:profile-info')).toHaveClass('disabled');
    });
  });
});
