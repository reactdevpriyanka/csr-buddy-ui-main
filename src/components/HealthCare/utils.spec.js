import mockPets from '__mock__/pets/pets-insurable-and-not-insurable';
import { CLOSE_BUTTONS } from '../Base/BaseDialog';
import { closeConsentDialog, insurablePetsFilter } from './utils';

const setConsentGiven = jest.fn();
const setDialogOpen = jest.fn();

describe('Healthcare utils', () => {
  test('it should click cancel button and not give consent', () => {
    closeConsentDialog(CLOSE_BUTTONS.CANCEL_BUTTON, setConsentGiven, setDialogOpen);
    expect(setConsentGiven).toHaveBeenCalledWith(false);
    expect(setDialogOpen).toHaveBeenCalledWith(false);
  });

  test('it should simulate click agree button and not give consent', () => {
    closeConsentDialog(true, setConsentGiven, setDialogOpen);
    expect(setConsentGiven).toHaveBeenCalledWith(true);
    expect(setDialogOpen).toHaveBeenCalledWith(false);
  });

  test('It should only return insurable pets', () => {
    const insurablePets = insurablePetsFilter(mockPets);
    expect(insurablePets.map((pet) => ['Dog', 'Cat'].includes(pet?.type?.name))).toHaveLength(4);
  });
});
