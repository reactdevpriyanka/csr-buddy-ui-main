import { makeStyles } from "@material-ui/core";
import axios from "axios";
import { Fragment, useCallback, useMemo, useState} from "react";
import PropTypes from 'prop-types';
import InsuredPetCard from "@/components/HealthCare/InsuredPetCard/InsuredPetCard";
import SalesDisclosure from "@/components/HealthCare/SalesDisclosure/SalesDisclosure";
import Button from "@/components/Button";
import useAthena from "@/hooks/useAthena";
import TrupanionPortalDialog from "@/components/HealthCare/InsuredPetCard/TrupanionPortalDialog";
import useTwoColumnLayout from "@/hooks/useTwoColumnLayout";

import QuoteConsentDisclosure from "@/components/HealthCare/QuoteConsentDisclosure/QuoteConsentDisclosure";
import { insurablePetsFilter } from "@/components/HealthCare/utils";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.utils.fromPx(24),
  },
  title: {
    color: '#333333',
    fontSize: theme.utils.fromPx(24),
    lineHeight: theme.utils.fromPx(34),
    fontWeight: 700,
  },
  petName: {
    fontWeight: 700,
    fontSize: theme.utils.fromPx(16),
    lineHeight: theme.utils.fromPx(24),
  },
  header: {
    color: '#666666',
    fontSize: theme.utils.fromPx(12),
    lineHeight: theme.utils.fromPx(16),
  },
  statusSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: theme.utils.fromPx(24),
    width: '100%',
  },
  trupanionPortalButton: {
    color: theme.palette.blue.chewyBrand,
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: '0.01em',
    border: 'none',
    fontSize: theme.utils.fromPx(16),
    lineHeight: theme.utils.fromPx(20),
    minWidth: theme.utils.fromPx(96),
    height: theme.utils.fromPx(42),
    '&:focus': {
      border: `${theme.utils.fromPx(2)} solid ${theme.palette.blue.chewyBrand}`,
      textDecorationLine: 'underline',
      backgroundColor: 'transparent',
    },
  },
}));

export default function HealthcarePage({ pets = [] ,trupanionPortalURL}) {
  const classes = useStyles();

  const { getLang } = useAthena(); // athena config

  const { setSidebarOpen} = useTwoColumnLayout();
  
  const [dialogOpen, setDialogOpen] = useState(false);

  const activeInsuredPets = useMemo(() => {
    return pets?.filter(pet => pet?.petInsurancePolicies?.some(policy => policy?.policyStatus === "Active"));
  }, [pets]);

  const insurablePets = useMemo(() => {
    return insurablePetsFilter(pets)
  }, [pets])

  const trupanionPolicy = useMemo(() => {
    return pets?.filter(pet => {
      return pet?.petInsurancePolicies?.some(policy => policy?.policyVendor === "Trupanion")
    })
  }, [pets])


  const handleOnTrupanionPortalDialog = useCallback(() => {    
    setDialogOpen(true);
    setSidebarOpen(false)
  }, [setDialogOpen]);

  const closeSalesConsentDialog = useCallback(
    () => {   
      setDialogOpen(false);
      setSidebarOpen(true)
    },[setDialogOpen]);

  return(
    <div className={classes.root}>
      <div className={classes.title}>Pet Insurance</div>
      <QuoteConsentDisclosure />
      <SalesDisclosure pets={insurablePets} />
      <div className={classes.statusSection}>
      <div className={classes.title}>{getLang('insuredPetsLabel', { fallback: 'Insured Pets' })} ({Number.parseInt(activeInsuredPets?.length)})</div>
      {trupanionPolicy.length>0 &&
      <Button
          className={classes.trupanionPortalButton}
          data-testid="view-trupanion-portal"
          aria-label="View Trupanion Portal"
          onClick={handleOnTrupanionPortalDialog}
        >
          {getLang('viewTrupanionPortalBtn', { fallback: 'View Trupanion Portal' })}
        </Button>}
        </div>
      {activeInsuredPets?.filter(pet => pet?.petInsurancePolicies)?.map(pet => (
        <Fragment key={pet?.id}>
          <InsuredPetCard pet={pet} /> 
        </Fragment>
      ))}
      {dialogOpen && (
        <TrupanionPortalDialog trupanionPortalURL={trupanionPortalURL} trupanionPolicy={trupanionPolicy} open={dialogOpen} onClose={closeSalesConsentDialog} />
      )}
    </div>
  )
};

HealthcarePage.propTypes = {
  pets: PropTypes.arrayOf(PropTypes.object),
  trupanionPortalURL:PropTypes.string
}

export async function getServerSideProps(context) {
  const { id: customerId } = context.params;
  const { SESSION, agentProfile, routeKey } = context.req.cookies;

  const host = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080'
    : `https://csrb-gateway.csbb.${process.env.CHEWY_ENV}.chewy.com`;

  const pets = await axios.get(`${host}/api/v1/pets?customerId=${customerId}&includePetInsurance=true`, {
    headers: {
      Cookie: `SESSION=${SESSION}; routeKey=${routeKey}; agentProfile=${encodeURIComponent(agentProfile)}`,
    }
  })
  .then(({ data }) => data)
  .catch(() => []);

  const trupanionPortalURL = process.env.CHEWY_ENV === 'stg' ? 'https://chewy-stage-policy.aqvision.dev/dashboard' : 'https://chewy-policy.aqvision.pet/dashboard';

  return {
    props: {
      pets,
      trupanionPortalURL
    }
  }
}