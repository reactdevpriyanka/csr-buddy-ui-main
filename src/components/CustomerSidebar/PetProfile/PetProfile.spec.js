import { within } from '@testing-library/react';
import { renderWrap } from '@/utils';
import { getPetAge } from '@utils/dates';
import petProfiles from '__mock__/petprofiles/pet-profiles';
import { PetProfileTagType, PetProfileTagTypes } from '@/components/PetProfileTag/PetProfileTag';
import PetProfile from './PetProfile';

describe('<PetProfile />', () => {
  const breedTypeUrl = 'https://dotcms-ui.chewy.com/images/pet-profile/avatars/default_fish.png';
  const birthday = '2021-01-15';
  const breed = 'Guppy';
  const name = 'Jimmu';
  const id = '83617530';

  const render = renderWrap(PetProfile, {
    defaultProps: {
      id,
      petData: petProfiles,
    },
  });

  test(`it should render the pet's avatar`, () => {
    const { getByTestId } = render();
    const petAvatar = getByTestId('pet-profile:avatar');
    expect(petAvatar).toBeInTheDocument();
    expect(petAvatar.querySelector('img')).toHaveAttribute('src', breedTypeUrl);
  });

  test(`it should render the pet's name`, () => {
    const { getByTestId } = render();
    const petName = getByTestId('pet-profile:name');
    expect(petName).toBeInTheDocument();
    expect(petName).toHaveTextContent(name);
  });

  test(`it should render the pet's breed`, () => {
    const { getByTestId } = render();
    const petBreed = getByTestId('pet-profile:breed');
    expect(petBreed).toBeInTheDocument();
    expect(petBreed).toHaveTextContent(breed);
  });

  test(`it should render the pet's age (in years)`, () => {
    const { getByTestId } = render();
    const petAge = getByTestId('pet-profile:age');
    expect(petAge).toBeInTheDocument();

    const { years, months } = getPetAge(birthday);
    const formattedAge = years > 0 ? `${years}YRS` : `${months}M`;

    // The formatted age is broken up by DOM elements, so we can pass a custom
    // matcher to our query for finding the complete string:
    expect(
      within(petAge).getByText((_content, node) => {
        return node.textContent === formattedAge;
      }),
    ).toBeTruthy();
  });

  test(`it should render pet profile medications tags`, () => {
    const { getByTestId } = render();
    const testId = `pet-profile-${PetProfileTagTypes.Medications.toLowerCase()}-${id}:tags`;
    const medicationsProfileTag = getByTestId(testId);
    expect(medicationsProfileTag).toBeInTheDocument();
    expect(medicationsProfileTag).toHaveTextContent(PetProfileTagTypes.Medications);
  });

  test(`it should render pet profile medication allergy tags`, () => {
    const { getByTestId } = render();
    const testId = `pet-profile-${PetProfileTagTypes.MedicationAllergy.toLowerCase()}-${id}:tags`;
    const medicationAllergyProfileTag = getByTestId(testId);
    expect(medicationAllergyProfileTag).toBeInTheDocument();
    expect(medicationAllergyProfileTag).toHaveTextContent(
      PetProfileTagType[PetProfileTagTypes.MedicationAllergy],
    );
  });

  test(`it should render pet profile medication conditions tags`, () => {
    const { getByTestId } = render();
    const testId = `pet-profile-${PetProfileTagTypes.MedicalCondition.toLowerCase()}-${id}:tags`;
    const medicalConditionProfileTag = getByTestId(testId);
    expect(medicalConditionProfileTag).toBeInTheDocument();
    expect(medicalConditionProfileTag).toHaveTextContent(
      PetProfileTagType[PetProfileTagTypes.MedicalCondition],
    );
  });
});
