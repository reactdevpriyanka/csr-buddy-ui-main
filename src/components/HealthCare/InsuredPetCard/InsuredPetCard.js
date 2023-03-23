import PropTypes from 'prop-types';
import { Card, CardMedia, Grid } from '@mui/material';
import PetAvatar from '@/components/CustomerSidebar/PetProfile/PetAvatar';
import { getAvatarUrl } from '@/components/CustomerSidebar/PetProfile/PetProfile';
import Sticker from '@/components/Sticker';
import { currencyFormatter } from '@/utils/string';
import { makeStyles } from '@material-ui/core';
import { useMemo } from 'react';
import useAthena from '@/hooks/useAthena';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.utils.fromPx(24),
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
}));

const InsuredPetCard = ({ pet }) => {
  const classes = useStyles();

  const { getLang } = useAthena();

  const notAvailableText = getLang('petNoneText', { fallback: 'None' });

  const activePolicies = useMemo(
    () => pet?.petInsurancePolicies?.filter((policy) => policy.policyStatus === 'Active'),
    [pet],
  );

  const policyVendor = useMemo(() => activePolicies?.find((policy) => policy)?.policyVendor, [
    activePolicies,
  ]);

  const insurancePlan = useMemo(
    () => activePolicies?.find((policy) => policy?.productType === 'Insurance'),
    [activePolicies],
  );

  const wellnessPlan = useMemo(
    () => activePolicies?.find((policy) => policy?.productType === 'Wellness'),
    [activePolicies],
  );

  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid #999999',
        padding: '1.2rem 2rem',
        marginBottom: '1.375rem',
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          '& .MuiGrid-item': {
            margin: 'auto 0',
            maxWidth: '100%',
          },
        }}
      >
        <Grid item xs="auto">
          <CardMedia sx={{ width: 60, marginRight: '0.75rem' }}>
            <PetAvatar
              width="60px"
              height="56px"
              alt="healthcare:pet-avatar"
              data-testid="healthcare:pet-avatar"
              gender={pet?.gender}
              src={getAvatarUrl(pet?.type?.name)}
            />
          </CardMedia>
        </Grid>
        <Grid item xs={1.5}>
          <div data-testid={`healthcare:pet-name:${pet?.name}`} className={classes.petName}>
            {pet?.name}
          </div>
          <div key={policyVendor} data-testid={`healthcare:policy-vendor:${policyVendor}`}>
            <Sticker>{policyVendor ?? notAvailableText}</Sticker>
          </div>
        </Grid>
        <Grid item xs={1.5}>
          <div className={classes.header}>Pet ID</div>
          <div data-testid={`healthcare:pet-id:${pet?.id}`}>{pet.id ?? notAvailableText}</div>
        </Grid>
        <Grid item xs={3}>
          <div className={classes.header}>Insurance Policy</div>
          <div key={insurancePlan?.productName} data-testid="healthcare:insurance-policy">
            {insurancePlan?.productName ?? notAvailableText}{' '}
            {insurancePlan?.policyId && <span>({insurancePlan.policyId})</span>}
          </div>
        </Grid>
        <Grid item xs={3}>
          <div className={classes.header}>Wellness Plan</div>
          <div key={wellnessPlan?.productName} data-testid="healthcare:wellness-plan">
            {wellnessPlan?.productName ?? notAvailableText}{' '}
            {wellnessPlan?.policyId && <span>({wellnessPlan.policyId})</span>}
          </div>
        </Grid>
        <Grid item xs>
          <div className={classes.header}>Total per month</div>
          <div data-testid="healthcare:total">
            {currencyFormatter(pet.petInsuranceTotal) ?? notAvailableText}
          </div>
        </Grid>
      </Grid>
    </Card>
  );
};

InsuredPetCard.propTypes = {
  pet: PropTypes.object.isRequired,
};

export default InsuredPetCard;
