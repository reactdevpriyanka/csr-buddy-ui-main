import { renderWrap } from '@utils';
import results from '__mock__/advanced-search/results';
import useCustomer from '@/hooks/useCustomer';
import customer from '__mock__/customers/nessa';
import { within } from '@testing-library/dom';
import SearchResultsTable from './SearchResultsTable';

jest.mock('@/hooks/useCustomer');

const defaultProps = {
  results: results,
  totalResults: 50,
  pageNumber: 0,
  totalPages: 1,
  pageSize: 50,
  setPageSize: jest.fn(),
  setPageNumber: jest.fn(),
  errors: null,
  searchInProgress: false,
};

describe('<SearchResultsTable />', () => {
  const render = renderWrap(SearchResultsTable, {
    defaultProps,
  });

  useCustomer.mockReturnValue({
    data: customer,
    error: null,
  });

  test('it should render the search results table', () => {
    const { getByTestId } = render();
    const { results } = defaultProps;

    expect(getByTestId('advanced-search-results')).toBeTruthy();

    for (const searchResult of results) {
      const row = getByTestId(`${searchResult?.externalOrderId}:row`);
      expect(row).toBeTruthy();
      expect(within(row).getByTestId('externalOrderId')).toBeTruthy();
      expect(within(row).getByTestId('timePlaced')).toBeTruthy();
      expect(within(row).getByTestId('memberId')).toBeTruthy();
      expect(within(row).getByTestId('total')).toBeTruthy();
      expect(within(row).getByTestId('status')).toBeTruthy();
      expect(within(row).getByTestId('timeUpdated')).toBeTruthy();
      expect(within(row).getByTestId('flags')).toBeTruthy();
    }
  });
});
