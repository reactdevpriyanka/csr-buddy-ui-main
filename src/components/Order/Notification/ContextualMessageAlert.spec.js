import { renderWrap } from '@/utils';
import * as features from '@/features';
import * as useAthena from '@/hooks/useAthena';
import ContextualMessageAlert from './ContextualMessageAlert';

const defaultProps = {
  trackingEvent: {
    eventCode: 'ARRANGED_DELIVERY',
    subEventCode: '2S_DE',
    contextualMessage: {
      message: 'In Transit and will arrive on XX/YY',
    },
    internalMessage: {
      message: 'Your package has been delivered!',
    },
  },
};

describe('<ContextualMessageAlert />', () => {
  const render = (props = {}) =>
    renderWrap(ContextualMessageAlert, { defaultProps: { ...defaultProps, ...props } })();

  const athenaSpy = jest.spyOn(useAthena, 'default');

  athenaSpy.mockReturnValue({
    getLang: (key) => {
      return {
        ARRANGED_DELIVERY_2S_DE: {
          infoType: 'Information',
          eventLabel: 'Arranged Delivery',
        },
        CUSTOMER_MOVED_G4_DE: {
          infoType: 'Warning',
          eventLabel: 'Customer Moved',
        },
        DELIVERED_DN: {
          infoType: 'Success',
          eventLabel: 'Delivered to Neighbor',
        },
      };
    },
  });

  beforeAll(() => {
    jest.spyOn(features, 'useFeature').mockImplementation(() => true);
  });

  test('it should render a Information Alert', () => {
    const { getByTestId } = render();

    const contextualMessageAlert = getByTestId(`contextual-message:alert`);
    expect(contextualMessageAlert).toBeTruthy();
    expect(getByTestId(`contextual-message:customer-message`)).toBeTruthy();
    expect(getByTestId(`contextual-message:internal-message`)).toBeTruthy();

    const styles = getComputedStyle(contextualMessageAlert);
    expect(styles.backgroundColor).toBe('rgb(28, 73, 194)');
    expect(styles.color).toBe('rgb(255, 255, 255)');
  });

  test('it should render a Information Alert with no customer message or internal message', () => {
    const { getByTestId } = render({
      trackingEvent: {
        eventCode: 'ARRANGED_DELIVERY',
        subEventCode: '2S_DE',
        internalMessage: {
          message: 'Your package has been delivered!',
        },
      },
    });

    const contextualMessageAlert = getByTestId(`contextual-message:alert`);
    expect(contextualMessageAlert).toBeTruthy();
    expect(getByTestId(`contextual-message:customer-message`)).toHaveTextContent('None');
    expect(getByTestId(`contextual-message:internal-message`)).toBeTruthy();
  });

  test('it should render a Success Alert', () => {
    const { getByTestId } = render({
      trackingEvent: {
        eventCode: 'DELIVERED',
        subEventCode: 'DN',
        contextualMessage: {
          message: 'In Transit and will arrive on XX/YY',
        },
        internalMessage: {
          message: 'Your package has been delivered!',
        },
      },
    });

    const contextualMessageAlert = getByTestId(`contextual-message:alert`);
    expect(contextualMessageAlert).toBeTruthy();

    const styles = getComputedStyle(contextualMessageAlert);
    expect(styles.backgroundColor).toBe('rgb(0, 107, 43)');
    expect(styles.color).toBe('rgb(255, 255, 255)');
  });

  test('it should render a Warning Alert', () => {
    const { getByTestId } = render({
      trackingEvent: {
        eventCode: 'CUSTOMER_MOVED',
        subEventCode: 'G4_DE',
        contextualMessage: {
          message: 'In Transit and will arrive on XX/YY',
        },
        internalMessage: {
          message: 'Your package has been delivered!',
        },
      },
    });

    const contextualMessageAlert = getByTestId(`contextual-message:alert`);
    expect(contextualMessageAlert).toBeTruthy();

    const styles = getComputedStyle(contextualMessageAlert);
    expect(styles.backgroundColor).toBe('rgb(255, 200, 12)');
    expect(styles.color).toBe('rgb(18, 18, 18)');
  });
});
