import fishPetData from '__mock__/petprofiles/pet-profile-full';
import happyCustomer from '__mock__/customers/happy';
import { useRouter } from 'next/router';
import useCustomer from '@/hooks/useCustomer';
import * as useAgentInteractions from '@/hooks/useAgentInteractions';
import usePetProfile from '@/hooks/usePetProfile';
import renderWrap from '@/utils/renderWrap';
import { fireEvent, within, waitFor } from '@testing-library/dom';
import { SNACKVARIANTS } from '@/components/SnackMessage/SnackMessage';
import DeactivatePetDialog from './DeactivatePetDialog';

const finalHappyCustomer = {
  ...happyCustomer,
  pets: [
    {
      id: `${fishPetData.id}`,
      name: fishPetData.name,
      weight: fishPetData.weight,
      gender: fishPetData.gender,
      breedType: fishPetData.breedType,
      breed: fishPetData.breed,
      birthday: fishPetData.birthday,
      adopted: fishPetData.adopted,
      avatarUrl: 'https://dotcms-ui.chewy.com/images/pet-profile/avatars/avatar_dog_11_husky.png',
      medications: fishPetData.medications,
      medicationAllergies: fishPetData.medicationAllergies,
      existingMedicationAllergies: fishPetData.existingMedicationAllergies,
      status: fishPetData.status,
      timeCreated: fishPetData.timeCreated,
      timeUpdated: fishPetData.timeUpdated,
    },
  ],
};

const defaultProps = {
  petId: `${fishPetData.id}`,
  newPetDeactivateReason: 'DECEASED',
  customerId: `${finalHappyCustomer.id}`,
  isOpen: true,
  openDialog: (data) => {},
};

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

useRouter.mockReturnValue({
  pathname: '/customers/[id]/healthcare',
  query: {
    agentProfile: 'DEV - CSRBuddy - Admin',
    interactionPanel: 'deactivatePetProfile',
    petId: 83629954,
    id: 148817172,
  },
});

jest.mock('@/hooks/useCustomer');
jest.mock('@/hooks/usePetProfile');

const mockEnqueueSnackbar = jest.fn();

jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => {
    return {
      enqueueSnackbar: mockEnqueueSnackbar,
    };
  },
}));

