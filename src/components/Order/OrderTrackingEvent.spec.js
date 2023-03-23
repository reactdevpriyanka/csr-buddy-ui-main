import { renderWrap } from '@utils';
import PropTypes from 'prop-types';
import OrderTrackingEvent from './OrderTrackingEvent';

const ExampleComponent = ({ children }) => {
  return <div data-testid="order:tracking-event">{children}</div>;
};

ExampleComponent.propTypes = {
  children: PropTypes.node,
};

describe('<OrderTrackingEvent />', () => {
  const defaultProps = {
    status: 'READY_TO_RELEASE',
    total: 0,
    edd: {
      isDelivered: false,
      dayOfWeek: 'Thu',
      dayOfMonth: 1,
      month: 'Dec',
      year: 2022,
    },
  };
  it('should render null when the status is CANCELED', () => {
    const render = renderWrap(ExampleComponent);
    const { getByTestId } = render();
    const el = getByTestId('order:tracking-event');
    expect(el).toBeEmptyDOMElement();
  });
  test('it should render only tooltip component when the status is not CANCELED and the total is invalid', () => {
    const render = (overrideProps = {}) =>
      renderWrap(OrderTrackingEvent, { defaultProps: { ...defaultProps, ...overrideProps } })();
    const { getByTestId } = render();
    expect(getByTestId(`order:tracking-pending`)).toBeInTheDocument();
  });

  test('it should render only tooltip component when the status is not CANCELED and undefined edd', () => {
    const render = (overrideProps = {}) =>
      renderWrap(OrderTrackingEvent, { defaultProps: { ...defaultProps, edd: undefined } })();
    const { getByTestId } = render();
    expect(getByTestId(`order:tracking-pending`)).toBeInTheDocument();
  });

  test('it should render the edd when status is not CANCELED and the total is valid', () => {
    const render = (overrideProps = {}) =>
      renderWrap(OrderTrackingEvent, { defaultProps: { ...defaultProps, total: 1 } })();
    const { getByText } = render();
    expect(getByText('Thu, Dec')).toBeInTheDocument();
    expect(getByText(1)).toBeInTheDocument();
    expect(getByText(2022)).toBeInTheDocument();
  });
});
