import { renderWrap } from '@utils';
import NewTrackingNumber from './NewTrackingNumber';

describe('<NewTrackingNumber />', () => {
  const shippingModeCode = 'FLATRATE';

  const defaultProps = {
    shippingModeCode,
  };

  const render = renderWrap(NewTrackingNumber, { defaultProps });

  test('it should render carrier', () => {
    const { getByText } = render();

    expect(getByText('FLATRATE')).toBeTruthy();
  });
});
