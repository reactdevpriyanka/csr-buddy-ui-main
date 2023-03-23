import { renderWrap } from '@utils';
import useCustomer from '@/hooks/useCustomer';
import ErrorOverview from './ErrorOverview';

jest.mock('@/hooks/useCustomer');

describe('<ErrorOverview />', () => {
  const render = renderWrap(ErrorOverview);

  const mutate = useCustomer.mutate;

  test('it should render an alert', () => {
    expect(render()).toMatchSnapshot();
  });

  describe('when user clicks on try again button', () => {
    test('it should refetch customer', () => {
      const { getByText } = render();
      render.trigger.click(getByText('Try Again'));
      expect(mutate).toHaveBeenCalled();
    });
  });
});
