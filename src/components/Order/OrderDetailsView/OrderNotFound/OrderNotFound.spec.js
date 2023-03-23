import { renderWrap } from '@/utils';
import { fireEvent } from '@testing-library/react';
import { useRouter } from 'next/router';
import OrderNotFound from './OrderNotFound';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();

useRouter.mockReturnValue({
  query: {
    id: '123',
  },
  push: mockPush,
});

describe('<OrderNotFound />', () => {
  const render = renderWrap(OrderNotFound, { defaultProps: {} });

  test('it should render the OrderNotFound component', () => {
    expect(render()).toMatchSnapshot();
  });

  test('it should click the reutrn to activity feed button', () => {
    const { getByTestId } = render();
    expect(getByTestId('order-not-found')).toBeTruthy();
    expect(getByTestId('order-not-found:return-to-activity-feed-btn')).toBeTruthy();
    fireEvent.click(getByTestId('order-not-found:return-to-activity-feed-btn'));
    expect(mockPush).toHaveBeenCalledWith(`/customers/123/activity`);
  });
});
