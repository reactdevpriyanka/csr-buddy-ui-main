import { renderWrap } from '@utils';
import * as nextRouter from 'next/router';
import Tag from './Tag';

jest.mock('@/hooks/useTags');

describe('<Tag />', () => {
  const render = renderWrap(Tag, {
    defaultProps: {
      name: 'SIMPLE_TAG',
    },
  });

  const mockRouter = jest.spyOn(nextRouter, 'useRouter');

  mockRouter.mockReturnValue({
    query: {
      id: '123123',
    },
  });

  test('it should render simple tag by default', () => {
    const { getByTestId } = render();
    expect(getByTestId('simple-tag')).toBeInTheDocument();
  });

  describe('when name is weight limit', () => {
    test('it should render a weight limit tag', () => {
      const { getByTestId } = render({ name: 'WEIGHT_LIMIT' });
      expect(getByTestId('weight-tag')).toBeInTheDocument();
    });
  });
});
