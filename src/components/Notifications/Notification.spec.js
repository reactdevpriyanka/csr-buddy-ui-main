import { renderWrap } from '@utils';
import Notification from './Notification';

describe('<Notification />', () => {
  const render = renderWrap(Notification, {
    testId: 'notification',
    defaultProps: {
      'data-testid': 'notification',
    },
  });

  test('it should render children', () => {
    const { getByText } = render({
      children: <div>{'Hello World'}</div>,
    });

    expect(getByText('Hello World')).toBeTruthy();
  });

  const types = ['error', 'severe', 'warning', 'info', 'debug'];

  for (const type of types) {
    test('it should render with classname of type', () => {
      const notification = render.andGetByTestId({ type });
      expect(notification).toHaveClass(type);
    });
  }
});
