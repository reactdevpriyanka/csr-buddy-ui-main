import { renderWrap } from '@/utils';
import * as features from '@/features';
import * as useAthena from '@/hooks/useAthena';
import ATHENA_KEYS from '@/constants/athena';
import { TrackingEventMappings } from '@/components/ShipmentTracker/trackingConstants';
import ShipmentTrackingBanner from './ShipmentTrackingBanner';

const colors = {
  successGreen: 'rgb(0, 107, 43)',
  warningYellow: 'rgb(255, 200, 12)',
  informationBlue: 'rgb(28, 73, 194)',
};

describe('<ShipmentTrackingBanner />', () => {
  const render = (props) =>
    renderWrap(ShipmentTrackingBanner, {
      defaultProps: props,
    })();

  beforeAll(() => {
    jest.spyOn(features, 'useFeature').mockReturnValue(true);

    jest.spyOn(useAthena, 'default').mockReturnValue({
      getLang: (key) =>
        ({
          [ATHENA_KEYS.CONTEXTUAL_MESSAGING]: TrackingEventMappings,
          trackPackageLabel: 'Track Package',
        }[key]),
    });
  });

  test('it should render an Information banner', () => {
    const { queryByTestId } = render({
      trackingEvent: {
        eventCode: 'AVAILABLE_FOR_PICKUP',
        subEventCode: 'HP',
        internalMessage: {
          message: 'Your package has been delivered!',
        },
      },
      onTrackPackage: jest.fn(),
    });

    const banner = queryByTestId('shipment-tracking-banner');
    expect(banner).toBeInTheDocument();

    const styles = getComputedStyle(banner);
    expect(styles.backgroundColor).toBe(colors.informationBlue);
  });

  test('it should render a Success banner', () => {
    const { queryByTestId } = render({
      trackingEvent: {
        eventCode: 'DELIVERED',
        subEventCode: 'DN',
        internalMessage: {
          message: 'Your package has been delivered!',
        },
      },
      onTrackPackage: jest.fn(),
    });

    const banner = queryByTestId('shipment-tracking-banner');
    expect(banner).toBeInTheDocument();

    const styles = getComputedStyle(banner);
    expect(styles.backgroundColor).toBe(colors.successGreen);
  });

  test('it should render a Warning banner', () => {
    const { queryByTestId } = render({
      trackingEvent: {
        eventCode: 'LOST',
        subEventCode: 'LC',
        internalMessage: {
          message: 'Your package has been delivered!',
        },
      },
      onTrackPackage: jest.fn(),
    });

    const banner = queryByTestId('shipment-tracking-banner');
    expect(banner).toBeInTheDocument();

    const styles = getComputedStyle(banner);
    expect(styles.backgroundColor).toBe(colors.warningYellow);
  });

  test('it should render nothing when given nonsense', () => {
    const { queryByTestId } = render({
      trackingEvent: {
        eventCode: 'NONSENSE',
        subEventCode: 'LOL',
      },
      onTrackPackage: jest.fn(),
    });

    const banner = queryByTestId('shipment-tracking-banner');
    expect(banner).toBeNull();
  });
});
