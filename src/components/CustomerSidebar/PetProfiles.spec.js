import { renderWrap } from '@utils';
import useCustomer from '@/hooks/useCustomer';
import customer from '__mock__/customers/nessa';
import customerNoPets from '__mock__/customers/nessa+nopets';
import PetProfiles from './PetProfiles';

jest.mock('@/hooks/useCustomer');

describe('<PetProfiles />', () => {
  const render = renderWrap(PetProfiles);

  useCustomer.mockReturnValue({
    data: customer,
    error: null,
  });

  test('it should render profiles for customer pets', () => {
    expect(render()).toMatchSnapshot();
  });

  describe('when customer has no pets', () => {
    beforeAll(() => {
      useCustomer.mockReturnValue({
        data: customerNoPets,
        error: null,
      });
    });

    test('it should render no pets', () => {
      const { getByTestId } = render();
      const petAvatar = getByTestId('pet-profile:avatar');
      expect(petAvatar).toBeInTheDocument();
      expect(petAvatar.querySelector('img')).toHaveAttribute(
        'src',
        'https://dotcms-ui.chewy.com/images/pet-profile/avatars/avatar_dog_xx_generic.png',
      );
    });
  });

  describe('when error occurs', () => {
    beforeAll(() => {
      useCustomer.mockReturnValue({
        data: null,
        error: 'Some kind of fuzz',
      });
    });

    test('it should load nothing', () => {
      const { container } = render();
      expect(container.childNodes).toHaveLength(0);
    });
  });

  describe('when loading', () => {
    beforeAll(() => {
      useCustomer.mockReturnValue({
        data: null,
        error: null,
      });
    });

    test('it should render progress indicator', () => {
      const { getByTestId } = render();
      expect(getByTestId('loader')).toBeInTheDocument();
    });
  });
});
