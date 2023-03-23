/* eslint-disable no-console */
/* eslint-disable jsx-a11y/anchor-is-valid */
import PropTypes from 'prop-types';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardActions } from '@material-ui/core';
import { getDayDateYearTimeTimezone } from '@/utils';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import FeatureFlag from '@/features/FeatureFlag';
import { useCallback, useState, useMemo, useContext } from 'react';
import { ButtonGroup, Menu, MenuItem, Button } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import useAthena from '@/hooks/useAthena';
import useAgentInteractions from '@/hooks/useAgentInteractions';
import { v4 as uuidv4 } from 'uuid';
import { useSnackbar } from 'notistack';
import { SNACKVARIANTS } from '@/components/SnackMessage/SnackMessage';
import useFeature from '@/features/useFeature';
import useOrder from '@/hooks/useOrder';
import AssistiveText from '@/components/AssistiveText/AssistiveText';
import usePayment from '@/hooks/usePayment';
import NavigationContext from '@/components/NavigationContext';
import useSendEmail from '@/hooks/useSendEmail';
import CancelOrderDialog from '../CancelOrderDialog';
import { AllowableActions } from './utils';
import BlockOrderDialog from './Dialogs/BlockOrderDialog';
import SystemMessagingDialog from './Dialogs/SystemMessagingDialog';

const notificationType = {
  ORDER_CREATED: 'ORDER_CREATED',
  ORDER_INVOICE: 'ORDER_INVOICE',
  ORDER_CANCELED: 'ORDER_CANCELED',
};

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: '16px',
  },
  rowDiv: {
    display: 'flex',
    flexDirection: 'column',
  },
  icon: {
    marginRight: theme.spacing(0.2),
    '& path': {
      fill: theme.palette.primary.main,
    },
  },
  headerPanel: {
    display: 'flex',
    flexDirection: 'column',
  },
  detailPanel: {
    display: 'grid',
    gridTemplateColumns: '50% 50%',
    paddingBottom: theme.utils.fromPx(16),
  },
  buttonPanel: {
    display: 'flex',
    justifyContent: 'right',
    columnGap: '1px',
  },
  placed: {
    fontFamily: 'Roboto, Regular',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '15px',
    color: '#666666',
  },
  placedTime: {
    fontFamily: 'Roboto, Regular',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '15px',
    color: '#121212',
    marginLeft: '3px',
  },
  header: {
    fontFamily: 'Roboto',
    fontWeight: '600',
    fontSize: '20px',
    lineHeight: '25px',
    letterSpacing: '1%',
    color: '#031657',
  },
  btnTxt: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: '16px',
    lineHeight: '20px',
    color: '#1C49C2',
    textTransform: 'none',
  },
  button: {
    background: '#FFFFFF',
    boxSizing: 'border-box',
    pointerEvents: 'all',
    opacity: '1',
    height: '40px',
    color: '#1C49C2 !important',
    padding: '14px 20px 14px 20px',
    border: '1px solid #1C49C2 !important',
    '&:hover': {
      background: '#B8D7F3',
    },
  },
  systemMessagingButton: {
    marginRight: `${theme.utils.fromPx(10)} !important`,
    lineHeight: `${theme.utils.fromPx(18)} !important`,
    color: '#1C49C2 !important',
    letterSpacing: '-0.03em !important',
    textTransform: 'none !important',
  },
  placedPanel: {
    display: 'flex',
  },
  replacement: {
    backgroundColor: '#1C49C2',
    padding: '12px, 16px, 12px, 16px',
    height: '48px',
    borderRadius: '4px',
    marginBottom: '16px',

    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: '16px',
    lineHeight: '20px',
    color: '#FFFFFF',
  },
  replacementPanel: {
    padding: '12px 16px 12px 16px',
  },
  replaementLink: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: '16px',
    lineHeight: '20px',
    color: '#FFFFFF',
    textDecoration: 'underline',
  },
}));

