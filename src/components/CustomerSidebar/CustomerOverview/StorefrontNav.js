import { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@mui/material';
import TooltipPrimary from '@/components/TooltipPrimary';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';
import HealthAndSafetyOutlinedIcon from '@mui/icons-material/HealthAndSafetyOutlined';
import OtherHousesOutlinedIcon from '@mui/icons-material/OtherHousesOutlined';
import PetsOutlinedIcon from '@mui/icons-material/PetsOutlined';
import useEnactment from '@/hooks/useEnactment';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: '2px',
  },
  icon: {
    cursor: 'pointer',
  },
}));

const StorefrontNav = () => {
  const classes = useStyles();
  const { openEnactmentPage } = useEnactment();

  const openStorefrontPage = useCallback(
    (url) => {
      openEnactmentPage(url);
    },
    [openEnactmentPage],
  );

  return (
    <Grid
      container
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      className={classes.container}
    >
      <Grid item xs={1}>
        <TooltipPrimary title="Account">
          <AccountBoxOutlinedIcon
            className={classes.icon}
            color="primary"
            data-testid="storefrontnav:account"
            onClick={() => openStorefrontPage(`/app/account`)}
          />
        </TooltipPrimary>
      </Grid>
      <Grid item xs={1}>
        <TooltipPrimary title="Favorites">
          <FavoriteBorderOutlinedIcon
            className={classes.icon}
            color="primary"
            data-testid="storefrontnav:favorites"
            onClick={() => openStorefrontPage('/app/account/favorites')}
          />
        </TooltipPrimary>
      </Grid>
      <Grid item xs={1}>
        <TooltipPrimary title="Buy Again">
          <LocalMallOutlinedIcon
            className={classes.icon}
            color="primary"
            data-testid="storefrontnav:reorder"
            onClick={() => openStorefrontPage('/app/account/reorder')}
          />
        </TooltipPrimary>
      </Grid>
      <Grid item xs={1}>
        <TooltipPrimary title="Payment Methods">
          <PaymentOutlinedIcon
            className={classes.icon}
            color="primary"
            data-testid="storefrontnav:wallet"
            onClick={() => openStorefrontPage('/app/account/wallet')}
          />
        </TooltipPrimary>
      </Grid>
      <Grid item xs={1}>
        <TooltipPrimary title="Gift Cards">
          <CardGiftcardOutlinedIcon
            className={classes.icon}
            color="primary"
            data-testid="storefrontnav:giftcard"
            onClick={() => openStorefrontPage(`/app/account/giftcard`)}
          />
        </TooltipPrimary>
      </Grid>
      <Grid item xs={1}>
        <TooltipPrimary title="My Pet Health">
          <HealthAndSafetyOutlinedIcon
            className={classes.icon}
            color="primary"
            data-testid="storefrontnav:pethealth"
            onClick={() => openStorefrontPage(`/pethealth`)}
          />
        </TooltipPrimary>
      </Grid>
      <Grid item xs={1}>
        <TooltipPrimary title="My Vet Clinics">
          <OtherHousesOutlinedIcon
            className={classes.icon}
            color="primary"
            data-testid="storefrontnav:clinics"
            onClick={() => openStorefrontPage(`/app/account/clinics`)}
          />
        </TooltipPrimary>
      </Grid>
      <Grid item xs={1}>
        <TooltipPrimary title="My Rescues">
          <PetsOutlinedIcon
            className={classes.icon}
            color="primary"
            data-testid="storefrontnav:rescues"
            onClick={() => openStorefrontPage(`/g/my-rescues`)}
          />
        </TooltipPrimary>
      </Grid>
    </Grid>
  );
};

StorefrontNav.propTypes = {};

export default StorefrontNav;
