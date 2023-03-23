import { renderWrap } from '@utils';
import TrackerContent from './TrackerContent';

describe('<TrackerContent />', () => {
  const render = renderWrap(TrackerContent);

  test('it should render its children', () => {
    const children = 'Hello World';

    const { getByText } = render({ children });

    expect(getByText('Hello World')).toBeTruthy();
  });
});
