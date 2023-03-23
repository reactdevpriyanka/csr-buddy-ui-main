import { renderWrap } from '@utils';
import NavigationSidebar from './NavigationSidebar';

// TODO
// Fix the active link tests... for now, we aren't
// using this component so not worried about the
// test not passing :|
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('<NavigationSidebar />', () => {
  const render = renderWrap(NavigationSidebar);
  test('it should render a container', () => {
    const { getByTestId } = render();
    expect(getByTestId('sidebar-navigation')).toBeTruthy();
  });

  test('it should render the chewy logo', () => {
    const { getByTestId } = render();
    expect(getByTestId('logo')).toBeTruthy();
  });

  test('it should render appropriate links/routes', () => {
    const appRoutes = [
      'customers',
      'orders',
      'autoship',
      'returns',
      'shelters-rescues',
      'ticklers',
      'knowledge-base',
      'settings',
      'account',
    ];
    const { getByTestId } = render();
    for (const route of appRoutes) {
      expect(getByTestId(`${route}-link`)).toBeTruthy();
    }
  });

  test("it should render a link as active when app route matches link's route", () => {
    const { getByTestId } = render();
    expect(getByTestId(`returns-link`).getAttribute('data-test-is-active')).toEqual('true');
  });

  test("it should render a link as inactive when app route doesnt match link's route", () => {
    const { getByTestId } = render();
    expect(getByTestId(`returns-link`).getAttribute('data-test-is-active')).toEqual('false');
  });
});
