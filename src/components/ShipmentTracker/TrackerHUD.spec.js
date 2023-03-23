import { renderWrap } from '@utils';
import TrackerHUD from './TrackerHUD';

describe('<TrackerHUD />', () => {
  const progress = 0;

  const defaultProps = {
    progress,
  };

  const render = renderWrap(TrackerHUD, { defaultProps });

  render.andGetProgressBar = (props = {}) => {
    const { container } = render(props);
    return container.querySelector('[aria-valuenow]');
  };

  const values = [];
  for (let i = 0; i < 101; i += 1) values.push(i);

  for (const value of values) {
    test(`it should render with ${value} progress value`, () => {
      const bar = render.andGetProgressBar({ progress: value });
      expect(bar).toHaveAttribute('aria-valuenow', value.toString());
    });
  }

  const invalids = [
    [undefined, 'undefined', 0],
    [null, 'null', 0],
    [-1, 'below 100%', 0],
    [101, 'above 100%', 100],
  ];

  for (const invalid of invalids) {
    const [value, label, expected] = invalid;
    describe(`with value of ${label}`, () => {
      test(`it should render with ${expected} progress`, () => {
        const bar = render.andGetProgressBar({ progress: value });
        expect(bar).toHaveAttribute('aria-valuenow', expected.toString());
      });
    });
  }
});
