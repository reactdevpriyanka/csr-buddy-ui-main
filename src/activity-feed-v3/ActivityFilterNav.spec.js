import { renderWrap, getMonth } from '@utils';
import { useRouter } from 'next/router';
import { fireEvent, within } from '@testing-library/react';
import ActivityFilterNav from './ActivityFilterNav';
const ACTIVITYFEED_FILTERS = ['All', 'Returns', 'Autoships', 'Cancellations', 'Prescription Items'];

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('<ActivityFilterNav />', () => {
  const render = renderWrap(ActivityFilterNav);
  const push = jest.fn();

  useRouter.mockReturnValue({
    push,
    pathname: '/app/customers/[id]/activity',
    query: {
      byAttribute: 'Returns',
    },
  });
  afterEach(() => push.mockReset());

  it('should equal to the current month and year', () => {
    const { getByText } = render();
    expect(getByText(`${getMonth(new Date())} ${new Date().getFullYear()}`)).toBeTruthy();
  });

  describe('activity filter', () => {
    it('should render activity filter by label', () => {
      const { queryAllByText } = render();
      expect(queryAllByText('Filter By')).toBeTruthy();
    });
    test('should render an all activity order by default', () => {
      const { queryByTestId } = render({ status: ACTIVITYFEED_FILTERS.All });
      expect(queryByTestId('activity:filter-menu')).toBeInTheDocument();
    });
    // eslint-disable-next-line jest/expect-expect
    it('should push query parameter when byAutoshipAttribute is present', () => {
      const router = {
        pathname: '/app/customers/[id]/activity',
        query: {
          byAutoshipAttribute: 'Active',
          byAttribute: "Cancellations"
        },
        push: jest.fn(),
      };
      useRouter.mockReturnValue(router);  
      render(<ActivityFilterNav />);     
    });

    test('should update the activity filter item on select change of value must be all', async () => {
      const { getByTestId, findByTestId } = render({ status: ACTIVITYFEED_FILTERS.Cancellations });
      const select = getByTestId('activity:filter-menu');
      fireEvent.mouseDown(within(select).getByRole('button'));
      fireEvent.change(getByTestId('activity:filter-item:All'), { target: { value: 'All' } });
      expect(findByTestId('activity:filter-item:All')).toBeTruthy();
      render.trigger.click(getByTestId('activity:filter-item:All'));  
    });

    test('should update the activity filter item on select change', async () => {
      const { getByTestId, findByTestId } = render({ status: ACTIVITYFEED_FILTERS.Cancellations });
      const select = getByTestId('activity:filter-menu');
      fireEvent.mouseDown(within(select).getByRole('button'));

      fireEvent.change(getByTestId('activity:filter-item:Cancellations'), {
        target: { value: 'Cancellations' },
      });
      expect(findByTestId('activity:filter-item:Cancellations')).toBeTruthy();

      render.trigger.click(getByTestId('activity:filter-item:Cancellations'));   
    });
  });

  describe('sort by', () => {
    it('should render sort by label', () => {
      const { queryAllByText } = render();
      expect(queryAllByText('Sort By')).toBeTruthy();
    });
  });
});
