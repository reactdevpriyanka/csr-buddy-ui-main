import { renderWrap } from '@/utils';
import returnData from '__mock__/order-api/returnsData';
import ReturnRefundDetails from './ReturnRefundDetails';

const defaultProps = {
  ...returnData,
};

describe('<ReturnRefundDetails />', () => {
  const render = renderWrap(ReturnRefundDetails, { defaultProps });

  test('it should display the returnRefundDetails', () => {
    const { getByTestId } = render();
    expect(getByTestId(`returnRefundDetails`)).toBeTruthy();
  });

  test('it should display Payment method title', () => {
    const { getByText } = render();
    expect(getByText(`Payment method`)).toBeInTheDocument();
  });
  test('it should display Concession Payment title', () => {
    const { getByText } = render();
    expect(getByText(`Concession Payment`)).toBeInTheDocument();
  });
  test('it should display Instruction ID title', () => {
    const { getByText } = render();
    expect(getByText(`Instruction ID`)).toBeInTheDocument();
  });
  test('it should display Status title', () => {
    const { getByText } = render();
    expect(getByText(`Status`)).toBeInTheDocument();
  });
});
