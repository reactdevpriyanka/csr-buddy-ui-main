import { renderWrap } from '@utils';
import { useRouter } from 'next/router';
import TagEditor from './TagEditor';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/hooks/useTags');

describe('<TagEditor />', () => {
  const render = renderWrap(TagEditor);

  const push = jest.fn();

  useRouter.mockReturnValue({
    push,
    pathname: '/app/customers/[id]/activities',
    query: {
      id: '123123',
      interactionPanel: 'tagEditor',
    },
  });

  afterEach(() => push.mockReset());

  describe('when back button is clicked', () => {
    test('it should return to customer interaction screen', () => {
      const { getByLabelText } = render();
      render.trigger.click(getByLabelText('Tap to go back'));
      expect(push).toHaveBeenCalledWith(
        {
          pathname: '/app/customers/[id]/activities',
          query: {
            id: '123123',
          },
        },
        undefined,
        { shallow: true },
      );
    });
  });
});
