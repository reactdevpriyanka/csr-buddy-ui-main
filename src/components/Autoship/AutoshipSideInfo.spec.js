import { renderWrap, formatDateWithTime } from '@utils';
import autoshipActiveOrder from '__mock__/activities/autoship-active-order';
import PaymentDetails from '@components/PaymentDetails';
import AutoshipSideInfo from './AutoshipSideInfo';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '/autoship',
    };
  },
}));

describe('<AutoshipSideInfo />', () => {
  const paymentDetails = <PaymentDetails details={autoshipActiveOrder.paymentMethods} />;
  const subscriptionData = autoshipActiveOrder;
  const startDate = '2021-07-26T16:14:02.537Z';

  const render = renderWrap(AutoshipSideInfo, {
    defaultProps: {
      subscriptionData,
      paymentDetails,
      startDate,
      onSeeHistory: jest.fn(),
      isCancelled: false,
      name: 'Autoship #1',
      nextFulfillmentDate: '2022-10-22T23:00:00Z',
      lastShipmentDate: '2021-11-30T05:01:19.298Z',
      cancelDate: undefined,
      products: [
        {
          id: '46861',
          title:
            'Blue Buffalo Life Protection Formula Adult Chicken & Brown Rice Recipe Dry Dog Food, 30-lb bag',
          price: '55.98',
          quantity: 1,
          thumbnail: '//img.chewy.com/is/image/catalog/46861_MAIN,1636150597',
          catalogEntryId: '32041',
        },
      ],
      isUpcoming: true,
      lastOrderStatus: undefined,
      status: 'ACTIVE',
      frequency: 'Every 4 weeks',
    },
  });

  describe('with active autoship', () => {
    test('it should render Autoship ID', () => {
      const { getByText } = render();
      expect(getByText(`Autoship ID 800011931`)).toBeTruthy();
      // TODO: better way to test dates regardless of execution environment
      expect(
        getByText(`Autoship Created on ${formatDateWithTime(subscriptionData?.timePlaced)}`),
      ).toBeTruthy();
    });

    test('it should render shipping address', () => {
      const { getByText } = render();
      expect(getByText('Collin Test')).toBeTruthy();
      expect(getByText('343 Congress St')).toBeTruthy();
      expect(getByText('Apt 3b')).toBeTruthy();
      expect(getByText('Boston, MA 02210-1232')).toBeTruthy();
      expect(getByText('US')).toBeTruthy();
    });

    test('it should render payment details', () => {
      const { getByText } = render();
      expect(getByText('John Doe')).toBeTruthy();
      expect(getByText('AMEX ending in 1347')).toBeTruthy();
    });

    test('it should render View link for payment details', () => {
      const { getByTestId } = render();
      expect(
        getByTestId(`autoship:payment:viewdetails:link:label:${subscriptionData?.id}`),
      ).toBeTruthy();
    });
  });
});
