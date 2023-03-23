import { renderWrap } from '@utils';
import ContextMessageDetails from './ContextMessageDetails';

describe('<ContextMessageDetails />', () => {
  const data = {
    subEventCode: '_AR',
    description: 'Package arrived at carrier facility',
    contextualMessage: {
      message: 'In Transit and will arrive on XX/YY',
    },
    internalMessage: {
      message:
        'Package got an inbound scan with the carrier. This means that the carrier has inducted the package in their network and delivery is progressing normally.',
    },
    eventCode: 'ARRIVAL_SCAN',
  };

  const title = 'Arrival Scan';
  const subtitle = 'Sat, Jul 2 (4:27 AM EST)';

  const defaultProps = {
    data,
    title,
    subtitle,
  };

  const render = renderWrap(ContextMessageDetails, { defaultProps });

  describe('When viewing tracking events', () => {
    test('it should render context message event data', () => {
      const { getByText } = render();
      expect(getByText(title)).toBeTruthy();
      expect(getByText(subtitle)).toBeTruthy();
      expect(getByText('Customer Message:')).toBeTruthy();
      expect(getByText('CSR Guidance:')).toBeTruthy();
      expect(getByText(data?.contextualMessage?.message)).toBeInTheDocument();
      expect(getByText(data?.internalMessage?.message)).toBeInTheDocument();
    });
  });
});
