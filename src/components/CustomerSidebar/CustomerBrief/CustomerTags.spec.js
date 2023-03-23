import { useRouter } from 'next/router';
import { renderWrap } from '@utils';
import CustomerTags from './CustomerTags';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/hooks/useTags');

describe('<CustomerTags />', () => {
  const render = renderWrap(CustomerTags);

  const push = jest.fn();

  useRouter.mockReturnValue({
    push,
    query: {
      id: '123123',
    },
  });

  afterEach(() => push.mockReset());

  test('it should render customer tags', () => {
    const { getByText } = render();
    expect(getByText('Hearing Impaired')).toBeInTheDocument();
  });

  describe('when create tag button clicked', () => {
    test('it should open tag editor', () => {
      const { getByLabelText } = render();
      render.trigger.click(getByLabelText('create tag'));
      expect(push).toHaveBeenCalledWith(
        {
          pathname: undefined,
          query: {
            id: '123123',
            interactionPanel: 'tagEditor',
          },
        },
        undefined,
        { shallow: true },
      );
    });
  });
});
