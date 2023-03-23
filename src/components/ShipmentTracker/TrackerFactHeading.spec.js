import { renderWrap } from '@utils';
import TrackerFactHeading from './TrackerFactHeading';

describe('<TrackerFactHeading />', () => {
  const heading = 'Oppa, GS';

  const help = 'Oppa gangnam style';

  const defaultProps = { heading, help };

  const render = renderWrap(TrackerFactHeading, { defaultProps });

  test('it should render heading', () => {
    const { getByText } = render();
    expect(getByText(heading)).toBeTruthy();
  });

  test('it should render help', () => {
    const { getByText } = render();
    expect(getByText(help)).toBeTruthy();
  });
});
