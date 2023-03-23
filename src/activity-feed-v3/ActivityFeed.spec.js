import { renderWrap } from '@utils';
import { useRouter } from 'next/router';
import ActivityFeed from './ActivityFeed';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('ActivityFeed', () => {
  const mockFeed = [
    {
      date: '2022-03-01',
      activities: [
        {
          activityId: '1',
          activityCategory: 'Order',
        },
        {
          activityId: '2',
          activityCategory: 'Autoship',
        },
      ],
    },
  ];

  const render = renderWrap(ActivityFeed, {
    testId: 'card:activity-header',
    defaultProps: {
      feed: mockFeed,
    },
  });

  beforeEach(() => {
    useRouter.mockReturnValue({
      query: {
        id: '1075268420',
      },
      pathname: '/activity',
    });

    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('should render the component with non-empty feed', () => {
    const { getByText } = render();
    expect(getByText('2022-03-01')).toBeInTheDocument();
  });

  it('should display a message when feed is empty', () => {
    const { getByText } = render({ feed: [] });
    useRouter.mockReturnValue({
      query: {
        id: '1075268420',
      },
      pathname: '/autoship',
    });
    expect(getByText('Customer has no orders since May 2021.')).toBeInTheDocument();
  });

  it('should call blueTriangle.start and blueTriangle.end functions when component is initialized and unloaded', () => {
    const mockStart = jest.fn();
    const mockEnd = jest.fn();
    jest.mock('@utils/blueTriangle', () => ({
      start: mockStart,
      end: mockEnd,
    }));
    render();
    mockStart('Activity Feed Tab');
    mockEnd('Activity Feed Tab');
    expect(mockStart).toHaveBeenCalledWith('Activity Feed Tab');
    jest.runOnlyPendingTimers();
    expect(mockEnd).toHaveBeenCalledWith('Activity Feed Tab');
  });

  it('should set componentInitialized state to true', () => {
    const { queryByText } = render();
    expect(queryByText('2022-03-01')).not.toBeNull();
  });

  it('renders empty autoship text if feed is empty and on Autoship page with filter query', () => {
    const emptyFeed = [];
    useRouter.mockReturnValue({
      query: {
        id: '1075268420',
        byAutoshipAttribute: 'Active',
      },
      pathname: '/autoship',
    });
    const { getByText } = render({ feed: emptyFeed });
    expect(getByText('Customer has no active Autoships')).toBeInTheDocument();
  });
});
