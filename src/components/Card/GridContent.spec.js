import mediaQuery from 'css-mediaquery';
import { renderWrap } from '@utils';
import theme from '@/theme';
import range from 'lodash/range';
import GridContent from './GridContent';

// https://mui.com/components/use-media-query/#testing
function createMatchMedia(width) {
  return (query) => ({
    matches: mediaQuery.match(query, {
      width,
    }),
    addListener: () => {},
    removeListener: () => {},
  });
}

const LARGE_SCREEN_WIDTH = theme.breakpoints.values.lg;

describe('<GridContent />', () => {
  const render = renderWrap(GridContent, {
    testId: 'card:gridcontent',
  });

  test('it should render children', () => {
    const { getByText } = render({
      children: [
        <div key={1}>{'hello'}</div>,
        <div key={2}>{'from'}</div>,
        <div key={3}>{'csr buddy'}</div>,
      ],
    });

    for (const text of ['hello', 'from', 'csr buddy']) {
      expect(getByText(text)).toBeTruthy();
    }
  });

  describe('responsive features', () => {
    const renderGrid = (numberOfChildrenToRender) =>
      render.andGetByTestId({
        children: range(numberOfChildrenToRender).map((key) => <div key={key} />),
      });

    describe('on small screens', () => {
      beforeEach(() => {
        window.matchMedia = createMatchMedia(`${LARGE_SCREEN_WIDTH - 1}px`);
      });

      test('it should render without grid class when there is only one child', () => {
        expect(renderGrid(1)).not.toHaveClass('grid');
      });

      test('it should render without grid class when there are multiple children', () => {
        expect(renderGrid(2)).not.toHaveClass('grid');
      });
    });

    describe('on large screens', () => {
      beforeEach(() => {
        window.matchMedia = createMatchMedia(`${LARGE_SCREEN_WIDTH}px`);
      });

      test('it should render without grid class when there is only one child', () => {
        expect(renderGrid(1)).not.toHaveClass('grid');
      });

      test('it should render with grid class when there are multiple children', () => {
        expect(renderGrid(2)).toHaveClass('grid');
      });
    });
  });

  describe('with disabled={true}', () => {
    const cancelled = (props = {}) =>
      render({
        disabled: true,
        children: [<div key="1" />],
        ...props,
      });

    test('it should render with disabled class', () => {
      const { getByTestId } = cancelled();
      expect(getByTestId('card:gridcontent')).toHaveClass('disabled');
    });
  });
});
