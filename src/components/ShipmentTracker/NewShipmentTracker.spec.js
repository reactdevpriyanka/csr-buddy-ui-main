import { newTrackPackageTabs } from '@/utils/trackPackage';
import { fireEvent } from '@testing-library/react';
import { renderWrap } from '@utils';
import * as nextRouter from 'next/router';
import NewShipmentTracker from './NewShipmentTracker';

describe('<NewShipmentTracker />', () => {
  jest.mock('@/hooks/useSanitizedRouter');

  const mockRouter = jest.spyOn(nextRouter, 'useRouter');

  mockRouter.mockReturnValue({
    query: {
      id: '12345',
    },
    pathname: '/orderId',
  });

  const orderNumber = '123123';

  const facts = [
    { heading: 'Fulfillment Center', value: 'SDF1' },
    { heading: 'Total Packages', value: 2 },
  ];

  const defaultProps = {
    orderNumber,
    facts,
  };

  const render = renderWrap(NewShipmentTracker, { defaultProps });

  describe('validate tracking data', () => {
    test('it should render shipment facts', () => {
      const { getByText } = render();
      fireEvent.click(getByText(newTrackPackageTabs.SHIPMENT_FACTS));

      for (const fact of facts) {
        expect(getByText(fact.heading)).toBeTruthy();
        expect(getByText(fact.value)).toBeTruthy();
      }
    });

    test('it should render order number #', () => {
      const { getByTestId } = render();
      expect(getByTestId('ordercard:id:viewdetails:link:123123')).toBeInTheDocument();
    });

    test('it should render travel history', () => {
      const { getByText } = render();
      fireEvent.click(getByText(newTrackPackageTabs.TRAVEL_HISTORY));
      expect(getByText('Estimated Delivery:')).toBeTruthy();
    });
  });
});
