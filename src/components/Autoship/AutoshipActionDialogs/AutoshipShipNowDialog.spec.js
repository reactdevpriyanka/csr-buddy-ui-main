import { fireEvent } from '@testing-library/react';
import { renderWrap } from '@utils';
import { useRouter } from 'next/router';
import useSubscriptions from '@/hooks/useSubscriptions';
import AutoshipShipNowDialog from './AutoshipShipNowDialog';

jest.mock('@/hooks/useSubscriptions');

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

useRouter.mockReturnValue({
  query: {
    id: '1234',
  },
  pathname: '/autoship',
});

describe('<AutoshipShipNowDialog />', () => {
  const render = renderWrap(AutoshipShipNowDialog, {
    defaultProps: {
      id: '123',
      name: 'Autoship #1',
      cusomerId: '123456789',
      isOpen: true,
      openDialog: jest.fn(),
      postInteraction: jest.fn(),
    },
  });

  beforeEach(() => {
    useSubscriptions.mockReturnValue({
      shipSubscriptionNow: () => [
        {
          subscriptionId: '123',
          cusomerId: '123456789',
        },
      ],
    });
  });

  test('It should render the ship now autoship dialog', async () => {
    const { getByTestId } = render();
    expect(getByTestId('autoship-ship-now')).toBeTruthy();
    expect(getByTestId('autoship-shipNow:duplicateShipments')).toHaveTextContent(
      'Checking for duplicate shipments',
    );
  });

  test('It should click ship now button', async () => {
    const { getByTestId } = render();
    fireEvent.click(getByTestId('base-dialog-ok-button'));
    expect(getByTestId('base-dialog-ok-button')).toHaveTextContent('Ship Now');
  });

  test('it should click cancel button', async () => {
    const { getByTestId } = render();
    expect(getByTestId('base-dialog-close-button')).toHaveTextContent('Cancel');
    fireEvent.click(getByTestId('base-dialog-close-button'));
  });
});
