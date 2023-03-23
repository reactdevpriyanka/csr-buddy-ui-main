import { renderWrap } from '@utils';
import mockPets from '__mock__/pets/pets-with-insurance';
import { fireEvent } from '@testing-library/react';
import PetConsentSelection from './PetConsentSelection';

const defaultProps = {
  pets: mockPets,
  setSelectedPet: jest.fn(),
};

describe('<PetConsentSelection />', () => {
  const render = (props = {}) => renderWrap(PetConsentSelection, { defaultProps, ...props })();

  test('it should render the pet consent selection component', () => {
    const { getByTestId } = render();
    expect(getByTestId('pet-consent-selection')).toBeTruthy();

    for (const pet of defaultProps.pets) {
      expect(getByTestId(`pet-consent-selection:${pet.id}`)).toBeTruthy();
    }
  });

  test('it should test checkbox clicking functionality from empty state', () => {
    const { getByTestId } = render();

    for (const pet of defaultProps.pets) {
      const checkBox = getByTestId(`pet-consent-selection:${pet.id}`);
      fireEvent.click(checkBox);
      expect(defaultProps.setSelectedPet).toHaveBeenCalledWith(pet?.id.toString());
    }
  });
});
