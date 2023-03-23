import { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import { BaseDialog } from '@components/Base';
import usePetProfile from '@/hooks/usePetProfile';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { SNACKVARIANTS } from '@/components/SnackMessage/SnackMessage';
import useAthena from '@/hooks/useAthena';
import useCustomer from '@/hooks/useCustomer';
import useAgentInteractions from '@/hooks/useAgentInteractions';

const useStyles = makeStyles((theme) => ({
  root: {},
  dialogTitle: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '20px',
    lineHeight: '28px',
    letterSpacing: '1%',
    color: '#333333',
  },
}));

const DeactivatePetDialog = ({
  petId,
  newPetDeactivateReason,
  customerId,
  isOpen = false,
  openDialog,
}) => {
  const classes = useStyles();
  const router = useRouter();
  const { getLang } = useAthena();
  const { enqueueSnackbar } = useSnackbar();
  const { captureInteraction } = useAgentInteractions();

  const { data: customer, error, mutate: mutateCustomerPetProfile } = useCustomer();
  const { pets = [] } = customer;
  const petOptions = useMemo(() => pets.map((pet) => ({ id: pet.id, label: pet.name })), [pets]);

  const { data: petsData, mutate: mutatePetProfile, updatePetProfile } = usePetProfile(petId);

  const pageName = 'Deactivate Pet Dialog - VT';

  const onClose = useCallback(() => {
    const query = { ...router.query };
    delete query.interactionPanel;
    delete query.petId;
    router.push({ pathname: router.pathname, query });
  }, [router]);

  const handleClose = useCallback((event) => {
    openDialog(false);
    onClose();
  }, []);

  const handleDeactivatePet = useCallback(() => {
    const data = {
      id: petId,
      name: petsData.name,
      userId: customerId,
      status: 'INACTIVE',
      statusReason: newPetDeactivateReason.toUpperCase(),
      label: petsData.label,
      breed: petsData.breed,
      weightInPounds: petsData.weightInPounds,
      gender: petsData.gender,
      adoptionDate: petsData.adoptionDate,
      birthday: petsData.birthday,
      medicationAllergies: petsData.medicationAllergies,
      medications: petsData.medications,
      existingMedicalConditions: petsData.existingMedicalConditions,
      allergies: petsData.allergies,
    };

    updatePetProfile({ customerId, petId, data })
      .then(() => mutatePetProfile(data))
      .then(() => mutateCustomerPetProfile())
      .then(() =>
        captureInteraction({
          type: 'PET_PROFILE_UPDATED',
          subjectId: petId,
          action: 'UPDATE',
          currentVal: data,
          prevVal: petsData || {},
        }),
      )
      .then(() => {
        openDialog(false);
        onClose();

        const petTarget = petOptions.find((option) => option.id === petId);
        const successMessage = petTarget
          ? `Success! ${petTarget.label}'s profile has been marked inactive`
          : null;
        enqueueSnackbar({
          messageHeader: 'Success',
          variant: SNACKVARIANTS.SUCCESS,
          messageSubheader: successMessage,
        });
      })
      .catch(() => {
        enqueueSnackbar({
          messageHeader: 'Error',
          variant: SNACKVARIANTS.ERROR,
          messageSubheader: `Failed to retire the pet profile.`,
        });
      });
  }, [updatePetProfile, mutatePetProfile, mutateCustomerPetProfile]);

  if (error) {
    return null;
  }

  if (!customer) {
    return null;
  }

  return isOpen ? (
    <BaseDialog
      data-testid="deactivate-pet-dialog"
      dialogTitle={<span className={classes.dialogTitle}>{'Deactivate Pet?'}</span>}
      open={isOpen}
      okLabel="Deactivate Pet"
      pageName={pageName}
      onOk={handleDeactivatePet}
      closeLabel={getLang('cancelText', { fallback: 'Cancel' })}
      onClose={handleClose}
    >
      {getLang('DeactivatePetInformationalText', {
        fallback:
          'Marking a pet as inactive does not delete or cancel the account. Confirm with the customer if they want to modify or cancel the inactive pet’s Autoship, Pharmacy, or Vet Diet orders.',
      })}
    </BaseDialog>
  ) : null;
};

DeactivatePetDialog.propTypes = {
  petId: PropTypes.string.isRequired,
  customerId: PropTypes.string.isRequired,
  newPetDeactivateReason: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  openDialog: PropTypes.func.isRequired,
};

export default DeactivatePetDialog;
