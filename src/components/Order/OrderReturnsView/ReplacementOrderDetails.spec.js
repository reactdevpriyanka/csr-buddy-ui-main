import { renderWrap } from '@/utils';
import * as nextRouter from 'next/router';
import returnData from '__mock__/order-api/returnsData';
import ReplacementOrderDetails from './ReplacementOrderDetails';

/* eslint-disable no-template-curly-in-string */

const defaultProps = {
  ...returnData,
};

const mockRouter = jest.spyOn(nextRouter, 'useRouter');

mockRouter.mockReturnValue({
  query: {
    customerId: '123123',
  },
  pathname: '/customers/${customerId}/orders/123456',
});

describe('<ReplacementOrderDetails />', () => {
  const render = renderWrap(ReplacementOrderDetails, { defaultProps });

  test('it should display the replacementOrderDetails', () => {
    const { getByTestId } = render();
    expect(getByTestId(`replacementOrders`)).toBeTruthy();
  });
});
