import { renderWrap } from '@utils';
import ItemIcon from './ItemIcon';

describe('<ItemIcon />', () => {
  const render = (props = {}) =>
    renderWrap(ItemIcon, {
      defaultProps: props,
    })();

  test('it should render a Rx order icon given a PHARMACEUTICAL product attribute', () => {
    const { queryByTestId } = render({ attributes: ['PHARMACEUTICAL'] });
    expect(queryByTestId('item-icon:rx-order')).toBeInTheDocument();
    expect(queryByTestId('item-icon:vet-diet')).toBeNull();
  });

  test('it should render a vet diet icon given a VET_DIET product attribute', () => {
    const { queryByTestId } = render({ attributes: ['VET_DIET'] });
    expect(queryByTestId('item-icon:rx-order')).toBeNull();
    expect(queryByTestId('item-icon:vet-diet')).toBeInTheDocument();
  });

  test('it should render no icon given other product attributes', () => {
    const { queryByTestId } = render({ attributes: ['OUT_OF_STOCK'] });
    expect(queryByTestId('item-icon:rx-order')).toBeNull();
    expect(queryByTestId('item-icon:vet-diet')).toBeNull();
  });
});
