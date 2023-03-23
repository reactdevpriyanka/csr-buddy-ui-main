import { renderWrap } from '@utils';
import Select from './Select';

/**
 * FIXME
 * Long story short: Material UI seems to do some hacking around
 * under the hood to get `jsdom` to work for their tests;
 * after trying for a few hours to get a few basic tests
 * working it quickly became apparent that we would have
 * to maintain the same hackery and that their component
 * is well-tested enough.
 *
 * You can see the test coverage here:
 * {https://github.com/mui-org/material-ui/blob/next/packages/material-ui/src/Select/Select.test.js}
 *
 * If someone does manage to figure out how to get the options
 * by role or something, please do fix this file to have more
 * than one basic test.
 *
 * Otherwise, leaving this to the integration/regression suites.
 */

describe('<Select />', () => {
  const options = [
    { id: 1, label: 'Burgers' },
    { id: 2, label: 'Dogs' },
    { id: 3, label: 'Bacon Burger Dogs' },
  ];

  const defaultProps = {
    options,
  };

  const render = renderWrap(Select, { defaultProps });

  test('it should mount the component', () => {
    const { getAllByRole } = render();
    expect(() => getAllByRole('button')).not.toThrow();
  });
});
