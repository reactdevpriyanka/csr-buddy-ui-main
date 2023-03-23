import { renderWrap } from '@utils';
import ProductError from './ProductError';

describe('<ProductError />', () => {
  const render = renderWrap(ProductError, {
    defaultProps: {
      testId: 'unknown-product-error',
    },
  });

  describe('Product Error', () => {
    test('it should render a product error', () => {
      const { getAllByText } = render({
        id: <div>{'Unknown Product'}</div>,
      });
      expect(getAllByText('Unknown Product').length).toBeGreaterThan(0);
    });
  });
});
