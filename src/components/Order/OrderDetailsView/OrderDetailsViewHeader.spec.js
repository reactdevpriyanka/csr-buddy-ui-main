import { renderWrap } from '@/utils';
import { useRouter } from 'next/router';
import * as features from '@/features';
import orderDetailsViewData from '__mock__/orderdetails/orderdetailsview';
import orderDetailsData from '__mock__/orderdetails/orderdetails-oneyearold';
import { fireEvent } from '@testing-library/react';
import Button from '@components/Button';
import Order from '../Order';
import OrderDetailsViewHeader from './OrderDetailsViewHeader';

const mockProcessReturn = jest.fn();

jest.mock('@/hooks/useOrder', () => {
  return () => {
    return {
      processReturn: mockProcessReturn,
    };
  };
});

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const orderNumber = orderDetailsViewData.id;

useRouter.mockReturnValue({
  query: {
    id: orderNumber,
  },
});

describe('<OrderDetailsViewHeader />', () => {
  const defaultProps = {
    ...orderDetailsViewData,
    isActionAllowed: () => true,
  };

  const render = renderWrap(OrderDetailsViewHeader, { defaultProps });

  test('it should display the OrderDetailsViewHeaderContainer', () => {
    const { getByTestId } = render();
    expect(getByTestId(`orderDetailsViewHeaderContainer`)).toBeTruthy();
    expect(getByTestId(`orderDetailsViewHeaderReplacementCard:link`)).toBeTruthy();
  });

  test('it should display action buttons', () => {
    const { getByTestId } = render();
    expect(getByTestId(`order-button-process-${orderNumber}`)).toBeTruthy();
    expect(getByTestId(`order-button-cancel-${orderNumber}`)).toBeTruthy();
    expect(getByTestId(`order-RETURN_ITEMS-cancel-${orderNumber}`)).toBeTruthy();
    expect(getByTestId(`order-button-send-email-${orderNumber}`)).toBeTruthy();
    expect(getByTestId('system-messaging-dialog-button')).toBeTruthy();
  });

  describe('when isActionAllowed equals false', () => {
    const defaultProps = {
      ...orderDetailsViewData,
      isActionAllowed: () => false,
    };

    const render = renderWrap(OrderDetailsViewHeader, { defaultProps });

    test('it should not display action buttons', () => {
      const { queryByTestId } = render();
      expect(queryByTestId(`order-button-process-${orderNumber}`)).not.toBeInTheDocument();
      expect(queryByTestId(`order-button-cancel-${orderNumber}`)).not.toBeInTheDocument();
      expect(queryByTestId(`order-RETURN_ITEMS-cancel-${orderNumber}`)).not.toBeInTheDocument();
      expect(queryByTestId(`order-button-send-email-${orderNumber}`)).not.toBeInTheDocument();
      expect(queryByTestId(`split-button-Send Invoice:menu-item`)).not.toBeInTheDocument();
      expect(queryByTestId(`split-button-Send Confirm:menu-item`)).not.toBeInTheDocument();
      expect(
        queryByTestId(`split-button-Send Cancel Notification:menu-item`),
      ).not.toBeInTheDocument();
    });
  });

  describe('when order is less than one year old', () => {
    const defaultProps = {
      ...orderDetailsViewData,
      isActionAllowed: () => true,
    };

    const render = renderWrap(OrderDetailsViewHeader, { defaultProps });

    test('should not render one year old banner and should render Return Items button', () => {
      jest.spyOn(features, 'useFeature').mockImplementation(() => true);
      const { queryByText } = render();
      expect(queryByText('Orders older than 1 year can not be returned')).not.toBeInTheDocument();
      expect(queryByText('Return Item(s)')).toBeInTheDocument();
    });

    test('should not render one year old banner when oneYearOldFlag is off', () => {
      jest.spyOn(features, 'useFeature').mockImplementation(() => false);
      const { queryByText } = render();
      expect(queryByText('Orders older than 1 year can not be returned')).not.toBeInTheDocument();
      expect(queryByText('Return Item(s)')).toBeInTheDocument();
    });
  });

  describe('when order age is greater than 365 days', () => {
    const defaultProps = {
      ...orderDetailsData,
      isActionAllowed: () => true,
    };

    const render = renderWrap(OrderDetailsViewHeader, { defaultProps });
    const render_order = renderWrap(Order, { defaultProps });

    test('should render one year old banner and should not render Return Items button in order card', () => {
      jest.spyOn(features, 'useFeature').mockImplementation(() => true);
      const { queryByText } = render_order();
      expect(queryByText('Orders older than 1 year can not be returned')).toBeInTheDocument();
      expect(queryByText('Return Item(s)')).not.toBeInTheDocument();
    });

    test('should not render one year old banner in order card when oneYearOldFlag is off', () => {
      jest.spyOn(features, 'useFeature').mockImplementation(() => false);
      const { queryByText } = render_order();
      expect(queryByText('Orders older than 1 year can not be returned')).not.toBeInTheDocument();
    });

    test('should render one year old banner and should not render Return Items button', () => {
      jest.spyOn(features, 'useFeature').mockImplementation(() => true);
      const { queryByText } = render();
      expect(queryByText('Orders older than 1 year can not be returned')).toBeInTheDocument();
      expect(queryByText('Return Item(s)')).not.toBeInTheDocument();
    });

    test('should not render one year old banner when oneYearOldFlag is off', () => {
      jest.spyOn(features, 'useFeature').mockImplementation(() => false);
      const { queryByText } = render();
      expect(queryByText('Orders older than 1 year can not be returned')).not.toBeInTheDocument();
      expect(queryByText('Return Item(s)')).toBeInTheDocument();
    });

    test('should not render return items button when oneYearOldFlag is off and actions not allowed', () => {
      const defaultProps = {
        ...orderDetailsData,
        isActionAllowed: () => false,
      };
      const render = renderWrap(OrderDetailsViewHeader, { defaultProps });
      jest.spyOn(features, 'useFeature').mockImplementation(() => false);
      const { queryByText } = render();
      expect(queryByText('Orders older than 1 year can not be returned')).not.toBeInTheDocument();
      expect(queryByText('Return Item(s)')).not.toBeInTheDocument();
    });
  });

  describe('<Button />', () => {
    const onClick = jest.fn();
    const render = renderWrap(Button, {
      defaultProps: {
        onClick,
        button: 'Process',
      },
    });

    test('should update autoship block', async () => {
      const { getByRole } = render({ button: 'Process' });
      const confirmProcess = getByRole('button', { className: 'Process' });
      expect(confirmProcess).toBeInTheDocument();
      fireEvent.click(confirmProcess);
    });
  });

  describe('<Send Confirm Button />', () => {
    const onClick = jest.fn();
    const render = renderWrap(Button, {
      defaultProps: {
        onClick,
        button: 'Send Confirm',
      },
    });

    test('should click send confirmation', async () => {
      const { getByRole } = render({ button: 'Send Confirm' });
      const confirmProcess = getByRole('button', { className: 'Send Confirm' });
      expect(confirmProcess).toBeInTheDocument();
      fireEvent.click(confirmProcess);
    });
  });
});
