import * as nextRouter from 'next/router';
import ViewPetProfile from '@components/CustomerSidebar/PetProfile/ViewPetProfile';
import { renderWrap } from '@/utils';
import usePetProfile from '@/hooks/usePetProfile';
import petProfile from '__mock__/petprofiles/pet-profile-full';

jest.mock('@/hooks/usePetProfile');

describe('<ViewPetProfile />', () => {
  const mockRouter = jest.spyOn(nextRouter, 'useRouter');

  mockRouter.mockReturnValue({
    query: {
      id: '123123',
    },
  });

  beforeEach(() => {
    usePetProfile.mockReturnValue({
      data: petProfile,
    });
  });

  const render = renderWrap(ViewPetProfile, {
    testId: 'view-pet-profile',
  });

  test('it should render title', () => {
    const { getByTestId } = render();
    expect(getByTestId('viewPet:title')).toHaveTextContent('Pet Details');
  });

  test('it should render name', () => {
    const { getByTestId } = render();
    expect(getByTestId('viewPet:name-label')).toHaveTextContent('Name:');
    expect(getByTestId('viewPet:name-value')).toHaveTextContent('FishWFA');
  });

  test('it should render Type', () => {
    const { getByTestId } = render();
    expect(getByTestId('viewPet:type-label')).toHaveTextContent('Type:');
    expect(getByTestId('viewPet:type-value')).toHaveTextContent('Fish');
  });

  test('it should render Gender', () => {
    const { getByTestId } = render();
    expect(getByTestId('viewPet:sex-label')).toHaveTextContent('Sex:');
    expect(getByTestId('viewPet:sex-value')).toHaveTextContent('Female');
  });

  test('it should render weight class', () => {
    const { getByTestId } = render();
    expect(getByTestId('viewPet:weightclass-label')).toHaveTextContent('Weight Class:');
    expect(getByTestId('viewPet:weightclass-value')).toHaveTextContent('Healthy');
  });

  test('it should render Birthday', () => {
    const { getByTestId } = render();
    expect(getByTestId('viewPet:birthday-label')).toHaveTextContent('Birthday:');
    expect(getByTestId('viewPet:birthday-value')).toHaveTextContent('2022-02-01');
  });

  test('it should render Food Allergies', () => {
    const { getByTestId, getByText } = render();
    expect(getByTestId('viewPet:foodallergies-label')).toHaveTextContent('Food Allergies:');
    expect(getByText('Beef')).toBeTruthy();
    expect(getByText('Corn')).toBeTruthy();
    expect(getByText('Egg')).toBeTruthy();
  });

  test('it should render Medical Conditions', () => {
    const { getByTestId, getByText } = render();
    expect(getByTestId('viewPet:medicalconditions-label')).toHaveTextContent('Medical Conditions:');
    expect(getByText('Bladder/Kidney Stones')).toBeTruthy();
    expect(getByText('Lactating')).toBeTruthy();
  });

  test('it should render Medications', () => {
    const { getByTestId, getByText } = render();
    expect(getByTestId('viewPet:medications-label')).toHaveTextContent('Medications:');
    expect(getByText('Cephalosporins')).toBeTruthy();
    expect(getByText('Bacitracin')).toBeTruthy();
  });

  test('it should render Medication Allergies', () => {
    const { getByTestId, getByText } = render();
    expect(getByTestId('viewPet:medicationallergies-label')).toHaveTextContent(
      'Medication Allergies:',
    );
    expect(getByText('Clavulanic Acid')).toBeTruthy();
    expect(getByText('ACE Inhibitors')).toBeTruthy();
  });
});
