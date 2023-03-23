import { renderWrap } from '@utils';
import TrackerContextEvent from './TrackerContextEvent';

const deliveredEvent = {
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
};

const finalEvent = { mappings: { infoType: 'COMPLETE' } };

const warningEvent = {
  eventCode: 'DELIVERY_DELAYED',
  subEventCode: '_A7_DE',
  date: '2022-07-02T06:07:00Z',
  address: {
    city: 'NEWARK',
    state: 'NJ',
    country: 'US',
    primaryAddress: false,
    verified: false,
  },
  description: 'Package departed carrier facility',
  contextualMessage: {
    message: 'In Transit and will arrive on XX/YY',
  },
  internalMessage: {
    message: 'Package in transit and delivery is progressing normally.',
  },
  mappings: {
    infoType: 'WARNING',
    eventLabel: '',
  },
};

const infoEvent = {
  eventCode: 'ARRANGED_DELIVERY',
  subEventCode: '_2S_DE',
  date: '2022-07-01T22:25:00Z',
  address: {
    city: 'NEWARK',
    state: 'NJ',
    country: 'US',
    primaryAddress: false,
    verified: false,
  },
  description: 'Package arrived at carrier facility',
  contextualMessage: {
    message: 'In Transit and will arrive on XX/YY',
  },
  internalMessage: {
    message:
      'Package got an inbound scan with the carrier. This means that the carrier has inducted the package in their network and delivery is progressing normally.',
  },
  mappings: {
    infoType: 'INFORMATION',
    eventLabel: 'Info Event Label',
  },
};

const standardEventContext = {
  eventCode: 'ARRIVAL_SCAN',
  subEventCode: '_AR',
  date: '2022-07-02T08:27:00Z',
  address: {
    city: 'MASPETH',
    state: 'NY',
    country: 'US',
    primaryAddress: false,
    verified: false,
  },
  description: 'Package arrived at carrier facility',
  contextualMessage: {
    message: 'In Transit and will arrive on XX/YY',
  },
  internalMessage: {
    message:
      'Package got an inbound scan with the carrier. This means that the carrier has inducted the package in their network and delivery is progressing normally.',
  },
};

const standardEvent = {
  eventCode: 'OUT_FOR_DELIVERY',
  subEventCode: '_OD',
  date: '2022-07-02T08:30:00Z',
  address: {
    city: 'MASPETH',
    state: 'NY',
    country: 'US',
    primaryAddress: false,
    verified: false,
  },
  description: 'Out for delivery to you',
  internalMessage: {
    message: 'This means package was scanned to the departing van and package is on the way.',
  },
};

const defaultEventPropsObj = {
  title: 'Basic Event Title',
  subtitle: 'Basic Event Subtitle',
  state: 'COMPLETE',
  isContextEvent: false,
  data: {
    mappings: {
      infoType: 'DEFAULT',
    },
  },
  isFinalEvent: false,
  isLastContextEvent: false,
};

const standardEventProps = {
  ...defaultEventPropsObj,
  data: standardEvent,
};

const standardEventContextProps = {
  ...defaultEventPropsObj,
  isContextEvent: true,
  data: standardEventContext,
};

const infoEventContextProps = {
  ...standardEventContextProps,
  isContextEvent: true,
  data: infoEvent,
};

const warningEventContextProps = {
  ...standardEventContextProps,
  isContextEvent: true,
  data: warningEvent,
};

const deliveredEventProps = {
  ...defaultEventPropsObj,
  isContextEvent: false,
  data: deliveredEvent,
};

const finalEventProps = {
  ...defaultEventPropsObj,
  isContextEvent: false,
  isFinalEvent: true,
  data: finalEvent,
};

const contextualMessageTitle = 'Customer Message:';
const internalMessageTitle = 'CSR Guidance:';

describe('<TrackerContextEvent />', () => {
  const render = (props) => renderWrap(TrackerContextEvent, { defaultProps: props })();

  test('it should render basic event with no context message', () => {
    const { getByText, queryByText } = render({ ...standardEventProps });
    expect(getByText(standardEventProps.title)).toBeTruthy();
    expect(getByText(standardEventProps.subtitle)).toBeTruthy();
    expect(queryByText(contextualMessageTitle)).not.toBeInTheDocument();
    expect(queryByText(internalMessageTitle)).not.toBeInTheDocument();
  });

  test('it should render basic event with context message', () => {
    const { getByText, getByTestId } = render({ ...standardEventContextProps });
    expect(getByText(standardEventContextProps.title)).toBeTruthy();
    expect(getByText(standardEventContextProps.subtitle)).toBeTruthy();
    expect(getByText(contextualMessageTitle)).toBeInTheDocument();
    expect(getByText(internalMessageTitle)).toBeInTheDocument();
    expect(
      getByTestId(
        `general:accordion:summary:${standardEventContext.eventCode}${standardEventContext.subEventCode}`,
      ),
    ).toHaveAttribute('aria-expanded', 'false');
  });

  test('it should render basic event with context message extended', () => {
    const { getByText, getByTestId } = render({
      ...standardEventContextProps,
      isLastContextEvent: true,
    });
    expect(getByText(standardEventContextProps.title)).toBeTruthy();
    expect(getByText(standardEventContextProps.subtitle)).toBeTruthy();
    expect(getByText(contextualMessageTitle)).toBeInTheDocument();
    expect(getByText(internalMessageTitle)).toBeInTheDocument();
    expect(
      getByTestId(
        `general:accordion:summary:${standardEventContext.eventCode}${standardEventContext.subEventCode}`,
      ),
    ).toHaveAttribute('aria-expanded', 'true');
  });

  test('it should render info context event', () => {
    const { getByText } = render({ ...infoEventContextProps });
    expect(getByText(standardEventContextProps.title)).toBeTruthy();
    expect(getByText(standardEventContextProps.subtitle)).toBeTruthy();
    expect(getByText(contextualMessageTitle)).toBeInTheDocument();
    expect(getByText(internalMessageTitle)).toBeInTheDocument();
  });

  test('it should render warning context event', () => {
    const { getByText, getByTestId } = render({ ...warningEventContextProps });
    expect(getByText(standardEventContextProps.title)).toBeTruthy();
    expect(getByText(standardEventContextProps.subtitle)).toBeTruthy();
    expect(getByText(contextualMessageTitle)).toBeInTheDocument();
    expect(getByText(internalMessageTitle)).toBeInTheDocument();
    expect(getByTestId('icon_WARNING')).toBeInTheDocument();
  });

  test('it should render delivered context event', () => {
    const { getByText, queryByText } = render({ ...deliveredEventProps });
    expect(getByText(standardEventContextProps.title)).toBeTruthy();
    expect(getByText(standardEventContextProps.subtitle)).toBeTruthy();
    expect(queryByText(contextualMessageTitle)).not.toBeInTheDocument();
    expect(queryByText(internalMessageTitle)).not.toBeInTheDocument();
  });

  test('it should render final context event', () => {
    const { getByText, queryByText } = render({ ...finalEventProps });
    expect(getByText(standardEventContextProps.title)).toBeTruthy();
    expect(getByText(standardEventContextProps.subtitle)).toBeTruthy();
    expect(queryByText(contextualMessageTitle)).not.toBeInTheDocument();
    expect(queryByText(internalMessageTitle)).not.toBeInTheDocument();
  });
});
