import { ThemeProvider } from '@material-ui/core/styles';
import { render } from '@testing-library/react';
import theme from '@/theme';
import PanelNav from './PanelNav';

describe('<PanelNav />', () => {
  const component = (props = {}) =>
    render(
      <ThemeProvider theme={theme}>
        <PanelNav {...props} /> {/* eslint-disable-line react/jsx-props-no-spreading */}
      </ThemeProvider>,
    );

  test('it should have navigation role', () => {
    const { getByRole } = component();
    expect(getByRole('navigation')).toBeTruthy();
  });

  test('it should render children', () => {
    const children = (
      <>
        <a href="/">{'About'}</a>
        <a href="/thing">{'Thing'}</a>
        <a href="/things">{'Things'}</a>
      </>
    );

    const { container } = component({ children });

    expect(container.querySelectorAll('a')).toHaveLength(3);
  });
});