describe('<DeactivatePetDialog />', () => {
  const render = renderWrap(DeactivatePetDialog, { defaultProps });

  it('renders empty when isOpen false', () => {
    useCustomer.mockReturnValue({
      data: finalHappyCustomer,
      mutate: jest.fn(),
    });

    usePetProfile.mockReturnValue({
      data: fishPetData,
      mutate: jest.fn(),
      updatePetProfile: jest.fn(),
    });
    const { container } = render({ isOpen: false });
    expect(container).toBeEmptyDOMElement();
  });
  it('renders empty when error on customer', () => {
    usePetProfile.mockReturnValue({
      data: fishPetData,
      mutate: jest.fn(),
      updatePetProfile: jest.fn(),
    });
    useCustomer.mockReturnValue({
      data: finalHappyCustomer,
      mutate: jest.fn(),
      error: 'err',
    });
    const { container } = render();
    expect(container).toBeEmptyDOMElement();
  });
  it('Dialog displays confirmation message', () => {
    useCustomer.mockReturnValue({
      data: finalHappyCustomer,
      mutate: jest.fn(),
    });

    usePetProfile.mockReturnValue({
      data: fishPetData,
      mutate: jest.fn(),
      updatePetProfile: jest.fn(),
    });

    const { getByTestId } = render();

    const dialog = getByTestId('deactivate-pet-dialog');
    const warning =
      'Marking a pet as inactive does not delete or cancel the account. Confirm with the customer if they want to modify or cancel the inactive pet’s Autoship, Pharmacy, or Vet Diet orders.';

    expect(within(dialog).getByText('Deactivate Pet?')).toBeInTheDocument();
    expect(within(dialog).getByText(warning)).toBeInTheDocument();
  });

  it('Contains confirm and cancel buttons', () => {
    useCustomer.mockReturnValue({
      data: finalHappyCustomer,
      mutate: jest.fn(),
    });

    usePetProfile.mockReturnValue({
      data: fishPetData,
      mutate: jest.fn(),
      updatePetProfile: jest.fn(),
    });

    const { getByTestId } = render();

    const okButton = getByTestId('base-dialog-ok-button');
    const cancelButton = getByTestId('base-dialog-close-button');

    expect(okButton).toHaveTextContent('Deactivate Pet');
    expect(cancelButton).toHaveTextContent('Cancel');
  });

  it('does not invoke hooks but invokes router push and openDialog on cancel', async () => {
    const captureInteractionMock = jest.fn().mockReturnValue(Promise.resolve({ data: [] }));
    jest
      .spyOn(useAgentInteractions, 'default')
      .mockImplementation(() => ({ captureInteraction: captureInteractionMock }));
    const routerPush = jest.fn();

    useRouter.mockReturnValue({
      pathname: '/customers/[id]/healthcare',
      query: {
        agentProfile: 'DEV - CSRBuddy - Admin',
        interactionPanel: 'deactivatePetProfile',
        petId: 83629954,
        id: 148817172,
      },
      push: routerPush,
    });

    const mutateCustomerPetProfile = jest.fn().mockResolvedValue({});

    const mutatePetProfile = jest.fn().mockResolvedValue({});
    const updatePetProfile = jest.fn().mockResolvedValue({});

    useCustomer.mockReturnValue({
      data: finalHappyCustomer,
      mutate: mutateCustomerPetProfile,
    });
    usePetProfile.mockReturnValue({
      data: fishPetData,
      mutate: mutatePetProfile,
      updatePetProfile: updatePetProfile,
    });

    const closeDialogMock = jest.fn();

    const newProps = {
      ...defaultProps,
      openDialog: closeDialogMock,
    };

    const render2 = renderWrap(DeactivatePetDialog, { defaultProps: newProps });

    const { getByTestId } = render2({ closeDialog: closeDialogMock });
    const closeButton = getByTestId('base-dialog-close-button');
    fireEvent.mouseDown(closeButton);
    fireEvent.click(closeButton);

    await waitFor(() => expect(routerPush.mock.calls).toHaveLength(1));
    expect(routerPush).toHaveBeenCalledWith({
      pathname: '/customers/[id]/healthcare',
      query: {
        agentProfile: 'DEV - CSRBuddy - Admin',
        id: 148817172,
      },
    });

    expect(closeDialogMock.mock.calls).toHaveLength(1);
    expect(updatePetProfile).not.toHaveBeenCalled();
    expect(mutatePetProfile).not.toHaveBeenCalled();
    expect(mutateCustomerPetProfile).not.toHaveBeenCalled();
    expect(captureInteractionMock).not.toHaveBeenCalled();
  });

  it('modifies the route without the petid or interactionPanel query params', async () => {
    const captureInteractionMock = jest.fn().mockReturnValue(Promise.resolve({ data: [] }));
    jest
      .spyOn(useAgentInteractions, 'default')
      .mockImplementation(() => ({ captureInteraction: captureInteractionMock }));
    const routerPush = jest.fn();

    useRouter.mockReturnValue({
      pathname: '/customers/[id]/healthcare',
      query: {
        agentProfile: 'DEV - CSRBuddy - Admin',
        interactionPanel: 'deactivatePetProfile',
        petId: 83629954,
        id: 148817172,
      },
      push: routerPush,
    });

    const mutateCustomerPetProfile = jest.fn().mockResolvedValue({});

    const mutatePetProfile = jest.fn().mockResolvedValue({});
    const updatePetProfile = jest.fn().mockResolvedValue({});

    useCustomer.mockReturnValue({
      data: finalHappyCustomer,
      mutate: mutateCustomerPetProfile,
    });
    usePetProfile.mockReturnValue({
      data: fishPetData,
      mutate: mutatePetProfile,
      updatePetProfile: updatePetProfile,
    });

    const { getByTestId } = render();
    const okButton = getByTestId('base-dialog-ok-button');
    fireEvent.mouseDown(okButton);
    fireEvent.click(okButton);

    await waitFor(() => expect(routerPush.mock.calls).toHaveLength(1));

    expect(routerPush).toHaveBeenCalledWith({
      pathname: '/customers/[id]/healthcare',
      query: {
        agentProfile: 'DEV - CSRBuddy - Admin',
        id: 148817172,
      },
    });

    await waitFor(() => expect(updatePetProfile.mock.calls).toHaveLength(1));
    await waitFor(() => expect(mutatePetProfile.mock.calls).toHaveLength(1));
    await waitFor(() => expect(mutateCustomerPetProfile.mock.calls).toHaveLength(1));
    await waitFor(() => expect(captureInteractionMock.mock.calls).toHaveLength(1));
  });
  it('Invokes updatePetProfile, mutatePetProfile, mutateCustomerProfile, and captureInteraction on submit', async () => {
    const captureInteractionMock = jest.fn().mockReturnValue(Promise.resolve({ data: [] }));
    jest
      .spyOn(useAgentInteractions, 'default')
      .mockImplementation(() => ({ captureInteraction: captureInteractionMock }));
    const routerPush = jest.fn();

    useRouter.mockReturnValue({
      pathname: '/customers/[id]/healthcare',
      query: {
        agentProfile: 'DEV - CSRBuddy - Admin',
        interactionPanel: 'deactivatePetProfile',
        petId: 83629954,
        id: 148817172,
      },
      push: routerPush,
    });

    const mutateCustomerPetProfile = jest.fn().mockResolvedValue({});

    const mutatePetProfile = jest.fn().mockResolvedValue({});
    const updatePetProfile = jest.fn().mockResolvedValue({});

    useCustomer.mockReturnValue({
      data: finalHappyCustomer,
      mutate: mutateCustomerPetProfile,
    });
    usePetProfile.mockReturnValue({
      data: fishPetData,
      mutate: mutatePetProfile,
      updatePetProfile: updatePetProfile,
    });

    const { getByTestId } = render();

    const okButton = getByTestId('base-dialog-ok-button');
    fireEvent.mouseDown(okButton);
    fireEvent.click(okButton);

    await waitFor(() => expect(updatePetProfile.mock.calls).toHaveLength(1));
    await waitFor(() => expect(mutatePetProfile.mock.calls).toHaveLength(1));
    await waitFor(() => expect(mutateCustomerPetProfile.mock.calls).toHaveLength(1));
    await waitFor(() => expect(captureInteractionMock.mock.calls).toHaveLength(1));
  });

  it('provides the correct payloads to each of  update/mutate pet, mutate customer profile, and capture interaction', async () => {
    const captureInteractionMock = jest.fn().mockReturnValue(Promise.resolve({ data: [] }));
    jest
      .spyOn(useAgentInteractions, 'default')
      .mockImplementation(() => ({ captureInteraction: captureInteractionMock }));
    const routerPush = jest.fn();

    useRouter.mockReturnValue({
      pathname: '/customers/[id]/healthcare',
      query: {
        agentProfile: 'DEV - CSRBuddy - Admin',
        interactionPanel: 'deactivatePetProfile',
        petId: 83629954,
        id: 148817172,
      },
      push: routerPush,
    });

    const mutateCustomerPetProfile = jest.fn().mockResolvedValue({});

    const mutatePetProfile = jest.fn().mockResolvedValue({});
    const updatePetProfile = jest.fn().mockResolvedValue({});

    useCustomer.mockReturnValue({
      data: finalHappyCustomer,
      mutate: mutateCustomerPetProfile,
    });
    usePetProfile.mockReturnValue({
      data: fishPetData,
      mutate: mutatePetProfile,
      updatePetProfile: updatePetProfile,
    });

    const { getByTestId } = render();

    const okButton = getByTestId('base-dialog-ok-button');
    fireEvent.mouseDown(okButton);
    fireEvent.click(okButton);

    await waitFor(() => expect(updatePetProfile.mock.calls).toHaveLength(1));

    const newPetsData = {
      id: defaultProps.petId,
      name: fishPetData.name,
      userId: defaultProps.customerId,
      status: 'INACTIVE',
      statusReason: defaultProps.newPetDeactivateReason.toUpperCase(),
      label: fishPetData.label,
      breed: fishPetData.breed,
      weightInPounds: fishPetData.weightInPounds,
      gender: fishPetData.gender,
      adoptionDate: fishPetData.adoptionDate,
      birthday: fishPetData.birthday,
      medicationAllergies: fishPetData.medicationAllergies,
      medications: fishPetData.medications,
      existingMedicalConditions: fishPetData.existingMedicalConditions,
      allergies: fishPetData.allergies,
    };

    expect(updatePetProfile).toHaveBeenCalledWith({
      customerId: defaultProps.customerId,
      petId: defaultProps.petId,
      data: newPetsData,
    });

    expect(mutatePetProfile).toHaveBeenCalledWith(newPetsData);
    expect(mutateCustomerPetProfile).toHaveBeenCalledWith();
    expect(captureInteractionMock.mock.calls[0][0]).toMatchObject({
      type: 'PET_PROFILE_UPDATED',
      subjectId: defaultProps.petId,
      action: 'UPDATE',
      currentVal: newPetsData,
    });

    expect(mockEnqueueSnackbar).toHaveBeenCalledWith({
      messageHeader: 'Success',
      variant: SNACKVARIANTS.SUCCESS,
      messageSubheader: `Success! FishWFA's profile has been marked inactive`,
    });
  });
});
