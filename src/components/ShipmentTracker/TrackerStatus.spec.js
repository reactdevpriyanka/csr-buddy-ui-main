import { renderWrap } from '@utils';
import TrackerStatus from './TrackerStatus';

describe('<TrackerStatus />', () => {
  const dayOfWeek = 'Monday';

  const dayOfMonth = 20;

  const month = 'January';

  const time = '5:15';

  const meridiem = 'pm';

  const defaultProps = {
    isDelivered: false,
    dayOfWeek,
    dayOfMonth,
    month,
    time,
    meridiem,
  };

  const render = (overrideProps = {}) =>
    renderWrap(TrackerStatus, { defaultProps: { ...defaultProps, ...overrideProps } })();

  test('it should render expected delivery', () => {
    const { getByText } = render();
    expect(getByText('Expected Delivery')).toBeInTheDocument();
  });

  test('it should render Delivered when true', () => {
    const { getByText } = render({ isDelivered: true });
    expect(getByText('Delivered On')).toBeInTheDocument();
  });

  test('it should render day of week', () => {
    const { getByText } = render();
    expect(getByText('Monday')).toBeInTheDocument();
  });

  test('it should render day of month', () => {
    const { getByText } = render();
    expect(getByText('20')).toBeInTheDocument();
  });
});
