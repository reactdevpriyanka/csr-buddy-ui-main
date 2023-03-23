import { renderWrap } from '@/utils';
import * as nextRouter from 'next/router';
import returnData from '__mock__/order-api/returnsData';
import ReturnDetailsViewSummary from './ReturnDetailsViewSummary';

/* eslint-disable no-template-curly-in-string */

const defaultProps = {
  ...returnData,
};

describe('<ReturnDetailsViewSummary />', () => {
  const mockRouter = jest.spyOn(nextRouter, 'useRouter');

  mockRouter.mockReturnValue({
    query: {
      customerId: '123123',
    },
    pathname: '/customers/${customerId}/orders/12323',
  });

  const render = renderWrap(ReturnDetailsViewSummary, { defaultProps });

  test('it should display the returnDetailsViewSummary', () => {
    const { getByTestId } = render();
    expect(getByTestId(`returnDetailsViewSummaryContainer`)).toBeTruthy();
  });
});
