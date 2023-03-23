import { renderWrap } from '@utils';
import TextField from './TextField';

describe('<TextField />', () => {
  const render = renderWrap(TextField, {
    testId: 'vildemort',
    defaultProps: {
      disabled: false,
      id: 'vildemort',
      label: 'Vildemort',
      name: 'vildemort',
      'data-testid': 'vildemort',
      value: '',
    },
  });

  test('it should render a label', () => {
    const { getByLabelText } = render();
    expect(getByLabelText('Vildemort')).toBeTruthy();
  });

  test('it should render a label with htmlFor={id}', () => {
    const { getByText } = render();
    const label = getByText('Vildemort');
    expect(label).toBeTruthy();
    expect(label).toHaveAttribute('for', 'vildemort');
  });

  test('it should render an input', () => {
    const { getByDisplayValue } = render({ value: 'Vildemort shall pass' });
    expect(getByDisplayValue('Vildemort shall pass')).toBeTruthy();
  });

  test('it should render an input with id={id}', () => {
    const { getByDisplayValue } = render({ value: 'Vildy' });
    const input = getByDisplayValue('Vildy');
    expect(input).toHaveAttribute('id', 'vildemort');
  });

  test('it should render className passed by props', () => {
    const { container } = render({ className: 'any-css-className' });
    const root = container.querySelector('.any-css-className');
    expect(root).toBeInTheDocument();
  });

  test('it should render data-testid passed by props', () => {
    const { getByTestId } = render({ 'data-testid': 'any-testid' });
    const root = getByTestId('any-testid');
    expect(root).toBeInTheDocument();
  });

  describe('when user enters input', () => {
    test('it should accept input', () => {
      const { getByRole } = render();
      const input = getByRole('textbox', 'vildemort'); //who this - spelling?
      render.trigger.change(input, { target: { value: '123' } });
      expect(input).toHaveValue('123');
    });
  });

  describe('when disabled=true', () => {
    test('it should render a disabled input', () => {
      const { getByRole } = render({ disabled: true });
      const input = getByRole('textbox', 'vildemort');
      expect(input).toBeDisabled();
    });
  });
});
