import useAthena from '@/hooks/useAthena';
import { Fade } from '@mui/material';
import PropTypes from 'prop-types';
import { useMemo } from 'react';

const PetConsentScript = ({ vendor, selectedPetName = '' }) => {
  const { getLang, getSubstitutedStr } = useAthena();

  const salesDisclosureScript = getLang('salesDisclosureScript');

  const dynamicSalesDisclosureScript = useMemo(() => {
    return getSubstitutedStr({
      str: salesDisclosureScript?.[vendor],
      substitutions: [selectedPetName],
    })?.replace(/\n/g, '\n\n');
  }, [salesDisclosureScript, vendor, selectedPetName]);

  return (
    <Fade in key={vendor} timeout={400}>
      <span data-testid={`pet-consent-script:${vendor}`}>
        {dynamicSalesDisclosureScript ?? 'There was an issue loading the disclosure'}
      </span>
    </Fade>
  );
};

PetConsentScript.propTypes = {
  vendor: PropTypes.string,
  selectedPetName: PropTypes.string,
};

export default PetConsentScript;
