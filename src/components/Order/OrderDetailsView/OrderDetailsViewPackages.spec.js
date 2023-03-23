import { renderWrap } from '@/utils';
import useCustomer from '@/hooks/useCustomer';
import useOrder from '@/hooks/useOrder';
import customer from '__mock__/customers/nessa';
import itemMap from '__mock__/orderdetails/orderdetails-items_map';
import shipments from '__mock__/orderdetails/orderdetails-shipments';
import releases from '__mock__/orderdetails/orderdetails-releases';
import OrderDetailsViewPackages from './OrderDetailsViewPackages';

jest.mock('@/hooks/useOrder');
jest.mock('@/hooks/useCustomer');
jest.mock('@/hooks/useAgentInteractions');

const defaultProps = {
  orderNumber: '392182423',
  itemMap: itemMap,
  shipments: shipments,
  releases: releases,
  canceledItems: [],
};

describe('<OrderDetailsViewPackages />', () => {
  useCustomer.mockReturnValue({
    data: customer,
    error: null,
  });

  useOrder.mockReturnValue({
    quantity: '2',
    error: null,
  });

  const render = renderWrap(OrderDetailsViewPackages, { defaultProps });

  test('it should display the orderDetailsViewPackagesContainer', () => {
    const { getByTestId } = render();
    expect(getByTestId(`orderDetailsViewPackagesContainer`)).toBeTruthy();
  });
});
