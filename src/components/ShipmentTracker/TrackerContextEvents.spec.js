/* eslint-disable jest/no-commented-out-tests */
import { renderWrap } from '@utils';
import TrackerContextEvents from './TrackerContextEvents';

const InfoEvent = {
  title: 'Arranged Delivery',
  subtitle: 'Fri, Jul 1 (6:25 PM EST)',
  isContextEvent: true,
  data: {
    subEventCode: '_2S_DE',
    description: 'Package arrived at carrier facility',
    contextualMessage: {
      message: 'In Transit and will arrive on XX/YY',
    },
    internalMessage: {
      message:
        'Package got an inbound scan with the carrier. This means that the carrier has inducted the package in their network and delivery is progressing normally.',
    },
    eventCode: 'ARRANGED_DELIVERY',
    mappings: {
      infoType: 'Information',
      eventLabel: 'Arranged Delivery',
    },
  },
};

const WarningEvent = {
  title: 'Delivery Delayed',
  subtitle: 'Sat, Jul 2 (2:07 AM EST)',
  isContextEvent: true,
  data: {
    subEventCode: '_A7_DE',
    description: 'Package departed carrier facility',
    contextualMessage: {
      message: 'In Transit and will arrive on XX/YY',
    },
    internalMessage: {
      message: 'Package in transit and delivery is progressing normally.',
    },
    eventCode: 'DELIVERY_DELAYED',
    mappings: {
      infoType: 'Warning',
      eventLabel: 'Delivery Delayed',
    },
  },
};

const BasicContextEvent = {
  title: 'Arrival Scan',
  subtitle: 'Sat, Jul 2 (4:27 AM EST)',
  isContextEvent: true,
  data: {
    subEventCode: '_AR',
    description: 'Package arrived at carrier facility',
    contextualMessage: {
      message: 'In Transit and will arrive on XX/YY',
    },
    internalMessage: {
      message:
        'Package got an inbound scan with the carrier. This means that the carrier has inducted the package in their network and delivery is progressing normally.',
    },
    eventCode: 'ARRIVAL_SCAN',
  },
};

const BasicEvent = {
  title: 'Out For Delivery',
  subtitle: 'Maspeth, NY | Saturday Jul 2 at 4:30 a.m.',
  isContextEvent: false,
  data: {
    subEventCode: '_OD',
    description: 'Out for delivery to you',
    internalMessage: {
      message: 'This means package was scanned to the departing van and package is on the way.',
    },
    eventCode: 'OUT_FOR_DELIVERY',
  },
};

const DeliveredEvent = {
  title: 'Delivered',
  subtitle: 'Jackson Heights, NY | Saturday Jul 2 at 10:42 a.m.',
  isContextEvent: false,
  data: {
    subEventCode: '_2B_DE',
    description: 'Your package has been delivered!',
    internalMessage: {
      message: 'Your package has been delivered!',
    },
    eventCode: 'DELIVERED',
    mappings: {
      infoType: 'Success',
      eventLabel: '',
    },
  },
};

const events = [InfoEvent, WarningEvent, BasicContextEvent, BasicEvent, DeliveredEvent];

describe('<TrackerContextEvents />', () => {
  const render = renderWrap(TrackerContextEvents, { defaultProps: { events } });

  test('it should render basic event with no context message', () => {
    const { getByText, queryByTestId } = render();

    expect(getByText(BasicEvent.title)).toBeInTheDocument();
    expect(
      queryByTestId(
        `general:accordion:summary:${BasicEvent.data.eventCode}${BasicEvent.data.subEventCode}`,
      ),
    ).not.toBeInTheDocument();
    expect(
      queryByTestId(
        `general:accordion:details:${BasicEvent.data.eventCode}${BasicEvent.data.subEventCode}`,
      ),
    ).not.toBeInTheDocument();
  });

  test('it should render basic event with context message extended', () => {
    const { getByText, getByTestId } = render();

    expect(getByText(BasicContextEvent.title)).toBeInTheDocument();
    expect(
      getByTestId(
        `general:accordion:summary:${BasicContextEvent.data.eventCode}${BasicContextEvent.data.subEventCode}`,
      ),
    ).toBeInTheDocument();
    expect(
      getByTestId(
        `general:accordion:details:${BasicContextEvent.data.eventCode}${BasicContextEvent.data.subEventCode}`,
      ),
    ).toBeInTheDocument();
    expect(
      getByTestId(
        `general:accordion:summary:${BasicContextEvent.data.eventCode}${BasicContextEvent.data.subEventCode}`,
      ),
    ).toHaveAttribute('aria-expanded', 'true');
  });

  test('it should render info context event', () => {
    const { getByText, getByTestId } = render();

    expect(getByText(InfoEvent.title)).toBeInTheDocument();
    expect(
      getByTestId(
        `general:accordion:summary:${InfoEvent.data.eventCode}${InfoEvent.data.subEventCode}`,
      ),
    ).toBeInTheDocument();
    expect(
      getByTestId(
        `general:accordion:details:${InfoEvent.data.eventCode}${InfoEvent.data.subEventCode}`,
      ),
    ).toBeInTheDocument();
    expect(
      getByTestId(
        `general:accordion:summary:${InfoEvent.data.eventCode}${InfoEvent.data.subEventCode}`,
      ),
    ).toHaveAttribute('aria-expanded', 'false');
  });

  test('it should render warning context event', () => {
    const { getByText, getByTestId } = render();

    expect(getByText(WarningEvent.title)).toBeInTheDocument();
    expect(
      getByTestId(
        `general:accordion:summary:${WarningEvent.data.eventCode}${WarningEvent.data.subEventCode}`,
      ),
    ).toBeInTheDocument();
    expect(
      getByTestId(
        `general:accordion:details:${WarningEvent.data.eventCode}${WarningEvent.data.subEventCode}`,
      ),
    ).toBeInTheDocument();
    expect(
      getByTestId(
        `general:accordion:summary:${WarningEvent.data.eventCode}${WarningEvent.data.subEventCode}`,
      ),
    ).toHaveAttribute('aria-expanded', 'false');
  });

  test('it should render delivered context event', () => {
    const { getByText, queryByTestId } = render();

    expect(getByText(DeliveredEvent.title)).toBeInTheDocument();
    expect(
      queryByTestId(
        `general:accordion:summary:${DeliveredEvent.data.eventCode}${DeliveredEvent.data.subEventCode}`,
      ),
    ).not.toBeInTheDocument();
    expect(
      queryByTestId(
        `general:accordion:details:${DeliveredEvent.data.eventCode}${DeliveredEvent.data.subEventCode}`,
      ),
    ).not.toBeInTheDocument();
  });
});
