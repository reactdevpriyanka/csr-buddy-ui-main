import { makeStyles } from '@material-ui/core/styles';
import { Box, Divider, LinearProgress } from '@material-ui/core';
import useCustomer from '@/hooks/useCustomer';
import FeatureFlag from '@/features/FeatureFlag';
import { useTokens } from '@/hooks/useTokens';
import ErrorOverview from './ErrorOverview';
import CustomerName from './CustomerName';
import MemberSince from './MemberSince';
import EnactButton from './EnactButton';
import OrderDetails from './OrderDetails';
import StorefrontNav from './StorefrontNav';

const useStyles = makeStyles((theme) => ({
  overview: {
    display: 'grid',
    alignItems: 'start',
    width: '100%',
  },
  customerName: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-between',
  },
  divider: {
    margin: `${theme.utils.fromPx(24)} ${theme.utils.fromPx(0)} ${theme.utils.fromPx(
      0,
    )} ${theme.utils.fromPx(0)}`,
  },
  icon: {
    paddingLeft: '0px',
    verticalAlign: 'bottom',
    color: '#1C49C2',
  },
  iconButton: {
    padding: '0px',

    '&:hover': {
      backgroundColor: 'unset',
    },
  },
  guestBadge: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 0,
    order: 2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: `${theme.utils.fromPx(0)} ${theme.utils.fromPx(0)}`,
    height: '20px',
    width: '55px',
    background: '#FFC80C',
    borderRadius: '4px',
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: theme.utils.fromPx(14),
    lineHeight: theme.utils.fromPx(20),
    color: '#121212',
  },
}));

const Loader = () => (
  <Box sx={{ width: '100%' }}>
    <LinearProgress />
  </Box>
);

const CustomerOverview = () => {
  const classes = useStyles();
  // eslint-disable-next-line no-unused-vars
  const { data: tokens, error: tokenError } = useTokens();
  const { data: customer, error } = useCustomer();

  if (!customer) {
    return <Loader />;
  }

  if (error) {
    return <ErrorOverview />;
  }

  const { customerFullName, registrationDate, registerType } = customer;

  const isGuest = registerType === 'ONETIME';

  return (
    <div className={classes.overview}>
      <div className={classes.customerName}>
        <CustomerName>{customerFullName}</CustomerName>
        {isGuest && (
          <span className={classes.guestBadge} data-testid="customeroverview:guest">
            Guest
          </span>
        )}
      </div>
      <div>
        <MemberSince>{registrationDate}</MemberSince>
      </div>
      <div>
        <OrderDetails isGuest={isGuest} />
      </div>
      <div>
        <EnactButton />
      </div>
      <FeatureFlag flag="feature.innovationday.storefront.deeplinking">
        <div>
          <StorefrontNav />
        </div>
      </FeatureFlag>
      <Divider className={classes.divider} />
    </div>
  );
};

CustomerOverview.propTypes = {};

export default CustomerOverview;
