import { renderWrap } from '@utils';
import * as features from '@/features';
import ActivityHeader from './ActivityHeader';

describe('<ActivityHeader />', () => {
  const render = renderWrap(ActivityHeader, {
    testId: 'card:activity-header',
    defaultProps: {
      title: '',
      subtitle: '',
      action: <a href="/path/to/workflow">{'this is an action'}</a>,
      titleSection: '',
      headerSection: '',
      subscriptionId: '',
      orderNumber: null,
      status: '',
    },
  });

  test('it should render a title', () => {
    const { queryByText } = render({ title: 'this is a title' });

    expect(queryByText('this is a title')).toBeInTheDocument();
  });

  test('it should render a subtitle', () => {
    const { queryByText } = render({ subtitle: 'this is a subtitle' });

    expect(queryByText('this is a subtitle')).toBeInTheDocument();
  });

  test('it should render an action', () => {
    const { getByText } = render({
      action: <a href="/path/to/workflow">{'this is an action'}</a>,
    });

    const action = getByText('this is an action');

    expect(action).toHaveTextContent('this is an action');
    expect(action).toHaveAttribute('href', '/path/to/workflow');
  });

  test('it should render an action icon by default', () => {
    const { container } = render({
      action: <a href="/path/to/workflow">{'this is an action'}</a>,
    });

    expect(
      container.querySelectorAll('[data-testid="card:activity-header-action-icon"]'),
    ).toHaveLength(1);
  });

  test('it should not render an action icon when specified', () => {
    const { container } = render({
      action: <a href="/path/to/workflow">{'this is an action'}</a>,
      showActionIcon: false,
    });

    expect(
      container.querySelectorAll('[data-testid="card:activity-header-action-icon"]'),
    ).toHaveLength(0);
  });

  test('it should not render a titleSection component', () => {
    const { queryByText } = render();

    expect(queryByText('this does have titleSection')).not.toBeInTheDocument();
  });

  test('it should render a titleSection component', () => {
    const { queryByText } = render({ titleSection: 'this does have titleSection' });

    expect(queryByText('this does have titleSection')).toBeInTheDocument();
  });

  test('it should not render a headerSection component', () => {
    const { queryByText } = render();

    expect(queryByText('this does have headerSection')).not.toBeInTheDocument();
  });

  test('it should render a headerSection component', () => {
    const { queryByText } = render({ headerSection: 'this does have headerSection' });

    expect(queryByText('this does have headerSection')).toBeInTheDocument();
  });

  test('it should render a order status component', () => {
    const { queryByText } = render({
      headerSection: 'this does have headerSection',
      orderNumber: '12345',
      status: 'READY_TO_RELEASE',
    });

    expect(queryByText('C - Ready To Release')).toBeInTheDocument();
  });

  test('it should render a subscription status component', () => {
    const { queryByText } = render({
      headerSection: 'this does have headerSection',
      subscriptionId: '12345',
      status: 'ACTIVE',
    });

    expect(queryByText('ACTIVE')).toBeInTheDocument();
  });

  test('it should render an order status bade', () => {
    jest.spyOn(features, 'useFeature').mockImplementation(() => true);
    const { queryByText, getByTestId } = render({ status: 'RELEASED', orderNumber: '12345' });
    expect(getByTestId(`badge:12345`)).toBeInTheDocument();
    expect(queryByText('R - Released')).toBeInTheDocument();
  });
});
