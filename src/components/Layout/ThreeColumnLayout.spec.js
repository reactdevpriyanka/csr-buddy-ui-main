import { renderWrap } from '@utils';
import ThreeColumnLayout from './ThreeColumnLayout';

describe('<ThreeColumnLayout />', () => {
  const render = renderWrap(ThreeColumnLayout);

  test('it should render a container', () => {
    const { getByRole } = render();
    expect(getByRole('main')).toBeTruthy();
  });

  test('it should render app nav', () => {
    const { getByRole } = render();
    expect(getByRole('navigation')).toBeTruthy();
  });

  describe('with sidebar', () => {
    test('it should render sidebar', () => {
      const sidebar = <div className="sidebar" />;
      const { container } = render({ sidebar });
      expect(container.querySelector('.sidebar')).toBeTruthy();
    });
  });

  describe('with content', () => {
    test('it should render content', () => {
      const content = <div className="content" />;
      const { container } = render({ content });
      expect(container.querySelector('.content')).toBeTruthy();
    });
  });

  describe('with children', () => {
    test('it should render children', () => {
      const children = <div className="content" />;
      const { container } = render({ children });
      expect(container.querySelector('.content')).toBeTruthy();
    });
  });
});
