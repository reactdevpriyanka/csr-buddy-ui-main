import PropTypes from 'prop-types';
import renderWrap from './renderWrap';

const ExampleComponent = ({ prop, children }) => {
  return (
    <div data-testid="example" data-prop={prop}>
      {children}
    </div>
  );
};

ExampleComponent.propTypes = {
  prop: PropTypes.any,
  children: PropTypes.node,
};

describe('utils.renderWrap', () => {
  test('it should render a component', () => {
    const render = renderWrap(ExampleComponent);
    const { getByTestId } = render();
    const el = getByTestId('example');
    expect(el).toBeEmptyDOMElement();
  });

  test('it should accept props to render', () => {
    const render = renderWrap(ExampleComponent);
    const { getByTestId } = render({ prop: '2' });
    const el = getByTestId('example');
    expect(el).toHaveAttribute('data-prop', '2');
  });

  test('it should provide aliases to trigger events', () => {
    const render = renderWrap(ExampleComponent);
    expect(render).toHaveProperty('trigger');
    expect(render).toHaveProperty('fireEvent');
  });

  describe('with options', () => {
    describe('with defaultProps', () => {
      test('it should render with default props', () => {
        const render = renderWrap(ExampleComponent, {
          defaultProps: { prop: 2 },
        });

        const { getByTestId } = render();

        expect(getByTestId('example')).toHaveAttribute('data-prop', '2');
      });

      test('it should allow overriding default props', () => {
        const render = renderWrap(ExampleComponent, {
          defaultProps: { prop: 2 },
        });

        const { getByTestId } = render({ prop: 3 });

        expect(getByTestId('example')).toHaveAttribute('data-prop', '3');
      });
    });

    describe('with testId', () => {
      test('andGetByTestId should return element', () => {
        const render = renderWrap(ExampleComponent, { testId: 'example' });
        expect(render.andGetByTestId()).toBeEmptyDOMElement();
      });

      test('andGetByTestId should accept props to render', () => {
        const render = renderWrap(ExampleComponent, { testId: 'example' });
        expect(render.andGetByTestId({ prop: '2' })).toHaveAttribute('data-prop', '2');
      });

      describe('with null testId', () => {
        test('andGetByTestId should throw exception', () => {
          const render = renderWrap(ExampleComponent, { testId: null });
          expect(() => render.andGetByTestId()).toThrow();
        });
      });
    });
  });
});
