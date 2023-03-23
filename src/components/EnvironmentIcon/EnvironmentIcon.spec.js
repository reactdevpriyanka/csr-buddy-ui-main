import { renderWrap } from '@utils';
import useAthena from '@/hooks/useAthena';
import EnvironmentIcon from './EnvironmentIcon';

jest.mock('@/hooks/useAthena');

describe('<EnvironmentIcon />', () => {
  const getLang = jest.fn();

  useAthena.mockReturnValue({ getLang });

  const render = renderWrap(EnvironmentIcon);

  test('it should render nothing by default', () => {
    const { container } = render();
    expect(container.querySelector('aside')).not.toBeInTheDocument();
  });

  describe('when content is returned', () => {
    const content = 'You are using CSR Buddy Alpha';

    test('it should render content', () => {
      getLang.mockReturnValueOnce(content);
      const { getByText } = render();
      expect(getByText(content)).toBeInTheDocument();
    });
  });
});
