import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWrap } from '@utils';
import { useRouter } from 'next/router';
import axios from 'axios';
import useSubscriptions from '@/hooks/useSubscriptions';
import AutoshipCancelDialog from './AutoshipCancelDialog';

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

describe('<AutoshipCancelDialog />', () => {
  const cancelReasonsSpy = jest.spyOn(axios, 'get');
  cancelReasonsSpy.mockReturnValue(
    Promise.resolve([
      {
        id: 7,
        code: 'ETC',
        description: 'Other',
        is_customer: true,
        is_support: true,
      },
    ]),
  );

  const render = renderWrap(AutoshipCancelDialog, {
    defaultProps: {
      id: '123',
      name: 'Autoship #1',
      cusomerId: '123456789',
      cancelReasons: [],
      isOpen: true,
      openDialog: jest.fn(),
      postInteraction: jest.fn(),
    },
  });

  afterEach(() => {
    cancelReasonsSpy.mockReset();
  });

  beforeEach(() => {
    useSubscriptions.mockReturnValue({
      useSubscriptionCancelReasons: () => [
        {
          id: 7,
          code: 'ETC',
          description: 'Other',
          is_customer: true,
          is_support: true,
        },
      ],
    });
  });

  test('It should render the cancel autoship dialog', async () => {
    const { getByTestId } = render();
    expect(getByTestId('autoship-cancel')).toBeTruthy();
    expect(getByTestId('autoship-cancel:title')).toHaveTextContent('Cancel Autoship');
    const confirmText = screen.queryByTestId('autoship-cancel:confirmation:123');
    expect(confirmText).not.toBeInTheDocument();
  });

  test('it should click to the confirmation screen', async () => {
    const { getByTestId } = render();
    fireEvent.click(getByTestId('base-dialog-ok-button'));

    await waitFor(() => {
      expect(getByTestId('autoship-cancel:confirmation:123')).toBeInTheDocument();
    });

    expect(getByTestId('autoship-cancel:title')).toHaveTextContent('Confirm Cancellation');
    expect(getByTestId('autoship-cancel:confirmation:123')).toHaveTextContent(
      'Confirm cancellation of Austoship ID #',
    );
  });
});
