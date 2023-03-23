import { renderWrap } from '@utils';
import PetBreed from './PetBreed';

describe('<PetBreed />', () => {
  const render = renderWrap(PetBreed);

  test('it should render a link if breed is defined', () => {
    const { getByText } = render({
      children: 'Siberian Husky',
    });

    expect(getByText('Siberian Husky')).toBeInTheDocument();
  });

  test('it should render a span if breed if unknown', () => {
    const { getByText } = render({ children: null });

    expect(getByText('Unknown')).toBeInTheDocument();
  });
});
