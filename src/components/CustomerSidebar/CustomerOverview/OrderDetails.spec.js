import { renderWrap } from '@utils';
import useOrderDetails from '@/hooks/useOrderDetails';
import OrderDetails from './OrderDetails';

jest.mock('@/hooks/useOrderDetails');

describe('<OrderDetails />', () => {
  const render = renderWrap(OrderDetails);

  afterEach(() => {
    useOrderDetails.mockClear();
  });

  describe('For Registered Users', () => {
    test('it should render orders for past 12 months', () => {
      useOrderDetails.mockReturnValue({
        error: null,
        data: {
          ordersFor12MonthRollingPeriod: 20,
          mostRecentOrderPlacedTime: '2021-03-09T16:20:38.716Z',
        },
      });
      const { queryByText } = render({ isGuest: false });

      expect(queryByText('20 Orders In Last 12 Months')).toBeInTheDocument();
    });

    it('defaults to reigstered user', () => {
      useOrderDetails.mockReturnValue({
        error: null,
        data: {
          ordersFor12MonthRollingPeriod: 20,
          mostRecentOrderPlacedTime: '2021-03-09T16:20:38.716Z',
        },
      });
      const { queryByText } = render();

      expect(queryByText('20 Orders In Last 12 Months')).toBeInTheDocument();
    });
  });

  describe('For Guests', () => {
    it('should render 1 year in YYYY', () => {
      useOrderDetails.mockReturnValue({
        error: null,
        data: {
          ordersFor12MonthRollingPeriod: 20,
          mostRecentOrderPlacedTime: '2021-03-09T16:20:38.716Z',
        },
      });
      const { queryByText } = render({ isGuest: true });

      expect(queryByText('20 Orders In Last 12 Months')).toBeNull();

      expect(queryByText('1 Order in 2021')).toBeInTheDocument();
    });
  });

  describe('with no data', () => {
    test('it should render a loader', () => {
      useOrderDetails.mockReturnValue({
        error: null,
        data: null,
      });
      const { getByTestId } = render();
      expect(getByTestId('loader')).toBeInTheDocument();
    });
  });

  describe('when error has occurred', () => {
    test('it should render nothing', () => {
      useOrderDetails.mockReturnValue({
        error: 'DESTROYED',
        data: null,
      });
      const { container } = render();
      expect(container.childNodes).toHaveLength(0);
    });
  });
});
