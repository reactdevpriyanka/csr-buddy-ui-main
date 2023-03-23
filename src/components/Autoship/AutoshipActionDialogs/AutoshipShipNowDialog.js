import { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, Typography, CircularProgress } from '@material-ui/core';
import { sub, isAfter, format } from 'date-fns';
import useEnv from '@/hooks/useEnv';
import useAthena from '@/hooks/useAthena';
import { BaseDialog } from '@components/Base';
import useSubscriptions from '@/hooks/useSubscriptions';
import useFindChildOrders from '@/hooks/useFindChildOrders';
import SuzzieOrderLink from '../../Order/OrderLink';

const useStyles = makeStyles((theme) => ({
  root: {},
  autoShipNowButton: {
    marginTop: '5px',
    marginBottom: '5px',
  },
  sentence1: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '16px',
    lineHeight: '24px',
    letterSpacing: theme.utils.fromPx(0.15),
    color: '#031657',
  },
  sentence2: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '16px',
    lineHeight: '24px',
    letterSpacing: theme.utils.fromPx(0.15),
    marginTop: theme.utils.fromPx(10),
  },
  dialogContent: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
  },
  orderNumber: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '16px',
    lineHeight: '24px',
    letterSpacing: theme.utils.fromPx(0.15),
    color: '#031657',
  },
  link: {
    color: theme.palette.blue.light,
    textTransform: 'none',
    textDecoration: 'none',
    '&:focus, &:hover': {
      textDecoration: 'none',
    },
  },
  nextFulfillmentDateDiv: {
    display: 'contents',
  },
  frequencyDiv: {
    display: 'contents',
  },
  strongTxt: {
    fontWeight: 'bold',
  },
}));

const AutoshipShipNowDialog = ({
  id,
  name,
  customerId,
  frequency,
  nextFulfillmentDate,
  isOpen = false,
  openDialog,
  postInteraction,
}) => {
  const classes = useStyles();
  const { chewyEnv } = useEnv();
  const { data: childOrders, error: childOrdersError, mutate } = useFindChildOrders(id);
  const { shipSubscriptionNow } = useSubscriptions();
  const { getLang } = useAthena();

  const pageName = 'Autoship Ship Now Dialog - VT';

  const lastChild = useMemo(
    () => (childOrders && (childOrders || []).length > 0 ? childOrders[0] : null),
    [childOrders],
  );

  const lastShipmentWithin24Hours = useMemo(() => {
    return lastChild && isAfter(new Date(lastChild.timePlaced), sub(new Date(), { days: 1 }));
  }, [lastChild]);

  const handleCloseDialog = useCallback(() => openDialog(false), [openDialog]);

  const captureInteraction = useCallback(() => {
    const data = {
      name: name,
      shipNow: 'true',
    };
    postInteraction('AUTOSHIP_TRIGGERED', data, 'CREATE');
  }, [postInteraction, name]);

  const handleShipNow = useCallback(() => {
    // Now handle the Ship Now part
    const data = {};
    shipSubscriptionNow({ subscriptionId: id, customerId, data }, captureInteraction).then(() =>
      mutate(),
    );
    openDialog(false);
  }, [isOpen, id, shipSubscriptionNow, mutate]);

  const title = useMemo(() => {
    if (!childOrders) {
      return (
        <Typography data-testid="autoship-shipNow:duplicateShipments" variant="h5">
          {'Checking for duplicate shipments'}
        </Typography>
      );
    }
    // eslint-disable-next-line unicorn/prefer-ternary
    if (lastShipmentWithin24Hours && !childOrdersError) {
      return (
        <Typography variant="h5">
          {getLang('shipNowOrderExistsText', {
            fallback: 'Hang on! We sniffed out a similar order',
          })}
        </Typography>
      );
    } else {
      return (
        <Typography data-testid="autoship-shipNowQuestionText" variant="h5">
          {getLang('shipNowQuestionText', { fallback: 'Confirm Shipment' })}
        </Typography>
      );
    }
  }, [lastShipmentWithin24Hours, childOrders, childOrdersError]);

  const content = useMemo(() => {
    if (!childOrders) {
      return <CircularProgress />;
    }
    // eslint-disable-next-line unicorn/prefer-ternary
    if (lastShipmentWithin24Hours && !childOrdersError) {
      return (
        <div className={classes.dialogInnerContent}>
          <span className={classes.sentence1}>
            {getLang('orderExistsMessageText1', { fallback: 'It looks like an order' })}{' '}
            <span className={classes.orderNumber}>
              {' '}
              ({lastChild.id || lastChild.externalOrderId})
            </span>{' '}
            {getLang('orderExistsMessageText2', {
              fallback: 'with these items was recently placed on',
            })}{' '}
            <span className={classes.orderNumber} data-testid="duplicate-placed-date">
              {format(new Date(lastChild.timePlaced), 'EEEE, MMMM do')}
            </span>
            .
            <SuzzieOrderLink
              className={classes.link}
              target="_blank"
              href={`https://cs-platform.csbb.${chewyEnv}.chewy.com/orders/${
                lastChild.id || lastChild.externalOrderId
              }`}
            >
              {`${getLang('reviewOrderLinkText', { fallback: 'Review this order' })}`}
            </SuzzieOrderLink>
          </span>

          <span className={classes.sentence2} data-testid="autoship-shipNowAgainConfirmText">
            {getLang('shipNowAgainConfirmText', {
              fallback:
                'Are you sure you wish to place another order for these items? Click Order Again to confirm an order request.',
            })}
          </span>
        </div>
      );
    } else {
      return (
        <div className={classes.frequencyDiv} data-testid="autoship-confirmShipNowDescription">
          {getLang('confirmShipNowDescription', {
            fallback: 'Confirm immediate shipment of Autoship ID',
          })}
          <span className={classes.strongTxt}>
            {getLang('confirmShipNowDescrID', { fallback: `#${id}` })}
          </span>
        </div>
      );
    }
  }, [lastChild, lastShipmentWithin24Hours, childOrders, childOrdersError]);

  return isOpen ? (
    <BaseDialog
      data-testid="autoship-ship-now"
      open={isOpen}
      onClose={handleCloseDialog}
      onOk={handleShipNow}
      disableOkBtn={!childOrders}
      pageName={pageName}
      closeLabel={
        lastShipmentWithin24Hours
          ? getLang('nevermindLabelText', { fallback: 'Nevermind' })
          : getLang('cancelText', { fallback: 'Cancel' })
      }
      okLabel={
        lastShipmentWithin24Hours
          ? getLang('orderAgainLabelText', { fallback: 'Order Again' })
          : getLang('shipNowButtonText', { fallback: 'Ship Now' })
      }
      dialogTitle={title}
    >
      <form className={classes.dialogInnerContent}>
        <FormControl className={classes.formControl}>{content}</FormControl>
      </form>
    </BaseDialog>
  ) : null;
};

AutoshipShipNowDialog.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  customerId: PropTypes.string.isRequired,
  frequency: PropTypes.string,
  nextFulfillmentDate: PropTypes.string,
  isOpen: PropTypes.bool,
  openDialog: PropTypes.func,
  postInteraction: PropTypes.func,
};

export default AutoshipShipNowDialog;
