import { CLOSE_BUTTONS } from '../Base/BaseDialog';

export const closeConsentDialog = (response, setConsentGiven, setDialogOpen) => {
  switch (response) {
    case CLOSE_BUTTONS.CANCEL_BUTTON:
      setConsentGiven(false);
      break;
    case true:
      setConsentGiven(true);
      break;
    default:
      break;
  }
  setDialogOpen(false);
};

export const insurablePetsFilter = (pets = []) => {
  return pets?.filter(
    (pet) =>
      !(
        pet?.petInsurancePolicies?.some(
          (policy) => policy?.productType === 'Insurance' && policy?.policyStatus === 'Active',
        ) &&
        pet?.petInsurancePolicies?.some(
          (policy) => policy?.productType === 'Wellness' && policy?.policyStatus === 'Active',
        )
      ) &&
      (pet?.type?.name === 'Dog' || pet?.type?.name === 'Cat'),
  );
};
