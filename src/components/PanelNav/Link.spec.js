import { ThemeProvider } from '@material-ui/core/styles';
import { render } from '@testing-library/react';
import theme from '@/theme';
import Link from './Link';

describe('<Link />', () => {
  const component = (jsx) => render(<ThemeProvider theme={theme}>{jsx}</ThemeProvider>);

  test('it should render children', () => {
    const { getByText } = component(<Link href="/">{'Hello World'}</Link>);
    expect(getByText('Hello World')).toBeTruthy();
  });

  describe('with active=true', () => {
    test('it should render with active class', () => {
      const { container } = component(
        <Link href="/" active>
          {'Hello World'}
        </Link>,
      );
      expect(container.querySelector('a')).toMatchInlineSnapshot(`
      <a
        class="makeStyles-root-2 active"
        href="/"
      >
        Hello World
      </a>
      `);
    });
  });
});
