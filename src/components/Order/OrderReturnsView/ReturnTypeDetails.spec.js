import { renderWrap } from '@/utils';
import returnData from '__mock__/order-api/returnsData';
import ReturnTypeDetails from './ReturnTypeDetails';

const defaultProps = {
  ...returnData,
};

describe('<ReturnTypeDetails />', () => {
  const render = renderWrap(ReturnTypeDetails, { defaultProps });

  test('it should render children', () => {
    expect(render()).toMatchSnapshot();
  });

  test('it should display the payment method type', () => {
    const { getByTestId } = render();
    expect(getByTestId(`return:${returnData?.payment?.paymentMethod?.type}`)).toBeTruthy();
  });
});
