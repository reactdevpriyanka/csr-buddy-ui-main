import { fireEvent, screen, waitFor } from '@testing-library/dom';
import renderWrap from '@/utils/renderWrap';
import usePayment from '@/hooks/usePayment';
import paymentDetailsData from '__mock__/orderdetails/order-payment-details';
import OrderDetailsPayment from './OrderDetailsPayment';

jest.mock('@/hooks/usePayment');

const render = renderWrap(OrderDetailsPayment, {
  defaultProps: {
    orderNumber: '123456789',
  },
});

const filterPaymentDetails = (data = {}, paymentTypes = []) => ({
  ...data,
  // narrow down mock paymentDetailList by paymentTypes
  paymentDetailList: paymentDetailsData.paymentDetailList.filter(
    (detail) =>
      paymentTypes.includes(detail?.paymentMethod.service?.type) ||
      paymentTypes.includes(detail?.paymentMethod.creditCard?.cardType) ||
      paymentTypes.includes(detail?.paymentMethod.type),
  ),
});

describe('<OrderDetailsPayment />', () => {
  describe('heading and dialog link', () => {
    it('renders nothing if a fetch error occurs', () => {
      usePayment.mockReturnValue({ error: true });
      const { container } = render();
      expect(container).toBeEmptyDOMElement();
    });

    it('renders a spinner if data is unavailable', () => {
      usePayment.mockReturnValue({ data: null });
      const { getByRole } = render();
      expect(getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders heading and working dialog link for single payment', async () => {
      usePayment.mockReturnValue({
        data: filterPaymentDetails(paymentDetailsData, ['APPLE_PAY']),
      });
      const { getByText } = render();

      expect(getByText('Payment')).toBeInTheDocument();

      const link = getByText('Payment Details').closest('a');
      expect(link).toBeInTheDocument();
      fireEvent.click(link);
      await waitFor(() => screen.getByTestId('orderDetailsPaymentDetailsDialog'));
    });

    it('renders multiple headings and working dialog links', async () => {
      const paymentTypes = ['APPLE_PAY', 'GOOGLE_PAY'];
      usePayment.mockReturnValue({
        data: filterPaymentDetails(paymentDetailsData, paymentTypes),
      });
      const { getAllByText, getByText } = render();

      expect(getByText('Payment 1 of 2')).toBeInTheDocument();
      expect(getByText('Payment 2 of 2')).toBeInTheDocument();

      const links = getAllByText('Payment Details');
      expect(links).toHaveLength(2);
      for (const link of links) {
        expect(link.closest('a')).toBeInTheDocument();
        fireEvent.click(link);
        await waitFor(() => screen.getByTestId('orderDetailsPaymentDetailsDialog'));
      }
    });
  });

  it('renders balance and status', () => {
    usePayment.mockReturnValue({
      data: filterPaymentDetails(paymentDetailsData, ['GOOGLE_PAY']),
    });
    const { getByText } = render();

    expect(getByText('Balance:')).toBeInTheDocument();
    expect(getByText('$59.00')).toBeInTheDocument();
    expect(getByText('Order Payment Status:')).toBeInTheDocument();

    const paymentStatus = getByText('Deposited');
    expect(paymentStatus).toBeInTheDocument();
    expect(window.getComputedStyle(paymentStatus).color).toBe('green');
  });

  describe('payment types', () => {
    it('renders Unknown payment type', () => {
      usePayment.mockReturnValue({
        data: filterPaymentDetails(paymentDetailsData, ['SOME_UNKNOWN_SERVICE']),
      });
      const { getByTestId, getByText } = render();

      expect(getByTestId('payment-details-icon-SOME_UNKNOWN_SERVICE')).toBeTruthy();
      expect(getByText('Unknown payment type')).toBeInTheDocument();
    });

    it('renders ApplePay', () => {
      usePayment.mockReturnValue({
        data: filterPaymentDetails(paymentDetailsData, ['APPLE_PAY']),
      });
      const { getByTestId, getByText } = render();

      expect(getByTestId('payment-details-icon-APPLE_PAY')).toBeTruthy();
      expect(getByText('ApplePay')).toBeInTheDocument();
    });

    it('renders Google Pay', () => {
      usePayment.mockReturnValue({
        data: filterPaymentDetails(paymentDetailsData, ['GOOGLE_PAY']),
      });
      const { getByTestId, getByText } = render();

      expect(getByTestId('payment-details-icon-GOOGLE_PAY')).toBeTruthy();
      expect(getByText('Google Pay')).toBeInTheDocument();
    });

    it('renders Account Balance', () => {
      usePayment.mockReturnValue({
        data: filterPaymentDetails(paymentDetailsData, ['ACCOUNT_BALANCE']),
      });
      const { getByTestId, getByText } = render();

      expect(getByTestId('payment-details-icon-ACCOUNT_BALANCE')).toBeTruthy();
      expect(getByText('Account Balance')).toBeInTheDocument();
    });

    it('renders PayPal', () => {
      usePayment.mockReturnValue({
        data: filterPaymentDetails(paymentDetailsData, ['PAYPAL']),
      });
      const { getByTestId, getByText } = render();

      expect(getByTestId('payment-details-icon-PAYPAL')).toBeTruthy();
      expect(getByText('ChewyDev42@test.com')).toBeInTheDocument();
    });

    it('renders credit card', () => {
      usePayment.mockReturnValue({
        data: filterPaymentDetails(paymentDetailsData, ['VISA']),
      });
      const { getByTestId, getByText } = render();

      expect(getByTestId('payment-details-icon-VISA')).toBeTruthy();
      expect(getByText('Alex C. Poon')).toBeInTheDocument();
      expect(getByText('4147XXXXXXXX3918')).toBeInTheDocument();
      expect(getByText('Expiry 9/2025')).toBeInTheDocument();
      const paymentState = getByText('Valid');
      expect(paymentState).toBeInTheDocument();
      expect(window.getComputedStyle(paymentState).backgroundColor).toBe('rgb(0, 107, 43)');
    });

    it('renders gift card', () => {
      usePayment.mockReturnValue({
        data: filterPaymentDetails(paymentDetailsData, ['GIFT_CARD']),
      });
      const { getByTestId, getByText } = render();

      expect(getByTestId('payment-details-icon-GIFT_CARD')).toBeTruthy();
      expect(getByText('6211XXXXXXXX8103')).toBeInTheDocument();
      const paymentState = getByText('Valid');
      expect(paymentState).toBeInTheDocument();
      expect(window.getComputedStyle(paymentState).backgroundColor).toBe('rgb(0, 107, 43)');
    });
  });
});
