import { renderWrap } from '@/utils';
import * as nextRouter from 'next/router';
import OrderDetailsViewSummary from './OrderDetailsViewSummary';

const defaultProps = {
  orderTotal: '142.08',
  packageCount: 1,
  parentOrderId: '12345678',
  status: 'DEPOSITED',
  timeUpdated: '2022-06-15T05:11:43.219Z',
  totalItems: 6,
  orderNumber: '123123',
  customerId: '123456',
};

describe('<OrderDetailsViewSummary />', () => {
  const mockRouter = jest.spyOn(nextRouter, 'useRouter');

  mockRouter.mockReturnValue({
    query: {
      customerId: '123123',
    },
  });

  const render = renderWrap(OrderDetailsViewSummary, { defaultProps });

  test('it should display the orderDetailsViewSummaryContainer', () => {
    const { getByTestId } = render();
    expect(getByTestId(`orderDetailsViewSummaryContainer`)).toBeTruthy();
  });
});
