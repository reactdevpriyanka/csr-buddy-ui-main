import { render, fireEvent } from '@testing-library/react';
import SearchInput from './SearchInput';

describe('<SearchInput />', () => {
  test('it should render with search role', () => {
    const { getByRole } = render(<SearchInput />);
    expect(getByRole('search')).toBeTruthy();
  });

  test('it should render an input element', () => {
    const { container } = render(<SearchInput />);
    expect(container.querySelector('input')).toBeTruthy();
  });

  test('it should have an aria label', () => {
    const { container } = render(<SearchInput />);
    expect(container.querySelector('[aria-label]')).toBeTruthy();
  });

  describe('when user submits', () => {
    test('it should call `onSearch`', () => {
      const onSearch = jest.fn();
      const { container } = render(<SearchInput onSearch={onSearch} />);
      const form = container.querySelector('form');
      fireEvent.submit(form);
      expect(onSearch).toHaveBeenCalled();
    });
  });
});
