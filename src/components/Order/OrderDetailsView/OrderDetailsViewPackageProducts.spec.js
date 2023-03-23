import { renderWrap } from '@/utils';
import useCustomer from '@/hooks/useCustomer';
import useOrder from '@/hooks/useOrder';
import customer from '__mock__/customers/nessa';
import lineItems from '__mock__/orderdetails/orderdetails-line-items';
import currPackage from '__mock__/orderdetails/orderdetails-package-data';
import * as features from '@/features';
import OrderDetailsViewPackageProducts from './OrderDetailsViewPackageProducts';

jest.mock('@/hooks/useCustomer');
jest.mock('@/hooks/useOrder');
jest.mock('@/hooks/useAgentInteractions');

describe('<OrderDetailsViewPackageProducts />', () => {
  const defaultProps = {
    orderNumber: '1504724130',
    packageNum: 1,
    lineItems: lineItems,
    currPackage: currPackage,
    status: 'SHIPPED',
    isActionAllowed: () => true,
  };

  useCustomer.mockReturnValue({
    data: customer,
    error: null,
  });
  useOrder.mockReturnValue({
    quantity: '2',
    error: null,
  });

  const render = renderWrap(OrderDetailsViewPackageProducts, { defaultProps });

  test('it should render children', () => {
    expect(render()).toMatchSnapshot();
  });

  test('it should display the OrderDetailsViewPackageProductsContainer', () => {
    const { getByTestId } = render();
    expect(getByTestId(`orderDetailsViewPackageProductsContainer`)).toBeTruthy();
    expect(getByTestId(`orderDetailsViewPackageProductsStatus`)).toHaveTextContent(
      defaultProps.status,
    );
  });

  test('it should display the items quantity minus sign', () => {
    const { getByTestId } = render();
    expect(getByTestId(`gwf:multi-item-quantity-minus`)).toBeTruthy();
  });

  test('it should display the remove item trash icon', () => {
    const { getByTestId } = render();
    expect(getByTestId(`remove-item-trash-icon`)).toBeTruthy();
  });

  test('should display item status', () => {
    jest.spyOn(features, 'useFeature').mockImplementation(() => true);
    const { queryByText } = render();
    expect(queryByText(defaultProps.status)).toBeInTheDocument();
  });

  test('should not display item status', () => {
    jest.spyOn(features, 'useFeature').mockImplementation(() => false);
    const { queryByText } = render();
    expect(queryByText(defaultProps.status)).not.toBeInTheDocument();
  });

  describe('when isActionAllowed equals false', () => {
    const defaultProps = {
      orderNumber: '1504724130',
      packageNum: 1,
      lineItems: lineItems,
      currPackage: currPackage,
      isActionAllowed: () => false,
    };

    useCustomer.mockReturnValue({
      data: customer,
      error: null,
    });

    const render = renderWrap(OrderDetailsViewPackageProducts, { defaultProps });

    test('it should not display the items quantity minus sign', () => {
      const { queryByTestId } = render();
      expect(queryByTestId(`gwf:multi-item-quantity-minus`)).not.toBeInTheDocument();
    });

    test('it should not display the remove item trash icon', () => {
      const { queryByTestId } = render();
      expect(queryByTestId(`remove-item-trash-icon`)).not.toBeInTheDocument();
    });
  });
});