const OrderDetailsViewHeader = ({
  orderNumber,
  orderDate,
  replaces,
  isActionAllowed,
  orderComments,
  hasOrderDetails,
}) => {
  const classes = useStyles();
  const router = useRouter();
  const { getLang } = useAthena();
  const customerId = router?.query?.id;
  const { mutate, processReturn } = useOrder(orderNumber);

  const { data: paymentDetails = [] } = usePayment(orderNumber);
  const disputeMessageEnabled = paymentDetails?.hasDisputes;

  const showOrderBlock = useFeature('feature.explorer.orderCreateBlockEnabled');
  const oneYearOldFlag = useFeature('feature.explorer.1yearOldBannerEnabled')
    ? differenceInCalendarDays(new Date(), new Date(orderDate)) < 365
    : true;

  // const { processOrder } = useOrder(orderNumber); This code will be used when Process button auth changes are deployed

  const { sendOrderEmail } = useSendEmail();

  const { captureInteraction } = useAgentInteractions();

  const { enqueueSnackbar } = useSnackbar();

  const [cancelOrderDialogOpen, setCancelOrderDialogOpen] = useState(false);

  const [blockOrderDialogOpen, setBlockOrderDialogOpen] = useState(false);

  const [systemMessagingDialogOpen, setSystemMessagingDialogOpen] = useState(false);

  // const doProcessOrder = useCallback(() => { This code will be used when Process button auth changes are deployed
  //   processOrder({ orderId: orderNumber });
  // }, [orderNumber, customerId]);

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleActionsMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleActionsMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProcessOrder = useCallback(() => {
    processReturn({ orderId: orderNumber })
      .then(() => {
        mutate();
        enqueueSnackbar({
          messageHeader: 'Success',
          variant: SNACKVARIANTS.SUCCESS,
          messageSubheader: `Order ${orderNumber} processed`,
        });
      })
      .catch(() => {
        enqueueSnackbar({
          messageHeader: 'Error',
          variant: SNACKVARIANTS.ERROR,
          messageSubheader: `Process Order Failed!`,
        });
      });
  }, [mutate]);

  const sendEmail = (type) => {
    const { id: customerId } = router.query;
    const snackMessage =
      type === notificationType.ORDER_CREATED ? 'Order Confirmation' : 'Order invoice';

    const body = {
      customerId: customerId,
      eventType: 'NOTIFICATION',
      notificationType: type,
      orderId: orderNumber,
      rid: uuidv4(),
      subscriptionId: null,
    };

    sendOrderEmail(body)
      .then(() => {
        captureInteraction({
          type:
            type === notificationType.ORDER_CREATED
              ? 'SENT_ORDER_CONFIRM_EMAIL'
              : 'SENT_INVOICE_EMAIL',
          subjectId: orderNumber,
          action: 'UPDATE',
          currentVal: body,
          prevVal: {},
        });
      })
      .then(() => {
        enqueueSnackbar({
          messageHeader: 'Success',
          variant: SNACKVARIANTS.SUCCESS,
          messageSubheader: `${snackMessage} email sent to customer!`,
        });
      })
      .catch(() => {
        enqueueSnackbar({
          messageHeader: 'Error',
          messageSubheader: `${snackMessage} email failed to send to customer`,
          variant: SNACKVARIANTS.ERROR,
        });
      });
  };

  const sendEmailMenuItems = [
    {
      label: 'Send Invoice',
      action: () => sendEmail(notificationType.ORDER_INVOICE),
      display: isActionAllowed({ actionName: AllowableActions.SEND_ORDER_INVOICE }),
      disabled: false,
      testId: `split-button-Send Invoice:menu-item`,
    },
    {
      label: 'Send Confirm',
      action: () => sendEmail(notificationType.ORDER_CREATED),
      display: isActionAllowed({ actionName: AllowableActions.SEND_ORDER_CONFIRMATION }),
      disabled: false,
      testId: `split-button-Send Invoice:menu-item`,
    },
    {
      label: 'Send Cancel Notification',
      action: () => sendEmail(notificationType.ORDER_CANCELED),
      display: isActionAllowed({ actionName: AllowableActions.SEND_ORDER_CANCELED_NOTIFICATION }),
      disabled: false,
      testId: `split-button-Send Cancel Notification:menu-item`,
    },
  ];

  const ALLOCATE_INVENTORY_FEATURE_FLAG =
    'feature.explorer.orderdetailsview.allocateInventoryEnabled';
  const enableAllocateInventoryBtn = useFeature(ALLOCATE_INVENTORY_FEATURE_FLAG);

  const yearOldOrder = useMemo(
    () => differenceInCalendarDays(new Date(), new Date(orderDate)) > 365,
    [orderDate],
  );

  const { storePrevRoute } = useContext(NavigationContext);

  return (
    <div data-testid="orderDetailsViewHeaderContainer" className={classes.root}>
      {replaces?.orderId && (
        <FeatureFlag flag="feature.explorer.orderdetailsview.headerReplacementCardEnabled">
          <Card data-testid="orderDetailsViewHeaderReplacementCard" className={classes.replacement}>
            <CardActions classes={{ root: classes.replacementPanel }}>
              <InfoOutlinedIcon />
              <div className={classes.messageContent}>
                <span className={classes.messageHeader}>{`Replacement from original `}</span>
                <NextLink href={`/customers/${router.query.id}/orders/${replaces.orderId}`}>
                  <a
                    className={classes.replaementLink}
                    data-testid="orderDetailsViewHeaderReplacementCard:link"
                  >
                    {`Order #${replaces.orderId}`}
                  </a>
                </NextLink>
              </div>
            </CardActions>
          </Card>
        </FeatureFlag>
      )}
      {
        <FeatureFlag flag="feature.explorer.1yearOldBannerEnabled">
          {yearOldOrder && (
            <AssistiveText
              content={getLang('1YearOldBannerText', {
                fallback: 'Orders older than 1 year can not be returned',
              })}
            />
          )}
        </FeatureFlag>
      }
      <FeatureFlag flag="feature.enablePaypalDisputeMessage">
        <div>
          {disputeMessageEnabled && (
            <AssistiveText content="This order has a PayPal dispute and is not eligible for refund or concession" />
          )}
        </div>
      </FeatureFlag>

      {!hasOrderDetails && (
        <div className={classes.detailPanel}>
          <div className={classes.headerPanel}>
            <span className={classes.header}>{`Order Detail #${orderNumber} ${
              replaces?.orderId ? '[Replacement]' : ''
            }`}</span>
            <div className={classes.placedPanel}>
              <span className={classes.placed}>{`Placed: `}</span>
              <span className={classes.placedTime}>{`${getDayDateYearTimeTimezone(
                orderDate,
              )}`}</span>
            </div>
          </div>
          <div className={classes.buttonPanel}>
            <FeatureFlag flag="feature.explorer.enableSystemMessages">
              <Button
                data-testid="system-messaging-dialog-button"
                variant="text"
                className={classes.systemMessagingButton}
                onClick={() => setSystemMessagingDialogOpen(true)}
              >
                {getLang('orderSystemMessagesHeader', { fallback: 'System Messages' })}
              </Button>
            </FeatureFlag>
            <ButtonGroup variant="outlined" sx={{ backgroundColor: 'white' }}>
              {isActionAllowed({ actionName: AllowableActions.FORCE_RELEASE_ORDER }) && (
                <Button
                  data-testid={`order-button-force-release-${orderNumber}`}
                  className={classes.button}
                  disableRipple
                  aria-label="Force Release"
                  onClick={() => {}}
                >
                  <span className={classes.btnTxt}>
                    {getLang('orderForceReleaseHeader', { fallback: 'Force Release' })}
                  </span>
                </Button>
              )}
              {isActionAllowed({ actionName: AllowableActions.ADD_FULFILLMENT_COMMENT }) && (
                <Button
                  data-testid={`order-button-fulfillment-comment-${orderNumber}`}
                  className={classes.button}
                  disableRipple
                  aria-label="Add Fulfillment Comment"
                  onClick={() => {}}
                >
                  <span className={classes.btnTxt}>
                    {getLang('orderAddFulfillmentCommentHeader', {
                      fallback: 'Add Fulfillment Comment',
                    })}
                  </span>
                </Button>
              )}
              {isActionAllowed({ actionName: AllowableActions.ALLOCATE_INVENTORY }) &&
                enableAllocateInventoryBtn && (
                  <Button
                    data-testid={`order-button-allocate-inventory-${orderNumber}`}
                    className={classes.button}
                    disableRipple
                    aria-label="Allocate Inventory"
                    onClick={() => {}}
                  >
                    <span className={classes.btnTxt}>
                      {getLang('orderAllocateInventoryHeader', { fallback: 'Allocate Inventory' })}
                    </span>
                  </Button>
                )}
              {isActionAllowed({ actionName: AllowableActions.BLOCK_ORDER }) && showOrderBlock && (
                <Button
                  data-testid={`order-button-block-${orderNumber}`}
                  className={classes.button}
                  disableRipple
                  aria-label="Block"
                  onClick={() => {
                    setBlockOrderDialogOpen(true);
                  }}
                >
                  <span className={classes.btnTxt}>
                    {getLang('orderBlockHeader', { fallback: 'Block' })}
                  </span>
                </Button>
              )}
              {isActionAllowed({ actionName: AllowableActions.PROCESS_ORDER }) && (
                <Button
                  data-testid={`order-button-process-${orderNumber}`}
                  className={classes.button}
                  disableRipple
                  aria-label="Process"
                  onClick={handleProcessOrder}
                >
                  <span className={classes.btnTxt}>
                    {getLang('orderProcessHeader', { fallback: 'Process' })}
                  </span>
                </Button>
              )}
              {isActionAllowed({ actionName: AllowableActions.CANCEL_ORDER }) && (
                <Button
                  data-testid={`order-button-cancel-${orderNumber}`}
                  className={classes.button}
                  disableRipple
                  aria-label="Cancel"
                  onClick={() => {
                    setCancelOrderDialogOpen(true);
                  }}
                >
                  <span className={classes.btnTxt}>
                    {getLang('orderCancelHeader', { fallback: 'Cancel' })}
                  </span>
                </Button>
              )}
              {oneYearOldFlag && isActionAllowed({ actionName: AllowableActions.RETURN_ITEMS }) && (
                <Button
                  data-testid={`order-RETURN_ITEMS-cancel-${orderNumber}`}
                  className={classes.button}
                  disableRipple
                  aria-label="Return Item(s)"
                  onClick={() => {
                    storePrevRoute({
                      prevRoute: `/customers/${customerId}/orders/${orderNumber}`,
                      prevRouteTag: 'OrderDetails',
                    });
                    router.push(`/customers/${customerId}/workflows/fixIssue-start/${orderNumber}`);
                  }}
                >
                  <span className={classes.btnTxt}>
                    {getLang('orderHeaderItems', { fallback: 'Return Item(s)' })}
                  </span>
                </Button>
              )}
              {(isActionAllowed({
                actionName: AllowableActions.SEND_ORDER_CANCELED_NOTIFICATION,
              }) ||
                isActionAllowed({ actionName: AllowableActions.SEND_ORDER_CONFIRMATION }) ||
                isActionAllowed({ actionName: AllowableActions.SEND_ORDER_INVOICE })) && (
                <Button
                  className={classes.button}
                  data-testid={`order-button-send-email-${orderNumber}`}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleActionsMenuClick}
                  endIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                >
                  <span className={classes.btnTxt}>
                    {getLang('orderSendEmailBtn', { fallback: 'Send Email' })}
                  </span>
                </Button>
              )}
            </ButtonGroup>
            <Menu
              id="order-actions-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleActionsMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              {sendEmailMenuItems
                ?.filter((menuItem) => menuItem?.display)
                ?.map(({ label, action, testId }) => (
                  <MenuItem
                    key={label}
                    data-testid={testId}
                    onClick={() => {
                      handleActionsMenuClose();
                      action();
                    }}
                  >
                    {label}
                  </MenuItem>
                ))}
            </Menu>
          </div>
        </div>
      )}
      {cancelOrderDialogOpen && (
        <CancelOrderDialog
          cancelOrderDialogOpen={cancelOrderDialogOpen}
          orderNumber={orderNumber}
          setParentClose={() => setCancelOrderDialogOpen(false)}
        />
      )}

      {blockOrderDialogOpen && (
        <BlockOrderDialog
          blockOrderDialogOpen={blockOrderDialogOpen}
          orderNumber={orderNumber}
          setParentClose={() => setBlockOrderDialogOpen(false)}
        />
      )}
      {systemMessagingDialogOpen && (
        <SystemMessagingDialog
          open={systemMessagingDialogOpen}
          onClose={() => setSystemMessagingDialogOpen(false)}
          orderComments={orderComments}
          orderNumber={orderNumber}
        />
      )}
    </div>
  );
};

OrderDetailsViewHeader.propTypes = {
  orderNumber: PropTypes.string.isRequired,
  orderDate: PropTypes.string.isRequired,
  replaces: PropTypes.object,
  isActionAllowed: PropTypes.func.isRequired,
  orderComments: PropTypes.arrayOf(PropTypes.object),
  hasOrderDetails: PropTypes.bool,
};

export default OrderDetailsViewHeader;
