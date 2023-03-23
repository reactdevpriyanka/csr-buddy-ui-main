import { renderWrap } from '@utils';
import TrackerEvents from './TrackerEvents';

describe('<TrackerEvents />', () => {
  // eslint-disable-next-line react/prop-types
  const TestEvent = (props) => <div className="test-event">{props.title}</div>;

  const events = [
    {
      title: 'Order Created',
      subtitle: 'Chewy.com iOS Mobile App | Monday Dec 12 at 2:15pm',
    },
    {
      title: 'Out for Delivery',
      subtitle: 'Bradenton, FL | Monday Dec 14 at 4:15pm',
    },
    {
      title: 'Delivered',
      subtitle: 'Bradenton, FL | Expected by Monday Dec 14 at 5:15pm',
    },
  ];

  const defaultProps = {
    events,
    as: TestEvent,
  };

  const render = renderWrap(TrackerEvents, { defaultProps });

  test('it should render all events by default', () => {
    const { container } = render();
    const elements = container.querySelectorAll('.test-event');
    expect(elements).toHaveLength(3);
  });

  test('it should render events in reverse order', () => {
    const { container } = render();
    const elements = container.querySelectorAll('.test-event');
    expect(elements[0].textContent).toEqual('Delivered');
  });

  /* Leaving these in in case we re-add the see less/see more logic */
  /* eslint-disable jest/no-commented-out-tests */
  /*   test('it should render See fewer updates by default', () => {
    const { getByText } = render();
    expect(getByText('See fewer updates')).toBeTruthy();
  });
 */

  /* describe('when See fewer updates is clicked', () => {
    test('it should only render shipper events', () => {
      const { container, getByText } = render();
      const seeFewer = getByText('See fewer updates');
      render.trigger.click(seeFewer);
      const elements = container.querySelectorAll('.test-event');
      expect(elements).toHaveLength(2);
    });

    test('it should render See all updates', () => {
      const { getByText } = render();
      render.trigger.click(getByText('See fewer updates'));
      expect(getByText('See all updates')).toBeTruthy();
    });

    describe('when See all updates is clicked', () => {
      test('it should render all events', () => {
        const { container } = render();
        const elements = container.querySelectorAll('.test-event');
        expect(elements).toHaveLength(3);
      });

      test('it should render See fewer updates', () => {
        const { getByText } = render();
        render.trigger.click(getByText('See fewer updates'));
        render.trigger.click(getByText('See all updates'));
        expect(getByText('See fewer updates')).toBeTruthy();
      });
    });
  }); */
});
