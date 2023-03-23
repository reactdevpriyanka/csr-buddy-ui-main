import { renderWrap } from '@/utils';
import PetAvatar from './PetAvatar';
import { getAvatarUrl } from './PetProfile';

const defaultProps = {
  'data-testid': '123',
  gender: 'FMLE',
  src: getAvatarUrl(''),
};

describe('<PetAvatar />', () => {
  const render = (props = {}) =>
    renderWrap(PetAvatar, {
      defaultProps: {
        ...defaultProps,
        ...props,
      },
    })();

  test('it should display a default sized Pet Avatar', () => {
    const { getByTestId } = render();
    expect(getByTestId('123')).toBeTruthy();
    const style = window.getComputedStyle(getByTestId('123'));
    expect(style.width).toBe(`40px`);
  });
});
