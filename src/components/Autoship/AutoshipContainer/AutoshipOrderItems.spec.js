import { renderWrap } from '@utils';
import { fireEvent, waitFor } from '@testing-library/react';
import autoshipOrders from '__mock__/activities/autoship-child-orders';
import AutoshipOrderItems from './AutoshipOrderItems';

describe('<AutoshipOrderItems />', () => {
  const render = renderWrap(AutoshipOrderItems, {
    testId: 'autoship-order-items',
    defaultProps: {
      items: autoshipOrders[0].lineItems,
    },
  });

  test('it should render 1 line items', () => {
    const { getAllByText } = render();
    expect(
      getAllByText(
        'Blue Buffalo Life Protection Formula Adult Chicken & Brown Rice Recipe Dry Dog Food, 15-lb bag',
      ),
    ).toHaveLength(1);
  });

  describe('Description tooltip', () => {
    test('it should popup tooltips for description', async () => {
      const { getByTestId, getAllByText } = render();
      const descriptionText = getByTestId('order-items-381321355');
      fireEvent.mouseOver(descriptionText);

      await waitFor(() => {
        expect(
          getAllByText(
            'Blue Buffalo Life Protection Formula Adult Chicken & Brown Rice Recipe Dry Dog Food, 15-lb bag',
          ),
        ).toHaveLength(1);
      });
    });
  });
});
