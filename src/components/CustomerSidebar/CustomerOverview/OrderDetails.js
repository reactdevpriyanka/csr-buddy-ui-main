import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import useOrderDetails from '@/hooks/useOrderDetails';
import { Box, LinearProgress } from '@material-ui/core';
import useAthena from '@/hooks/useAthena';

const useStyles = makeStyles((theme) => ({
  ordersFor12MonthRollingPeriod: {
    ...theme.fonts.textSmall,
    color: theme.palette.gray.light,
    padding: '0',
    margin: '0',
    fontSize: '0.875rem',
    fontWeight: '500',
    lineHeight: '1rem',
  },
}));

const Loader = () => (
  <Box sx={{ width: '100%' }} data-testid="loader">
    <LinearProgress />
  </Box>
);

const OrderDetails = ({ isGuest = false }) => {
  const classes = useStyles();
  const { data, error } = useOrderDetails();
  const { getLang } = useAthena();

  if (error) {
    return null;
  }

  if (!data) {
    return <Loader />;
  }

  const { ordersFor12MonthRollingPeriod, mostRecentOrderPlacedTime } = data;

  const orderYear = new Date(mostRecentOrderPlacedTime).getFullYear();

  return (
    <p className={classes.ordersFor12MonthRollingPeriod} data-testid="orders-past-12-months">
      {isGuest
        ? `${getLang('oneOrderIn', {
            fallback: '1 Order in',
          })} ${orderYear}`
        : `${ordersFor12MonthRollingPeriod} ${getLang('ordersIn12MonthsText', {
            fallback: 'Orders In Last 12 Months',
          })}`}
    </p>
  );
};

OrderDetails.propTypes = {
  isGuest: PropTypes.bool,
};

export default OrderDetails;
