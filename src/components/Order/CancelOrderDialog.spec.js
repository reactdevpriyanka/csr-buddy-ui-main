import { renderWrap } from '@/utils';
import orderCancelReasons from '__mock__/order-api/orderCancelReasons';
import useOrderActionReasons from '@/hooks/useOrderActionReasons';
import * as useAgentInteractions from '@/hooks/useAgentInteractions';
import * as useOrder from '@/hooks/useOrder';
import { useRouter } from 'next/router';
import { within, fireEvent } from '@testing-library/dom';
import { waitFor, act } from '@testing-library/react';
import { titleCaseToSnakeCase } from '@/utils/string';
import CancelOrderDialog from './CancelOrderDialog';
const defaultProps = {
  cancelOrderDialogOpen: true,
  setParentClose: () => null,
  orderNumber: '1070030590',
};

const customerid = '1075268420';

jest.mock('@/hooks/useOrderActionReasons');
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

useRouter.mockReturnValue({
  query: {
    id: customerid,
  },
});

useOrderActionReasons.mockReturnValue({
  data: orderCancelReasons,
});

describe('<CancelOrderDialog />', () => {
  const render = renderWrap(CancelOrderDialog, { defaultProps });

  describe('initial load', () => {
    test('it should display the cancel order dialog', () => {
      const { getByTestId } = render();
      expect(getByTestId(`order:cancel-dialog-${defaultProps.orderNumber}`)).toBeTruthy();
    });

    test('it should display cancel comments textfield', () => {
      const { getByTestId } = render();
      expect(getByTestId(`order:cancel-comment-${defaultProps.orderNumber}`)).toBeTruthy();
    });

    test('it should render a confirm cancel button', () => {
      const { getByTestId } = render();
      expect(getByTestId(`order:confirm-cancel-button-${defaultProps.orderNumber}`)).toBeTruthy();
    });

    test('it should render a disabled confirm button', () => {
      const { getByTestId } = render();
      expect(
        getByTestId(`order:confirm-cancel-button-${defaultProps.orderNumber}`),
      ).toHaveAttribute('disabled');
    });
  });

  describe('reason dropdown', () => {
    it('lists all cancel reasons on dropdown click', () => {
      const { getByTestId } = render();

      const select = getByTestId(`order:cancel-reason-${defaultProps.orderNumber}`);
      fireEvent.click(within(select).getByRole('button'));
      fireEvent.mouseDown(within(select).getByRole('button'));

      const reasonList = orderCancelReasons.map((reason) => reason.label);

      reasonList.map((reason) =>
        expect(getByTestId(`order:cancel-menu-item-${reason}`)).toBeTruthy(),
      );
    });

    it('undisables confirm button on reason select', () => {
      const { getByTestId } = render();
      const reason = orderCancelReasons[0].label;
      const select = getByTestId(`order:cancel-reason-${defaultProps.orderNumber}`);
      fireEvent.click(within(select).getByRole('button'));
      fireEvent.mouseDown(within(select).getByRole('button'));
      fireEvent.change(select.querySelector('input'), { target: { value: reason } });
      expect(select.querySelector('input')).toHaveValue(reason);

      expect(
        getByTestId(`order:confirm-cancel-button-${defaultProps.orderNumber}`),
      ).not.toHaveAttribute('disabled');
    });
  });

  describe('submit cancel order', () => {
    it('propagates the extra comments, reasons, and skip notif', async () => {
      const captureInteractionMock = jest.fn().mockReturnValue(Promise.resolve({ data: [] }));
      jest
        .spyOn(useAgentInteractions, 'default')
        .mockImplementation(() => ({ captureInteraction: captureInteractionMock }));
      const cancelOrderMock = jest.fn(() => Promise.resolve({ data: [] }));

      jest.spyOn(useOrder, 'default').mockImplementation(() => ({ cancelOrder: cancelOrderMock }));

      const { getByTestId } = render();
      const reason = orderCancelReasons[1].label;
      const select = getByTestId(`order:cancel-reason-${defaultProps.orderNumber}`);
      const commentsInput = getByTestId(`order:cancel-comment-input-${defaultProps.orderNumber}`);
      const cancelOrder = getByTestId(`order:confirm-cancel-button-${defaultProps.orderNumber}`);
      const skipNotifCheckbox = within(
        getByTestId(`order:cancel-dialog-${defaultProps.orderNumber}`),
      ).getByRole('checkbox');

      expect(skipNotifCheckbox).toBeTruthy();

      act(() => {
        fireEvent.click(within(select).getByRole('button'));
        fireEvent.mouseDown(within(select).getByRole('button'));
        fireEvent.change(select.querySelector('input'), { target: { value: reason } });
        fireEvent.change(commentsInput, { target: { value: 'extra comment' } });
        fireEvent.click(skipNotifCheckbox);
      });

      expect(
        getByTestId(`order:confirm-cancel-button-${defaultProps.orderNumber}`),
      ).not.toHaveAttribute('disabled');
      expect(commentsInput).toHaveValue('extra comment');

      act(() => {
        fireEvent.click(cancelOrder);
      });

      await waitFor(() => expect(cancelOrderMock.mock.calls).toHaveLength(1));

      const cancelBody = cancelOrderMock.mock.calls[0][0];
      expect(cancelBody).toMatchObject({
        orderId: defaultProps.orderNumber,
        cancelReason: titleCaseToSnakeCase(reason),
        comments: 'extra comment',
        skipNotification: false,
      });
    });

    it('invokes cancelOrder and recordInteraction on confirm cancel', async () => {
      const captureInteractionMock = jest.fn().mockReturnValue(Promise.resolve({ data: [] }));
      jest
        .spyOn(useAgentInteractions, 'default')
        .mockImplementation(() => ({ captureInteraction: captureInteractionMock }));
      const cancelOrderMock = jest.fn(() => Promise.resolve({ data: [] }));

      jest.spyOn(useOrder, 'default').mockImplementation(() => ({ cancelOrder: cancelOrderMock }));

      const { getByTestId } = render();
      const reason = orderCancelReasons[0].label;
      const select = getByTestId(`order:cancel-reason-${defaultProps.orderNumber}`);
      const cancelOrder = getByTestId(`order:confirm-cancel-button-${defaultProps.orderNumber}`);

      act(() => {
        fireEvent.click(within(select).getByRole('button'));
        fireEvent.mouseDown(within(select).getByRole('button'));
        fireEvent.change(select.querySelector('input'), { target: { value: reason } });
      });

      expect(
        getByTestId(`order:confirm-cancel-button-${defaultProps.orderNumber}`),
      ).not.toHaveAttribute('disabled');

      act(() => {
        fireEvent.click(cancelOrder);
      });

      await waitFor(() => expect(captureInteractionMock.mock.calls).toHaveLength(1));
      await waitFor(() => expect(cancelOrderMock.mock.calls).toHaveLength(1));

      const interactionArgs = captureInteractionMock.mock.calls[0];

      expect(interactionArgs).toHaveLength(1);
      expect(interactionArgs[0]).toMatchObject({
        type: 'CANCELLED_ORDER',
        subjectId: defaultProps.orderNumber,
        action: 'UPDATE',
        prevVal: {},
      });

      const cancelOrderBody = cancelOrderMock.mock.calls[0][0];

      expect(cancelOrderBody).toStrictEqual(interactionArgs[0].currentVal);
    });
  });
});
