import { renderWrap } from '@utils';
import PetBreedType from './PetBreedType';

describe('<PetBreedType />', () => {
  const render = renderWrap(PetBreedType);

  test('it should render a link if breed type is defined', () => {
    const { getByText } = render({
      children: 'Dog',
    });

    expect(getByText('Dog')).toBeInTheDocument();
  });

  test('it should render a span if breedType if unknown', () => {
    const { getByText } = render({ children: null });

    expect(getByText('Unknown')).toBeInTheDocument();
  });
});
