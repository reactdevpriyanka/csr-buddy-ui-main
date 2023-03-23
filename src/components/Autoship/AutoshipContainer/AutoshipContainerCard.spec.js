import { renderWrap } from '@utils';
import { fireEvent, waitFor } from '@testing-library/react';
import autoshipOrders from '__mock__/activities/autoship-child-orders';
import * as dateUtils from '@utils/dates';
import AutoshipContainerCard from './AutoshipContainerCard';

describe('<AutoshipContainerCard />', () => {
  const render = renderWrap(AutoshipContainerCard, {
    testId: 'autoship-container-card',
    defaultProps: {
      orderId: '1070051333',
      timePlaced: '2022-02-16T14:39:38.485Z',
      frequency: 'Every 4 weeks',
      total: '31.33',
      status: 'READY_TO_RELEASE',
      customerId: '154492684',
      lineItems: autoshipOrders[0].lineItems,
    },
  });

  test('it should render next shipment date', () => {
    const { getByText } = render();
    const date = dateUtils.getMonthDateTimeTimezone('2022-02-16T14:39:38.485Z');
    const dateStr = `Placed on ${date}`;
    expect(getByText(dateStr)).toBeTruthy();
  });

  test('it should render order titles', () => {
    const { getByText } = render();
    expect(getByText('Order #1070051333')).toBeTruthy();
  });

  test('it should render 2 line items', () => {
    const { getAllByText } = render();
    expect(
      getAllByText(
        'Blue Buffalo Life Protection Formula Adult Chicken & Brown Rice Recipe Dry Dog Food, 15-lb bag',
      ),
    ).toHaveLength(1);
  });
  describe('Hover over info buttons', () => {
    test('it should display 2 info buttons', () => {
      const { getAllByTestId } = render();
      expect(getAllByTestId('summary-poppup-button-1070051333')).toBeTruthy();
    });
  });

  describe('Info tooltips', () => {
    test('it should popup tooltips for info-icon', async () => {
      const { getByTestId, queryAllByText } = render();
      const infoButton = getByTestId('summary-poppup-button-1070051333');
      fireEvent.mouseOver(infoButton);

      await waitFor(() => {
        expect(queryAllByText('Order #1070051333')[1]).toBeTruthy();
        expect(queryAllByText('Frequency: Every 4 weeks')[0]).toBeTruthy();
        expect(queryAllByText('Order Total')[0]).toBeTruthy();
        expect(queryAllByText('$31.33')[0]).toBeTruthy();
        expect(queryAllByText('Status')[0]).toBeTruthy();
        expect(queryAllByText('READY_TO_RELEASE')[0]).toBeTruthy();
      });
    });
  });
});
