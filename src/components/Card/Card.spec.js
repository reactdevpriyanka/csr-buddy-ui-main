import { renderWrap } from '@utils';
import Card from './Card';

describe('<Card />', () => {
  const render = renderWrap(Card, {
    testId: 'card',
  });

  test('it should render children', () => {
    const card = render.andGetByTestId({
      children: 'hello world',
    });

    expect(card).toHaveTextContent('hello world');
  });

  test('it should render content', () => {
    const card = render.andGetByTestId({
      content: 'hello world',
    });

    expect(card).toHaveTextContent('hello world');
  });

  describe('with header', () => {
    test('it should render a header', () => {
      const { getByText } = render({
        header: <div>{'this is a header'}</div>,
      });

      expect(getByText('this is a header')).toHaveTextContent('this is a header');
    });
  });

  describe('with footer', () => {
    test('it should render a footer', () => {
      const { getByText } = render({
        footer: <div>{'this is a footer'}</div>,
      });

      expect(getByText('this is a footer')).toHaveTextContent('this is a footer');
    });
  });
});
