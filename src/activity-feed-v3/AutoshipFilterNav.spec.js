import { renderWrap, getMonth } from '@utils';
import { useRouter } from 'next/router';
import { fireEvent } from '@testing-library/react';
import AutoshipFilterNav from './AutoshipFilterNav';
const AUTOSHIP_FILTERS = ['All', 'Active', 'Cancelled'];

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('<AutoshipFilterNav />', () => {
  const render = renderWrap(AutoshipFilterNav);

  const push = jest.fn();

  beforeAll(() => {
    useRouter.mockReturnValue({
      push,
      pathname: '/app/customers/[id]/autoship',
      query: {},
    });
  });

  afterEach(() => push.mockReset());

  it('should equal to the current month and year in autoship tab', () => {
    const { getByText } = render();
    expect(getByText(`${getMonth(new Date())} ${new Date().getFullYear()}`)).toBeTruthy();
  });

  describe('autoship filter', () => {
    it('should render filter by label in autoship', () => {
      const { queryAllByText } = render();
      expect(queryAllByText('Filter By')).toBeTruthy();
    });
    test('should render an active autoship order by default', () => {
      const { queryByTestId } = render({ status: AUTOSHIP_FILTERS.Active });
      expect(queryByTestId('autoship:filter-menu')).toBeInTheDocument();
    });

    test('should update the autoship filter item on selected Cancelled', async () => {
      const { getByRole, getByTestId, findByTestId } = render({ status: AUTOSHIP_FILTERS.Cancelled });
      const options = getByRole('button', { className: 'select' });
      fireEvent.click(options);
      fireEvent.mouseDown(options);
      fireEvent.change(getByTestId('autoship:filter-item:Cancelled'), {
        target: { value: 'Cancelled' },
      });
      expect(findByTestId('autoship:filter-item:Cancelled')).toBeTruthy();
      render.trigger.click(getByTestId('autoship:filter-item:Cancelled'));
      expect(push).toHaveBeenCalledWith(
        {
          pathname: '/app/customers/[id]/autoship',
          query: {
            byAutoshipAttribute: 'Cancelled',
          },
        },
        undefined,
        { shallow: true },
      );
    });

    test('should update the autoship filter item on selected All', async () => {
      const { getByRole, getByTestId, findByTestId } = render({ status: AUTOSHIP_FILTERS.All });
      const options = getByRole('button', { className: 'select' });
      fireEvent.click(options);
      fireEvent.mouseDown(options);
      fireEvent.change(getByTestId('autoship:filter-item:All'), {
        target: { value: 'All' },
      });
      expect(findByTestId('autoship:filter-item:Cancelled')).toBeTruthy();
      render.trigger.click(getByTestId('autoship:filter-item:All'));
      expect(push).toHaveBeenCalledWith(
        {
          pathname: '/app/customers/[id]/autoship',
          query: {
            byAutoshipAttribute: 'All',
          },
        },
        undefined,
        { shallow: true },
      );
    });
  });
});
