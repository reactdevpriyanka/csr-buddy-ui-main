import { renderWrap } from '@/utils';
import mockReturnData from '__mock__/order-api/returnsData';
import ReturnDetailsItems from './ReturnDetailsItems';

const defaultProps = {
  returnData: mockReturnData,
};

describe('<ReturnDetailsItems />', () => {
  const render = renderWrap(ReturnDetailsItems, { defaultProps });

  test('it should display the returnDetailsItems', () => {
    const { getByTestId } = render();
    expect(getByTestId(`returnDetailsItems`)).toBeTruthy();
    expect(getByTestId(`returnItem:1504464333:totalCredit`).textContent).toEqual('$6.44');
  });
});
