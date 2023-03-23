import { renderWrap } from '@/utils';
import PetProfileTag, { PetProfileTagTypes, PetProfileTagType } from './PetProfileTag';

const petProfileId = '12345';

describe('<PetProfileTag />', () => {
  const foodAllergiesData = {
    type: PetProfileTagTypes.FoodAllergies,
    values: ['food allergies test'],
  };

  const medicationsData = {
    type: PetProfileTagTypes.Medications,
    values: ['medication test'],
  };

  const medicationAllergyData = {
    type: PetProfileTagTypes.MedicationAllergy,
    values: ['medication allergy test'],
  };

  const medicalConditionData = {
    type: PetProfileTagTypes.MedicalCondition,
    values: ['medicalCondition test'],
  };

  const render = (data = {}) =>
    renderWrap(PetProfileTag, { defaultProps: { ...data, id: petProfileId } })();

  test(`it should render pet profile medications tags`, () => {
    const { getByTestId } = render(medicationsData);
    const testId = `pet-profile-${PetProfileTagTypes.Medications.toLowerCase()}-${petProfileId}:tags`;
    const medicationsProfileTag = getByTestId(testId);
    expect(medicationsProfileTag).toBeInTheDocument();
    expect(medicationsProfileTag).toHaveTextContent(PetProfileTagTypes.Medications);
  });

  test(`it should render pet profile medication allergy tags`, () => {
    const { getByTestId } = render(medicationAllergyData);
    const testId = `pet-profile-${PetProfileTagTypes.MedicationAllergy.toLowerCase()}-${petProfileId}:tags`;
    const medicationAllergyProfileTag = getByTestId(testId);
    expect(medicationAllergyProfileTag).toBeInTheDocument();
    expect(medicationAllergyProfileTag).toHaveTextContent(
      PetProfileTagType[PetProfileTagTypes.MedicationAllergy],
    );
  });

  test(`it should render pet profile medication conditions tags`, () => {
    const { getByTestId } = render(medicalConditionData);
    const testId = `pet-profile-${PetProfileTagTypes.MedicalCondition.toLowerCase()}-${petProfileId}:tags`;
    const medicalConditionProfileTag = getByTestId(testId);
    expect(medicalConditionProfileTag).toBeInTheDocument();
    expect(medicalConditionProfileTag).toHaveTextContent(
      PetProfileTagType[PetProfileTagTypes.MedicalCondition],
    );
  });

  test(`it should render food allergy conditions tags`, () => {
    const { getByTestId } = render(foodAllergiesData);
    const testId = `pet-profile-${PetProfileTagTypes.FoodAllergies.toLowerCase()}-${petProfileId}:tags`;
    const foodAllergiesProfileTag = getByTestId(testId);
    expect(foodAllergiesProfileTag).toBeInTheDocument();
    expect(foodAllergiesProfileTag).toHaveTextContent(
      PetProfileTagType[PetProfileTagTypes.FoodAllergies],
    );
  });
});
