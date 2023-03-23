/* eslint-disable no-unused-vars */
import { renderWrap } from '@utils';
import useCustomer from '@/hooks/useCustomer';
import useOrderDetails from '@/hooks/useOrderDetails';
import { useRouter } from 'next/router';
import customerData from '__mock__/customers/happy';
import CustomerOverview from './CustomerOverview';

jest.mock('@/hooks/useCustomer');
jest.mock('@/hooks/useOrderDetails');
jest.mock('@/hooks/useEnactment');
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('<CustomerOverview />', () => {
  const render = renderWrap(CustomerOverview);

  describe('Should show address book icon', () => {
    beforeEach(() => {
      useCustomer.mockReturnValue({
        data: customerData,
        error: null,
      });
      useOrderDetails.mockReturnValue({
        error: null,
        data: {
          ordersFor12MonthRollingPeriod: 20,
        },
      });
      useRouter.mockReturnValue({
        query: {
          id: '123123',
        },
      });
    });

    test('it should show the customers name', () => {
      const { getByTestId } = render();
      expect(getByTestId('customer-sidebar:static-customer-name')).toBeInTheDocument();
    });

    test('it should not show the member since date', () => {
      const { queryByTestId } = render();
      expect(queryByTestId('customer=-sidebar:member-since')).toBeInTheDocument();
    });
  });

  describe('Registered Users', () => {
    beforeEach(() => {
      const registeredData = { ...customerData, registerType: 'R' };

      useCustomer.mockReturnValue({
        data: registeredData,
        error: null,
      });
      useOrderDetails.mockReturnValue({
        error: null,
        data: {
          ordersFor12MonthRollingPeriod: 20,
        },
      });
      useRouter.mockReturnValue({
        query: {
          id: '123123',
        },
      });
    });

    it('Doesnt render the guest badge', () => {
      const { queryByTestId } = render();
      expect(queryByTestId('customeroverview:guest')).toBeNull();
    });
  });

  describe('Guest Users', () => {
    beforeEach(() => {
      const registeredData = { ...customerData, registerType: 'ONETIME' };

      useCustomer.mockReturnValue({
        data: registeredData,
        error: null,
      });
      useOrderDetails.mockReturnValue({
        error: null,
        data: {
          ordersFor12MonthRollingPeriod: 20,
        },
      });
      useRouter.mockReturnValue({
        query: {
          id: '123123',
        },
      });
    });

    it('renders the guest badge', () => {
      const { queryByTestId } = render();
      expect(queryByTestId('customeroverview:guest')).toBeInTheDocument();
    });
  });
});
