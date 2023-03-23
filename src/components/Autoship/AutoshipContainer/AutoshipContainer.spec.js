import { renderWrap } from '@utils';
import * as nextRouter from 'next/router';
import useFindChildOrders from '@/hooks/useFindChildOrders';
import { fireEvent, waitFor } from '@testing-library/react';
import autoshipOrders from '__mock__/activities/autoship-child-orders';
import * as dateUtils from '@utils/dates';
import AutoshipContainer from './AutoshipContainer';

jest.mock('@/hooks/useFindChildOrders');

describe('<AutoshipContainer />', () => {
  /**
   * TODO
   * Consider refactoring to reduce dependency on `useRouter` in subcomponents...
   * maybe just write a hook that's easily testable?
   */
  const mockRouter = jest.spyOn(nextRouter, 'useRouter');

  mockRouter.mockReturnValue({
    query: {
      id: '154492684',
    },
  });

  beforeEach(() => {
    useFindChildOrders.mockReturnValue({
      data: autoshipOrders,
      error: null,
    });
  });

  const render = renderWrap(AutoshipContainer, {
    testId: 'autoship-container',
    defaultProps: {
      subscriptionId: '800015346',
      subscriptionName: 'Autoship #2',
      customerId: '154492684',
      frequency: 'Every 4 weeks',
    },
  });

  test('it should render autoship Header', () => {
    const { getByText } = render();
    expect(getByText('Autoship #2')).toBeTruthy();
  });

  test('it should render autoship title', () => {
    const { getByTestId, getByText } = render();
    expect(getByTestId(`autoship-container-orders-count-800015346`)).toHaveTextContent('2');
    expect(getByText('Orders Displayed')).toBeTruthy();
  });

  test('it should render next shipment date', () => {
    const { getByText } = render();
    const date1 = dateUtils.getMonthDateTimeTimezone('2021-09-28T04:01:35.922Z');
    const dateStr1 = `Placed on ${date1}`;

    const date2 = dateUtils.getMonthDateTimeTimezone('2021-09-15T16:37:48.116Z');
    const dateStr2 = `Placed on ${date2}`;

    expect(getByText(dateStr1)).toBeTruthy();
    expect(getByText(dateStr2)).toBeTruthy();
  });

  test('it should render order titles', () => {
    const { getByText } = render();
    expect(getByText('Order #1070051333')).toBeTruthy();
    expect(getByText('Order #1070048468')).toBeTruthy();
  });

  test('it should render 2 line items', () => {
    const { getAllByText } = render();
    expect(
      getAllByText(
        'Blue Buffalo Life Protection Formula Adult Chicken & Brown Rice Recipe Dry Dog Food, 15-lb bag',
      ),
    ).toHaveLength(2);
  });
  describe('Hover over info buttons', () => {
    test('it should display 2 info buttons', () => {
      const { getByTestId } = render();
      expect(getByTestId('summary-poppup-button-1070051333')).toBeTruthy();
    });
  });

  describe('Info tooltips', () => {
    test('it should popup tooltips for info-icon 1', async () => {
      const { getByTestId, getByText, queryAllByText } = render();
      const infoButton = getByTestId('summary-poppup-button-1070051333');
      fireEvent.mouseOver(infoButton);

      await waitFor(() => {
        expect(queryAllByText('Order #1070051333')[1]).toBeTruthy();
        expect(getByText('Frequency: Every 4 weeks')).toBeTruthy();
        expect(getByText('Order Total')).toBeTruthy();
        expect(getByText('$31.33')).toBeTruthy();
        expect(getByText('Status')).toBeTruthy();
        expect(getByText('READY_TO_RELEASE')).toBeTruthy();
      });
    });

    test('it should popup tooltips for info-icon 2', async () => {
      const { getByTestId, getByText, queryAllByText } = render();
      const infoButton = getByTestId('summary-poppup-button-1070048468');
      fireEvent.mouseOver(infoButton);

      await waitFor(() => {
        expect(queryAllByText('Order #1070048468')[1]).toBeTruthy();
        expect(getByText('Frequency: Every 4 weeks')).toBeTruthy();
        expect(getByText('Order Total')).toBeTruthy();
        expect(getByText('$62.66')).toBeTruthy();
        expect(getByText('Status')).toBeTruthy();
        expect(getByText('READY_TO_RELEASE')).toBeTruthy();
      });
    });
  });
});
