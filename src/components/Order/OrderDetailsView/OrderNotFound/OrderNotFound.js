import Button from '@/components/Button';
import { makeStyles } from '@material-ui/core';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    paddingTop: theme.utils.fromPx(84),
  },
  container: {
    margin: '0px auto',
  },
  centerText: {
    textAlign: 'center',
    font: 'Roboto',
    paddingBottom: theme.utils.fromPx(16),
    lineHeight: theme.utils.fromPx(24),
    fontSize: theme.utils.fromPx(16),
    color: '#4D4D4D',
  },
  returnBtn: {
    '&.MuiButtonBase-root': {
      width: theme.utils.fromPx(214),
      height: theme.utils.fromPx(42),
      color: theme.palette.primary.alternate,
      borderColor: theme.palette.primary.alternate,
    },
  },
}));

const OrderNotFound = () => {
  const classes = useStyles();

  const router = useRouter();

  const { id: customerId } = router.query;

  const handleOnClick = useCallback(() => {
    router.push(`/customers/${customerId}/activity`);
  });

  return (
    <div data-testid="order-not-found" className={classes.root}>
      <div className={classes.container}>
        <div className={classes.centerText}>There has been an error.</div>
        <Button
          solidWhite
          data-testid="order-not-found:return-to-activity-feed-btn"
          onClick={handleOnClick}
          className={classes.returnBtn}
        >
          Return to Activity Feed
        </Button>
      </div>
    </div>
  );
};

export default OrderNotFound;
