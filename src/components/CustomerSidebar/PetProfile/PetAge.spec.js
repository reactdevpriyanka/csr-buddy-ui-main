import { renderWrap } from '@utils';
import { getPetAge } from '@utils/dates';
import PetAge from './PetAge';

jest.mock('@utils/dates');

describe('<PetAge />', () => {
  getPetAge.mockReturnValueOnce({
    years: 3,
  });

  const render = renderWrap(PetAge, {
    testId: 'pet-profile:age',
  });

  test('it should render pet age if birthday is defined', () => {
    const petAge = render.andGetByTestId({ children: '12/09/2018' });
    expect(petAge).toHaveTextContent('3YRS');
  });

  test('it should render null if birthday is not defined', () => {
    const { container: petAge } = render({ children: null });
    expect(petAge).toHaveTextContent('');
  });
});
