import { renderWrap } from '@utils';
import orderDetailsViewData from '__mock__/orderdetails/orderdetailsview';
import PaymentDetails from './PaymentDetails';

const defaultProps = {
  ...orderDetailsViewData,
  service: 'PayPal',
};

describe('<PaymentDetails />', () => {
  const render = renderWrap(PaymentDetails, { defaultProps });

  test('it should render children', () => {
    expect(render()).toMatchSnapshot();
  });
});
