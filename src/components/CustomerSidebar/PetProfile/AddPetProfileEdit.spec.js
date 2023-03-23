import fishPetData from '__mock__/petprofiles/pet-profile-full';
import renderWrap from '@/utils/renderWrap';
import * as useAgentInteractions from '@/hooks/useAgentInteractions';
import * as useCustomer from '@/hooks/useCustomer';
import usePetType from '@/hooks/usePetType';
import usePetBreed from '@/hooks/usePetBreed';
import usePetProfile from '@/hooks/usePetProfile';
import usePetMedication from '@/hooks/usePetMedication';
import usePetFoodAllergies from '@/hooks/usePetFoodAllergies';
import usePetMedAllergies from '@/hooks/usePetMedAllergies';
import usePetMedConditions from '@/hooks/usePetMedConditions';
import { useRouter } from 'next/router';
import { within, waitFor, fireEvent } from '@testing-library/dom';
import { act } from '@testing-library/react';
import AddPetProfile from './AddPetProfile';
// complement spec for the 'edit' mode of AddPetProfile

const defaultProps = {
  edit: true,
  petData: fishPetData,
};

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

useRouter.mockReturnValue({
  query: {
    id: '123123',
    interactionPanel: 'editPetProfile',
    petId: fishPetData.id,
  },
  push: jest.fn(),
});

jest.mock('@/hooks/usePetType');
usePetType.mockReturnValue({
  data: [
    { id: 2, name: 'Cat' },
    { id: 3, name: 'Fish' },
    { id: 4, name: 'Bird' },
    { id: 5, name: 'Small Pet' },
    { id: 6, name: 'Reptile' },
    { id: 7, name: 'Horse' },
    { id: 8, name: 'Large Animal' },
    { id: 1, name: 'Dog' },
    { id: 9, name: 'Bojack' },
  ],
});

jest.mock('@/hooks/usePetBreed');
usePetBreed.mockReturnValue({
  data: [
    { id: 639, name: 'Tetras', type: { id: 3, name: 'Fish' } },
    { id: 642, name: 'Guppy', type: { id: 3, name: 'Fish' } },
  ],
});

jest.mock('@/hooks/usePetMedication');
usePetMedication.mockReturnValue({
  data: [
    { id: 2, name: 'Antibacterials' },
    { id: 3, name: 'Antirobe' },
    { id: 6, name: 'Aspirin' },
    { id: 11, name: 'Cephalosporins' },
    { id: 7, name: 'Bacitracin' },
  ],
});

jest.mock('@/hooks/usePetFoodAllergies');
usePetFoodAllergies.mockReturnValue({
  data: [
    { id: 4, name: 'Beef', writein: false },
    { id: 5, name: 'Chicken', writein: false },
    { id: 6, name: 'Fish', writein: false },
    { id: 7, name: 'Lamb', writein: false },
    { id: 8, name: 'Egg', writein: false },
    { id: 9, name: 'Corn', writein: false },
  ],
});

jest.mock('@/hooks/usePetMedAllergies');
usePetMedAllergies.mockReturnValue({
  data: [
    { id: 1, name: 'ACE Inhibitors', writein: false },
    { id: 2, name: 'Antihistamines', writein: false },
    { id: 9, name: 'Clavulanic Acid', writein: false },
  ],
});

jest.mock('@/hooks/usePetMedConditions');
usePetMedConditions.mockReturnValue({
  data: [
    { id: 5, name: 'Diabetes' },
    { id: 13, name: 'Lactating' },
    { id: 2, name: 'Bladder/Kidney Stones' },
  ],
});

jest.mock('@/hooks/usePetProfile');

