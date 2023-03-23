import { renderWrap } from '@utils';
import TrackerEvent from './TrackerEvent';

describe('<TrackerEvent />', () => {
  const render = renderWrap(TrackerEvent);

  test('it should render title', () => {
    const { getByText } = render({ title: 'Order created' });
    expect(getByText('Order created')).toBeTruthy();
  });

  test('it should render subtitle', () => {
    const { getByText } = render({ subtitle: 'Created on 02/17 | Web' });
    expect(getByText('Created on 02/17 | Web')).toBeTruthy();
  });
});
