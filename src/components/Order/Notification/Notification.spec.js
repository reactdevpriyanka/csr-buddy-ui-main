import { renderWrap } from '@/utils';
import Notification from './Notification';

describe('<Notification />', () => {
  const orderNumber = '123123';
  const title = 'Test Notification';
  const type = 'NOTIFICATION';
  const action = <strong>Test Action</strong>;
  const children = <div>Test Children</div>;
  const defaultProps = {
    orderNumber,
    title,
    type,
    action,
    children,
  };

  const render = renderWrap(Notification, { defaultProps });

  test('it should render a container', () => {
    const { getByTestId } = render();
    expect(getByTestId(`order-${type.toLowerCase()}`)).toBeTruthy();
  });

  test('it should render an icon and title', () => {
    const { getByTestId, getByText } = render();
    expect(getByTestId(`order-${type.toLowerCase()}:icon`)).toBeTruthy();
    expect(getByText(title)).toBeTruthy();
  });

  test('it should render action when supplied', () => {
    const { getByTestId, getByText } = render();
    expect(getByTestId(`order-${type.toLowerCase()}:action`)).toBeTruthy();
    expect(getByText('Test Action')).toBeTruthy();
  });

  test('it should render children when supplied', () => {
    const { getByTestId, getByText } = render();
    expect(getByTestId(`order-${type.toLowerCase()}:content`)).toBeTruthy();
    expect(getByText('Test Children')).toBeTruthy();
  });
});
