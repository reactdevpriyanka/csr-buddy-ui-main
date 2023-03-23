import { renderWrap } from '@/utils';
import Button from './Button';

describe('<Button />', () => {
  const onClick = jest.fn();
  const render = renderWrap(Button, {
    defaultProps: {
      onClick,
    },
  });

  const button = (props) => render(props).getByRole('button');

  afterEach(() => onClick.mockReset());

  test('it should render with role = button', () => {
    expect(button()).toBeTruthy();
  });

  test('it should not call onClick by default', () => {
    button();
    expect(onClick).not.toHaveBeenCalled();
  });

  test('it should not render disabled by default', () => {
    expect(button()).not.toBeDisabled();
  });

  describe('when user clicks button', () => {
    test('it should call onclick', () => {
      render.trigger.click(button());
      expect(onClick).toHaveBeenCalled();
    });
  });

  describe('when disabled = true', () => {
    test('it should render disabled', () => {
      expect(button({ disabled: true })).toBeDisabled();
    });
  });
});
