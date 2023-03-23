import { makeStyles } from '@material-ui/core/styles';
import CustomerInformation from '@components/CustomerSidebar/CustomerInformation';
import PetProfiles from '@components/CustomerSidebar/PetProfiles';
import CustomerServices from '@components/CustomerSidebar/CustomerServices';
import PetEvents from '@components/CustomerSidebar/PetEvents';
import CustomerTags from './CustomerTags';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: `${theme.spacing(0)} ${theme.spacing(1.5)}`,
  },
}));

const CustomerInteraction = () => {
  const classes = useStyles();

  return (
    <div data-testid="customer-interaction" className={classes.root}>
      <CustomerTags />
      <CustomerInformation />
      <PetProfiles />
      <CustomerServices />
      <PetEvents />
    </div>
  );
};

export default CustomerInteraction;
