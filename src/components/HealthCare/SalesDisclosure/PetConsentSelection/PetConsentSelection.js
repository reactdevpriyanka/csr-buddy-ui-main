import { Checkbox, FormControl, FormControlLabel, Grid } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';

const PetConsentSelection = ({ pets = [], setSelectedPet }) => {
  const [checkboxState, setCheckboxState] = useState(
    pets.reduce((state, pet) => ({ ...state, [pet?.id]: false }), {}),
  );

  const handleCheckboxChange = (event) => {
    const petName = event.target.value;
    const newCheckboxState = pets.reduce((state, pet) => ({ ...state, [pet?.id]: false }), {});

    if (!checkboxState?.[petName]) {
      setSelectedPet(petName);
      newCheckboxState[petName] = true;
    } else {
      setSelectedPet('');
    }

    setCheckboxState(newCheckboxState);
  };

  return (
    <FormControl
      data-testid="pet-consent-selection"
      sx={{ paddingTop: '0.5rem', paddingBottom: '0.25rem', width: '100%' }}
    >
      <Grid container>
        {pets.map((pet) => (
          <Grid item key={pet?.id} xs={6}>
            <FormControlLabel
              value={pet?.id}
              label={pet?.name}
              control={
                <Checkbox
                  disableRipple
                  onClick={handleCheckboxChange}
                  checked={checkboxState?.[pet?.id]}
                  data-testid={`pet-consent-selection:${pet?.id}`}
                  sx={{ borderRadius: '.25rem', '&.Mui-checked': { color: '#1C49C2' } }}
                />
              }
            />
          </Grid>
        ))}
      </Grid>
    </FormControl>
  );
};

PetConsentSelection.propTypes = {
  pets: PropTypes.arrayOf(PropTypes.object),
  setSelectedPet: PropTypes.func,
};

export default PetConsentSelection;