describe('<AddPetProfile edit/>', () => {
  usePetProfile.mockReturnValue({
    data: fishPetData,
  });

  describe('<PetNameInput />', () => {
    const render = renderWrap(AddPetProfile, {
      defaultProps,
    });

    it('pre-populates with previous pet name', () => {
      const { getByTestId } = render();
      const petNameField = getByTestId('add-pet-name');
      expect(petNameField).toBeTruthy();
      expect(petNameField).toBeInTheDocument();
      const petNameInput = petNameField.querySelector('input');
      expect(petNameInput).toBeTruthy();
      expect(petNameInput).toHaveValue(fishPetData.name);
    });
    it('accepts new pet names', () => {
      const { getByTestId } = render();
      const petNameField = getByTestId('add-pet-name');
      expect(petNameField).toBeTruthy();
      expect(petNameField).toBeInTheDocument();

      const petNameInput = petNameField.querySelector('input');
      expect(petNameInput).toBeTruthy();
      fireEvent.change(petNameInput, { target: { value: 'fish2' } });
      expect(petNameInput).toHaveValue('fish2');
    });

    it('disables save button on name clear', () => {
      const { getByTestId } = render();
      const petNameField = getByTestId('add-pet-name');
      expect(petNameField).toBeTruthy();
      expect(petNameField).toBeInTheDocument();

      const petNameInput = petNameField.querySelector('input');
      expect(petNameInput).toBeTruthy();
      fireEvent.change(petNameInput, { target: { value: '' } });
      expect(petNameInput).toHaveValue('');

      expect(getByTestId('add-new-pet-submit')).toHaveProperty('disabled');
    });
  });

  describe('<PetType />', () => {
    const render = renderWrap(AddPetProfile, {
      defaultProps,
    });

    it('pre-populates with previous pet type (fish)', () => {
      const { getByTestId } = render();
      const petNameInput = getByTestId('pet:type-value');
      expect(petNameInput).toBeTruthy();
      expect(petNameInput).toHaveTextContent(fishPetData.type.name);
    });

    it('changing the pet type clears the breed field', async () => {
      const { getByTestId } = render({ button: 'Pet Type' });
      const petNameSelect = getByTestId('add-pet-type');

      const petType = within(petNameSelect).getByRole('button', { className: 'petType' });
      fireEvent.click(petType);
      fireEvent.mouseDown(petType);
      expect(getByTestId('pet:type-Cat')).toBeTruthy();
      fireEvent.click(getByTestId('pet:type-Cat'));

      expect(getByTestId('pet:type-value')).toHaveTextContent('Cat');
      expect(getByTestId('add-pet-breed').querySelector('input')).toHaveValue('');
    });
  });

  describe('<PetBreed />', () => {
    const render = renderWrap(AddPetProfile, {
      defaultProps,
    });

    it('pre-populates with previous pet breed (Petras)', () => {
      const { getByTestId } = render();
      expect(getByTestId('add-pet-breed').querySelector('input')).toHaveValue(
        fishPetData.breed.name,
      );
    });

    it('can be changed to another breed (Guppy)', async () => {
      const { getByTestId, getByRole } = render();

      const addPetBreed = getByTestId('add-pet-breed');

      const input = within(addPetBreed).getByRole('textbox');

      fireEvent.click(addPetBreed);
      fireEvent.change(input, { target: { value: 'Guppy' } });

      fireEvent.click(within(getByRole('listbox')).getByRole('option', { name: 'Guppy' }));
      expect(input.value).toEqual('Guppy');
    });
  });

  describe('<PetGender />', () => {
    const render = renderWrap(AddPetProfile, {
      defaultProps,
    });

    it('pre-populates with previous gender (female)', () => {
      const { getByTestId } = render();
      const petGenderSelect = getByTestId('add-pet-gender');
      expect(petGenderSelect).toBeTruthy();
      expect(petGenderSelect).toHaveTextContent('Female');
    });

    it('can be changed to another gender (male)', () => {
      const { getByTestId } = render({ button: 'Pet Type' });
      const petGenderSelect = getByTestId('add-pet-gender');

      const petType = within(petGenderSelect).getByRole('button');
      fireEvent.click(petType);
      fireEvent.mouseDown(petType);
      expect(getByTestId('pet:gender-Male')).toBeTruthy();
      fireEvent.click(getByTestId('pet:gender-Male'));

      expect(petGenderSelect).toHaveTextContent('Male');
    });
  });

  describe('<Medications />', () => {
    const render = renderWrap(AddPetProfile, {
      defaultProps,
    });

    it('pre-populates previous medications', () => {
      const { queryByTestId, getByTestId } = render();

      fishPetData.medications.map((med) =>
        expect(getByTestId(`pet-medicationchip-${med.name}`)).toBeTruthy(),
      );
      expect(queryByTestId('add-pet-medication')).toBeNull();
    });

    it('brings up a dropdown when add clicked with options', () => {
      const { getByTestId, getByText, getByRole } = render();
      fireEvent.click(getByText('+ Add a medication'));

      const medicationAC = getByTestId('add-pet-medication');
      expect(medicationAC).toBeTruthy();
      const input = within(medicationAC).getByRole('textbox');

      fireEvent.click(medicationAC);
      fireEvent.change(input, { target: { value: 'Antibacterials' } });

      fireEvent.click(within(getByRole('listbox')).getByRole('option', { name: 'Antibacterials' }));

      expect(getByTestId(`pet-medicationchip-Antibacterials`)).toBeInTheDocument();
    });

    it('clicking the x removes a medication', () => {
      const { queryByTestId, getByTestId } = render();
      const medChip = getByTestId(`pet-medicationchip-Cephalosporins`);
      expect(medChip).toBeInTheDocument();
      fireEvent.click(medChip.children[1]);
      expect(queryByTestId(`pet-medicationchip-Cephalosporins`)).toBeNull();
    });
  });

  describe('<FoodAllergies />', () => {
    const render = renderWrap(AddPetProfile, {
      defaultProps,
    });

    it('pre-populates previous food allergies', () => {
      const { queryByTestId, getByTestId } = render();

      fishPetData.allergies.map((petFoodAllergy) =>
        expect(getByTestId(`pet-foodallergychip-${petFoodAllergy.name}`)).toBeTruthy(),
      );
      expect(queryByTestId('add-pet-food-allergy')).toBeNull();
    });

    it('brings up a dropdown when add clicked with options', () => {
      const { getByTestId, getByText, getByRole } = render();
      fireEvent.click(getByText('+ Add a food allergy'));

      const foodAC = getByTestId('add-pet-food-allergy');
      expect(foodAC).toBeTruthy();
      const input = within(foodAC).getByRole('textbox');

      fireEvent.click(foodAC);
      fireEvent.change(input, { target: { value: 'Chicken' } });

      fireEvent.click(within(getByRole('listbox')).getByRole('option', { name: 'Chicken' }));

      expect(getByTestId(`pet-foodallergychip-Chicken`)).toBeInTheDocument();
    });

    it('clicking the x removes a food allergy', () => {
      const { queryByTestId, getByTestId } = render();
      const medChip = getByTestId(`pet-foodallergychip-Corn`);
      expect(medChip).toBeInTheDocument();
      fireEvent.click(medChip.children[1]);
      expect(queryByTestId(`pet-foodallergychip-Corn`)).toBeNull();
    });
  });

  describe('<MedicationAllergies />', () => {
    const render = renderWrap(AddPetProfile, {
      defaultProps,
    });

    it('pre-populates previous medication allergies', () => {
      const { queryByTestId, getByTestId } = render();

      fishPetData.medicationAllergies.map((petMedAllergy) =>
        expect(getByTestId(`pet-medallergychip-${petMedAllergy.name}`)).toBeTruthy(),
      );
      expect(queryByTestId('add-pet-allergies')).toBeNull();
    });

    it('brings up a dropdown when add clicked with options', () => {
      const { getByTestId, getByText, getByRole } = render();
      fireEvent.click(getByText('+ Add a medication allergy'));

      const medAllergyAC = getByTestId('add-pet-allergies');
      expect(medAllergyAC).toBeTruthy();
      const input = within(medAllergyAC).getByRole('textbox');

      fireEvent.click(medAllergyAC);
      fireEvent.change(input, { target: { value: 'Antihistamines' } });

      fireEvent.click(within(getByRole('listbox')).getByRole('option', { name: 'Antihistamines' }));

      expect(getByTestId(`pet-medallergychip-Antihistamines`)).toBeInTheDocument();
    });

    it('clicking the x removes a medication allergy', () => {
      const { queryByTestId, getByTestId } = render();
      const medChip = getByTestId(`pet-medallergychip-ACE Inhibitors`);
      expect(medChip).toBeInTheDocument();
      fireEvent.click(medChip.children[1]);
      expect(queryByTestId(`pet-medallergychip-ACE Inhibitors`)).toBeNull();
    });
  });

  describe('<HealthConditions />', () => {
    const render = renderWrap(AddPetProfile, {
      defaultProps,
    });

    it('pre-populates previous health conditions', () => {
      const { queryByTestId, getByTestId } = render();

      fishPetData.existingMedicalConditions.map((petCondition) =>
        expect(getByTestId(`pet-healthcondchip-${petCondition.name}`)).toBeTruthy(),
      );
      expect(queryByTestId('add-pet-health')).toBeNull();
    });

    it('brings up a dropdown when add clicked with options', () => {
      const { getByTestId, getByText, getByRole } = render();
      fireEvent.click(getByText('+ Add a health condition'));

      const healthCondAC = getByTestId('add-pet-health');
      expect(healthCondAC).toBeTruthy();
      const input = within(healthCondAC).getByRole('textbox');

      fireEvent.click(healthCondAC);
      fireEvent.change(input, { target: { value: 'Diabetes' } });

      fireEvent.click(within(getByRole('listbox')).getByRole('option', { name: 'Diabetes' }));

      expect(getByTestId(`pet-healthcondchip-Diabetes`)).toBeInTheDocument();
    });

    it('clicking the x removes a health condition', () => {
      const { queryByTestId, getByTestId } = render();
      const medChip = getByTestId(`pet-healthcondchip-Lactating`);
      expect(medChip).toBeInTheDocument();
      fireEvent.click(medChip.children[1]);
      expect(queryByTestId(`pet-healthcondchip-Lactating`)).toBeNull();
    });
  });

  describe('<SaveButton />', () => {
    const render = renderWrap(AddPetProfile, {
      defaultProps,
    });

    it('save invokes updatePetProfile, mutatePetProfile and captureInteraction', async () => {
      const cppMock = jest.fn().mockReturnValue(Promise.resolve({ data: [] }));
      const uppMock = jest.fn().mockReturnValue(Promise.resolve({ data: [] }));
      const mppMock = jest.fn().mockReturnValue(Promise.resolve({ data: [] }));
      const custMutateMock = jest.fn().mockReturnValue(Promise.resolve({ data: [] }));

      const captureInteractionMock = jest.fn().mockReturnValue(Promise.resolve({ data: [] }));

      jest
        .spyOn(useAgentInteractions, 'default')
        .mockImplementation(() => ({ captureInteraction: captureInteractionMock }));

      usePetProfile.mockReturnValue({
        data: fishPetData,
        createPetProfile: cppMock,
        updatePetProfile: uppMock,
        mutate: mppMock,
      });

      jest.spyOn(useCustomer, 'default').mockImplementation(() => ({
        mutate: custMutateMock,
      }));

      const { getByTestId } = render();
      const petNameField = getByTestId('add-pet-name');
      expect(petNameField).toBeTruthy();
      expect(petNameField).toBeInTheDocument();

      const petNameInput = petNameField.querySelector('input');
      expect(petNameInput).toBeTruthy();
      act(() => {
        fireEvent.change(petNameInput, { target: { value: 'fish2' } });
      });

      expect(petNameInput).toHaveValue('fish2');
      fireEvent.click(getByTestId('add-new-pet-submit'));

      await waitFor(() => expect(uppMock).toHaveBeenCalled());
      await waitFor(() => expect(mppMock).toHaveBeenCalled());
      await waitFor(() => expect(captureInteractionMock).toHaveBeenCalled());
      await waitFor(() => expect(custMutateMock).toHaveBeenCalled());

      expect(mppMock).toHaveBeenCalled();
      expect(cppMock).not.toHaveBeenCalled();
      expect(captureInteractionMock).toHaveBeenCalled();
      expect(captureInteractionMock.mock.calls[0][0]).toMatchObject({
        type: 'PET_PROFILE_UPDATED',
        action: 'UPDATE',
      });
    });
  });
});
