import { trackPackageTabs } from '@/utils/trackPackage';
import { fireEvent } from '@testing-library/react';
import { renderWrap } from '@utils';
import ShipmentTracker from './ShipmentTracker';

describe('<ShipmentTracker />', () => {
  const events = [
    {
      title: 'Delivered',
      subtitle: 'Bradenton, FL | Expected by Monday Dec 14 at 5:15pm',
    },
    {
      title: 'Out for Delivery',
      subtitle: 'Bradenton, FL | Monday Dec 14 at 4:15pm',
    },
    {
      title: 'Order Created',
      subtitle: 'Chewy.com iOS Mobile App | Monday Dec 12 at 2:15pm',
    },
  ];

  const edd = {
    isDelivered: false,
    dayOfWeek: 'Monday',
    dayOfMonth: 20,
    month: 'January',
  };

  const facts = [
    { heading: 'Fulfillment Center', value: 'SDF1' },
    { heading: 'Total Packages', value: 2 },
  ];

  const orderNumber = '123123';

  const trackingNumber = '123456';

  const defaultProps = {
    orderNumber,
    trackingNumber,
    events,
    edd,
    facts,
  };

  const render = renderWrap(ShipmentTracker, { defaultProps });

  test('it should render tracking #', () => {
    const { getByText } = render();

    expect(getByText('#123456')).toBeTruthy();
  });

  test('it should render an alert when given', () => {
    const { getByText } = render({
      alert: { label: 'Test Alert', action: 'Do the thing' },
    });

    expect(getByText('Test Alert')).toBeTruthy();
  });

  describe('when viewing travel history', () => {
    test('it should render events', () => {
      const { getByText } = render();

      for (const e of events) {
        expect(getByText(e.title)).toBeTruthy();
        expect(getByText(e.subtitle)).toBeTruthy();
      }
    });

    /* eslint-disable jest/no-commented-out-tests */
    /*     describe('when see fewer updates is clicked', () => {
      test('it should render events not sourced by Chewy', () => {
        const { getByText, queryByText } = render();
        render.trigger.click(getByText('See fewer updates'));
        expect(queryByText('Order created')).toBeNull();
      });
    }); */
  });

  describe('when viewing facts', () => {
    test('it should render shipment facts', () => {
      const { getByText } = render();
      fireEvent.click(getByText(trackPackageTabs.SHIPMENT_FACTS));

      for (const fact of facts) {
        expect(getByText(fact.heading)).toBeTruthy();
        expect(getByText(fact.value)).toBeTruthy();
      }
    });
  });

  describe('when viewing fix issue', () => {
    test('it should render fix issue help', () => {
      const { getByText } = render();
      fireEvent.click(getByText(trackPackageTabs.FIX_ISSUE));

      expect(getByText('Need to fix an issue?')).toBeTruthy();
    });
  });
});
