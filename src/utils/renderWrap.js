/* eslint-disable react/jsx-props-no-spreading */
import { render, fireEvent } from '@testing-library/react';
import Providers from '@components/Providers';

const defaultOptions = {
  testId: null,
  defaultProps: {},
};

/**
 * Returns a `render` result from `@testing-library/react` that wraps
 * the component under test in a `ThemeProvider` and creates a QOL
 * function called `andGetByTestId` that returns the element
 * specified by the given `data-testid` attribute value.
 *
 * @param  {React.Component}  Component  the component under test
 * @param  {Object} options
 *   @prop {String} testId  specifies the `testId` of the component under test
 *   @prop {Object} defaultProps  specifies the default props of the component under test
 * @return {Function}
 *
 * ### Examples
 *
 * To use the `@testing-library` functionality, simply use `render` like so:
 * ```js
 * const render = renderWrap(Component);
 * render() // returns a `renderResult` from testing library
 * ```
 *
 * To make use of the `andGetByTestId` function, provide a `testId` option:
 *
 * ```js
 * const render = renderWrap(Component, { testId: 'example' });
 * render.andGetByTestId() // returns the DOM element with `data-testid` 'example'
 * ```
 */
export default function renderWrap(Component, options = defaultOptions) {
  const { testId, defaultProps } = options;

  const fn = (props = {}) => {
    return render(
      <Providers>
        <Component {...defaultProps} {...props} />
      </Providers>,
    );
  };

  fn.andGetByTestId = (props = {}) => {
    const { getByTestId } = fn(props);
    return getByTestId(testId);
  };

  fn.trigger = fireEvent; // @alias
  fn.fireEvent = fireEvent; // @alias

  return fn;
}
