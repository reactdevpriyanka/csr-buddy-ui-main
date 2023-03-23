import { renderWrap } from '@utils';
import Header from './Header';

describe('<Header />', () => {
  const render = renderWrap(Header);

  test('it should render its children', () => {
    const children = <div>{'Hello World'}</div>;

    expect(render({ children })).toMatchSnapshot();
  });
});
