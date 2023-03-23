import { renderWrap } from '@/utils';
import orderDetailsViewData from '__mock__/orderdetails/orderdetailsview';
import { useRouter } from 'next/router';
import OrderDetailsOrderTotal from './OrderDetailsOrderTotal';

const defaultProps = {
  ...orderDetailsViewData,
};

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

useRouter.mockReturnValue({
  query: {
    id: '1075268420',
  },
});

describe('<OrderDetailsOrderTotal />', () => {
  const render = renderWrap(OrderDetailsOrderTotal, { defaultProps });

  test('it should render children', () => {
    expect(render()).toMatchSnapshot();
  });
});
