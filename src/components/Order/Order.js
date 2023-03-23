/* eslint-disable jsx-a11y/anchor-is-valid */
import PropTypes from 'prop-types';
import cn from 'classnames';
import NextLink from 'next/link';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import { makeStyles } from '@material-ui/core/styles';
import { formatDate } from '@utils/dates';
import { FeatureFlag } from '@/features';
import ShippingFlow from '@components/ShipmentFlow';
import {
  ActivityHeader,
  Card,
  SplitContent,
  GridContent,
  Product,
  ProfileInfo,
} from '@components/Card';
import ProductError from '@components/ProductError';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { blocks as blockReasonMap } from '@/models/orders';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { v4 as uuidv4 } from 'uuid';
import { useSnackbar } from 'notistack';
import ModalContext, { MODAL } from '@components/ModalContext';
import useFeature from '@/features/useFeature';
import useAgentInteractions from '@/hooks/useAgentInteractions';
import useAllowableActions from '@/hooks/useAllowableActions';
import useDeliveryDescriptions from '@/hooks/useDeliveryDescriptions';
import { useSWRConfig } from 'swr';
import useSendEmail from '@/hooks/useSendEmail';
import useAthena from '@/hooks/useAthena';
import AssistiveText from '@/components/AssistiveText/AssistiveText';
import QuestionMarkIcon from '@icons/question-mark.svg';
import ATHENA_KEYS from '@/constants/athena';
import useOrder from '@/hooks/useOrder';
import TooltipPrimary from '../TooltipPrimary';
import SplitButton from '../Button/SplitButton';
import ShipmentDetails from '../ShipmentDetails';
import { SNACKVARIANTS } from '../SnackMessage/SnackMessage';
import NewShippingFlow from '../ShipmentFlow/NewShippingFlow';
import NavigationContext from '../NavigationContext';
import Notification from './Notification';
import AutoshipContent from './AutoshipContent';
import CancelOrderDialog from './CancelOrderDialog';
import OrderActionsButton from './OrderActionsButton';
import OrderDetailsViewHeader from './OrderDetailsView/OrderDetailsViewHeader';
import {
  itemGroupingHeader,
  getDeliveryEstimate,
  getLegacyDeliveryEstimate,
  getDeliveredDeliveryEstimate,
  ORDER_ATTRIBUTE,
} from './utils';
import {
  AllowableActions,
  assignReturnsToShipments,
  generateReturnItemKey,
  orderHasItemsSpreadAcrossShipments,
} from './OrderDetailsView/utils';

const useStyles = makeStyles((theme) => ({
  actionWrap: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: `${theme.utils.fromPx(8)}`,
  },
  shipmentHeader: {
    fontSize: '1rem',
    marginTop: '0',
    marginBottom: '0.25rem',
  },
  shipmentSubHeader: {
    ...theme.utils.nospace,
    color: theme.palette.gray.light,
    ...theme.fonts.h4,
  },
  shipmentBlock: {
    padding: `${theme.spacing(1)} 0 ${theme.spacing(1.5)} 0`,
  },
  shipmentBlockBorder: {
    borderTop: '1px solid #ddd',
  },
  autoshipSection: {
    alignSelf: 'center',
    marginRight: theme.utils.fromPx(5),
    marginLeft: theme.utils.fromPx(5),
  },
  autoshipLabelIcon: {
    display: 'inline-block',
    height: theme.utils.fromPx(40),
    lineHeight: 2,
  },
  iconButton: {
    padding: '0',
  },
  edd: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '14px',
    lineHeight: '18px',
  },
  questionMarkIcon: {
    display: 'inline-block',
  },
  btnViewDetails: {
    textDecoration: 'none',
    color: theme.palette.primary.main,
    '&:focus, &:hover': {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  },
  reduceBodyPadding: {
    padding: `0 ${theme.utils.fromPx(24)}`,
  },
}));

const Order = ({
  status,
  blocks,
  orderNumber,
  orderDate,
  total,
  shipments = [],
  notShippedItems = [],
  releasesNotShippedItems = [],
  canceledItems = [],
  updatedItems = [],
  notifications = [],
  id,
  itemMap,
  trackingData,
  timeUpdated,
  detailsLink,
  orderAttributes = [],
  paymentDetails,
  returnItems = [],
  shippingAddress,
  subscriptionInfos = [],
  cancelReason,
  onClick,
  releases = [],
  totalAdjustment,
  totalBeforeTax,
  totalProduct,
  totalSalesTax,
  totalShippingTax,
  lineItems = [],
  returns = [],
  replaces,
}) => {
  const classes = useStyles();

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const { getLang } = useAthena();

  const newManageOrderEnabled =
    useFeature('feature.explorer.updatedManageOrderButtonEnabled') || false;

  const { toggleOrderBlocked: toggleOrderBlockedRequest } = useOrder();

  const { sendOrderEmail } = useSendEmail();

  const [cancelOrderDialogOpen, setCancelOrderDialogOpen] = useState(false);

  const [showPaymentAndShippingDetails, setshowPaymentAndShippingDetails] = useState(false);

  const [currentShipmentAddress, setShipmentAddress] = useState(shippingAddress);

  const { isActionAllowed } = useAllowableActions(id);

  const { mutate } = useSWRConfig();

  const isTrackingPackageContextMessageEnabled = getLang(
    ATHENA_KEYS.TRACKING_PACKAGE_CONTEXT_MESSAGING_ENABLED,
    { fallback: false },
  );

  const isCorrectEDDEnabled = useFeature(ATHENA_KEYS.CORRECT_EDD);
  const deliveryDescriptions = useDeliveryDescriptions();

  useEffect(() => assignReturnsToShipments(shipments, returnItems), [shipments, returnItems]);

  const customerId = router?.query?.id;

  const parentOrderId = useMemo(() => {
    if (!subscriptionInfos || subscriptionInfos?.length === 0) {
      return null;
    }

    return subscriptionInfos[0].parentOrderId;
  }, [subscriptionInfos]);

  const { setModal } = useContext(ModalContext);

  const { captureInteraction } = useAgentInteractions();

  const blockedForEdit = useMemo(() => {
    return blocks && blocks?.find((block) => block?.comments === 'Order Blocked For Edit');
  }, [blocks]);

  // TODO: inline this or extract it into a separate component
  const orderTitle = useMemo(
    () => (
      <NextLink href={`/customers/${router.query.id}/orders/${orderNumber}`}>
        <a
          className={classes.btnViewDetails}
          data-testid={`ordercard:id:viewdetails:link:${orderNumber}`}
        >
          {`Order #${orderNumber}`}
        </a>
      </NextLink>
    ),
    [orderNumber],
  );

  // TODO inline this or extract it into a separate component
  const detailsActionLink = useMemo(
    () => (
      <NextLink href={`/customers/${router.query.id}/orders/${orderNumber}`}>
        <a
          data-testid="order-block:details-link"
          data-testkey={`order-block-${orderNumber}:details-link`}
        >
          See Details
        </a>
      </NextLink>
    ),
    [orderNumber],
  );

  const orderSubTitle = `Order Placed  ${formatDate(orderDate)}`;
  const { storePrevRoute } = useContext(NavigationContext);

  const toOrderWorkflow = () => {
    if (Number.parseInt(total) === 0) {
      enqueueSnackbar({
        messageSubheader: 'To Fix Issue use the original order',
        variant: SNACKVARIANTS.info,
      });
    } else if (shipments.length === 0 && !['SHIPPED', 'DEPOSITED'].includes(status)) {
      //validate if none of the items are shipped
      enqueueSnackbar({
        messageSubheader: 'Unable to Fix Issue. Item(s) status is not shipped',
        variant: SNACKVARIANTS.info,
      });
    } else {
      storePrevRoute({
        prevRoute: `/customers/${customerId}/activity`,
        prevRouteTag: 'ActivityFeed',
      });
      router.push(`/customers/${customerId}/workflows/fixIssue-start/${orderNumber}`);
    }
  };

  /* To be utilized in future manage order stories */
  // eslint-disable-next-line no-unused-vars
  const toggleOrderBlocked = async () => {
    try {
      const statusToSend = blockedForEdit ? 'end' : 'begin';

      if (statusToSend === 'end') {
        setshowPaymentAndShippingDetails(false);
      }

      toggleOrderBlockedRequest({
        status: statusToSend,
        id: orderNumber,
      }).then(() => {
        mutate(`/api/v3/order-activities/${orderNumber}`);
      });
    } catch {
      enqueueSnackbar({
        messageHeader: 'Error',
        messageSubheader: 'Unable to update order status',
        variant: SNACKVARIANTS.ERROR,
      });
    }
  };

  const notificationType = {
    ORDER_CREATED: 'ORDER_CREATED',
    ORDER_INVOICE: 'ORDER_INVOICE',
  };

  const fixIssueMenuItems = [
    {
      label: 'Send Order Confirmation',
      action: () => sendEmail(notificationType.ORDER_CREATED),
      display: true,
      disabled: false,
    },
    {
      label: 'Send Order Invoice',
      action: () => sendEmail(notificationType.ORDER_INVOICE),
      display: true,
      disabled: false,
    },
  ];

  const editShippingAddress = () => {
    setshowPaymentAndShippingDetails(true);
  };

  const oneYearOldFlag = useFeature('feature.explorer.1yearOldBannerEnabled')
    ? differenceInCalendarDays(new Date(), new Date(orderDate)) < 365
    : true;

  const shouldDisableOrderButton = () => {
    return oneYearOldFlag ? !isActionAllowed({ actionName: AllowableActions.RETURN_ITEMS }) : true;
  };

  const manageOrderMenuItems = [
    {
      label: 'Edit Shipping Address',
      action: editShippingAddress,
      display: orderAttributes.includes(ORDER_ATTRIBUTE.ADDRESS_UPDATABLE),
      disabled: false,
    },
    {
      label: 'Start Edit',
      action: toggleOrderBlocked,
      display: !blockedForEdit,
      disabled: false,
    },
    {
      label: 'End Edit',
      action: toggleOrderBlocked,
      display: blockedForEdit,
      disabled: false,
    },
    {
      label: 'Cancel Order',
      action: () => {
        setCancelOrderDialogOpen(true);
      },
      display: orderAttributes.includes(ORDER_ATTRIBUTE.CANCELLABLE),
      disabled: false,
    },
  ];

  const newManageOrderMenuItems = [
    {
      label: 'Edit Shipping Address',
      action: editShippingAddress,
      display: isActionAllowed({ actionName: AllowableActions.EDIT_SHIPPING_ADDRESS }),
      disabled: false,
      testId: `new-manage-order-edit-shipping-address:${id}`,
    },
    {
      label: 'Return Items',
      action: () => toOrderWorkflow(),
      display: !shouldDisableOrderButton(),
      disabled: false,
      testId: `new-manage-order-return-items:${id}`,
    },
    {
      label: 'Send Order Invoice',
      action: () => sendEmail(notificationType.ORDER_INVOICE),
      display: true,
      disabled: false,
      testId: `new-manage-order-send-invoice:${id}`,
    },
    {
      label: 'Send Order Confirmation',
      action: () => sendEmail(notificationType.ORDER_CREATED),
      display: true,
      disabled: false,
      testId: `new-manage-order-send-order-confirmation:${id}`,
    },
    {
      label: 'Cancel Order',
      action: () => {
        setCancelOrderDialogOpen(true);
      },
      display: orderAttributes.includes(ORDER_ATTRIBUTE.CANCELLABLE) && status !== 'CANCELED',
      disabled: false,
      testId: `new-manage-order-cancel-order:${id}`,
    },
  ];

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

  const orderAction = (
    <div className={classes.actionWrap}>
      {newManageOrderEnabled ? (
        <OrderActionsButton menuItems={newManageOrderMenuItems} orderNumber={orderNumber} />
      ) : shouldDisableOrderButton() ? (
        <SplitButton
          label="Manage Order"
          menuItems={manageOrderMenuItems}
          menuIcon={<ArrowDropDownIcon />}
        />
      ) : (
        <SplitButton
          label="Fix Issue"
          action={toOrderWorkflow}
          disabled={false}
          menuItems={fixIssueMenuItems}
          menuIcon={<ArrowDropDownIcon />}
        />
      )}
      {cancelOrderDialogOpen && (
        <CancelOrderDialog
          cancelOrderDialogOpen={cancelOrderDialogOpen}
          orderNumber={orderNumber}
          setParentClose={() => setCancelOrderDialogOpen(false)}
        />
      )}
    </div>
  );

  const header = (
    <ActivityHeader
      title={orderTitle}
      subtitle={orderSubTitle}
      action={orderAction}
      showActionIcon={false}
      status={status}
      orderNumber={orderNumber}
      orderTotal={total?.value}
      titleSection={
        parentOrderId && (
          <AutoshipContent
            classes={classes}
            isAutoship={orderAttributes.includes('AUTOSHIP')}
            parentOrderId={parentOrderId}
          />
        )
      }
    />
  );

  const isItemCanceled = (lineItemId) =>
    canceledItems && canceledItems?.some((item) => item.lineItemId === lineItemId);

  const itemUpdateMap = {
    PHARMA_CANCELED: 'Canceled by pharmacy on',
    QUANTITY: 'quantity updated on',
  };

  // TODO extract into a separate component
  const generateNotification = ({ lineItemId, type, date, amount, quantity }) => {
    switch (type) {
      case 'CONCESSION':
        return (
          <>
            <strong>${amount} Concession applied to order.</strong> <span>{formatDate(date)}</span>
          </>
        );
      case 'REPLACEMENT':
        return (
          <>
            <strong>
              Replacement created for {itemMap[lineItemId].product.name}. (Quantity: {quantity})
            </strong>{' '}
            <span>{formatDate(date)}</span>
          </>
        );
      case 'REFUND':
        return (
          <>
            <strong>
              Refund created for {itemMap[lineItemId].product.name}. (Quantity: {quantity})
            </strong>{' '}
            <span>{formatDate(date)}</span>
          </>
        );
      default:
        return null;
    }
  };

  const yearOldOrder = useMemo(
    () => differenceInCalendarDays(new Date(), new Date(orderDate)) > 365,
    [orderDate],
  );

  const orderNotifications = (
    <>
      {replaces && (
        <FeatureFlag flag="feature.explorer.replacementLinkEnabled">
          <OrderDetailsViewHeader
            orderNumber={orderNumber}
            replaces={replaces}
            isActionAllowed={isActionAllowed}
            hasOrderDetails={true}
          />
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
      {(notifications || []).length > 0 && status !== 'CANCELED' && (
        <div data-testid="order:notifications">
          <Notification orderNumber={orderNumber} type="NOTIFICATION" title="Issue Reported">
            <ul>
              {notifications?.map((notification, index) => {
                return (
                  <li key={`${notification.lineItemId}-${index}`}>
                    {generateNotification(notification)}
                  </li>
                );
              })}
            </ul>
          </Notification>
        </div>
      )}
      {(updatedItems || []).length > 0 && status !== 'CANCELED' && (
        <div data-testid="order:updated-items">
          <Notification orderNumber={orderNumber} type="UPDATE" title="Order Items Updated">
            <ul>
              {updatedItems?.map((item, index) => {
                return (
                  <li key={`${item.lineItemId}-${index}`}>
                    <strong>{item.oldDescription}</strong> <span>{itemUpdateMap[item.reason]}</span>{' '}
                    <span>{formatDate(item.timeUpdated)}</span>
                  </li>
                );
              })}
            </ul>
          </Notification>
        </div>
      )}
      {status === 'CANCELED' && (
        <Notification
          className={classes.notification}
          orderNumber={orderNumber}
          type="CANCELATION"
          title={cancelReason ? `Order was canceled due to: ${cancelReason}` : `Order Canceled`}
          action={formatDate(timeUpdated)}
        />
      )}
    </>
  );

  const orderBlocks = (
    <div data-testid="order:blocks">
      {(blocks || []).length > 0 &&
        [...blocks]
          .sort((a, b) => new Date(b.timeBlocked) - new Date(a.timeBlocked))
          .map((block) => (
            <div key={block.id}>
              <Notification
                className={classes.notification}
                orderNumber={orderNumber}
                type={block.resolved === true ? 'RESOLVE' : 'BLOCK'}
                title={`Order Block ${block.resolved === true ? 'Resolved' : ''} - ${
                  blockReasonMap[block.reason]
                }`}
                action={detailsActionLink}
              >
                <>
                  <span>Blocked on {formatDate(block.timeBlocked)}</span>{' '}
                  {block.resolved && block.timeResolved && (
                    <>
                      <span> | </span>
                      <span>Resolved on {formatDate(block.timeResolved)}</span>
                    </>
                  )}
                </>
              </Notification>
            </div>
          ))}
    </div>
  );

  // TODO extract into a separate component
  const Header = useCallback(
    (tracking, partial, ordinal, total, released = true) => {
      let deliveryDate;

      if (tracking?.trackingEvent?.code === 'DELIVERED') {
        const deliveryDateObj = getDeliveredDeliveryEstimate(tracking, deliveryDescriptions);

        deliveryDate = (
          <span className={classes.edd}>
            {deliveryDateObj
              ? `${deliveryDateObj?.deliveryDescription} ${deliveryDateObj?.formattedDeliveryDate}`
              : 'Unknown'}
          </span>
        );
      } else {
        const edd = isCorrectEDDEnabled
          ? getDeliveryEstimate(tracking, deliveryDescriptions)
          : getLegacyDeliveryEstimate(tracking, deliveryDescriptions);

        deliveryDate = (
          <span className={classes.edd}>
            {edd ? `${edd?.deliveryDescription} ${edd?.formattedDeliveryDate}` : 'Unknown'}
          </span>
        );
      }

      return (
        status !== 'CANCELED' && (
          <header className={classes.header}>
            {released && (
              <h2 data-testid="shipment:ordinal" className={classes.shipmentHeader}>
                {itemGroupingHeader(tracking?.shippingStep, partial, ordinal, total)}
              </h2>
            )}
            <h3 data-testid="delivery:estimate" className={classes.shipmentSubHeader}>
              {total > 0 ? (
                deliveryDate
              ) : (
                <TooltipPrimary
                  arrow
                  title={getLang('pendingShipmentText', {
                    fallback:
                      'Estimated delivery date will be provided when the item ships. Most orders arrive within 1-3 days. Pharmacy orders ship in 3-5 days after approval. Frozen and dropship orders can take longer, and delivery times vary.',
                  })}
                  placement="bottom"
                >
                  <span className={classes.edd}>
                    {getLang('pendingShipmentLabel', { fallback: 'Pending Shipment' })}
                  </span>{' '}
                  <QuestionMarkIcon className={classes.questionMarkIcon} />
                </TooltipPrimary>
              )}
            </h3>
          </header>
        )
      );
    },
    [getLang, status, classes],
  );

  const onTrackPackage = useCallback(
    (trackingData, shipment, orderNumber, partial, ordinal, total) => {
      setModal(MODAL.SHIPMENTTRACKER, {
        props: {
          orderInfo: {
            ...trackingData,
            ...shipment,
            orderNumber,
            trackingData,
            partial,
            ordinal,
            total,
            shippingAddress: currentShipmentAddress,
          },
        },
      });
      captureInteraction({
        type: 'TRACKED_PACKAGE',
        subjectId: orderNumber,
        action: 'UPDATE',
        currentVal: {
          trackingId: shipment.trackingId || '',
          trackingUrl: shipment.trackingUrl || '',
        },
        prevVal: {},
      });
    },
    [setModal, captureInteraction],
  );

  // TODO extract into a separate component
  const getTracking = (shipment, partial, ordinal, total, title, released = true) => {
    return (
      <>
        <FeatureFlag flag="feature.explorer.orderPaymentDetailEnabled">
          <ProfileInfo header="Payment">{paymentDetails}</ProfileInfo>
        </FeatureFlag>
        {isTrackingPackageContextMessageEnabled ? (
          <NewShippingFlow
            title={title}
            status={status}
            released={released}
            fulfillmentCenterCode={shipment?.fulfillmentCenterDetails?.id}
            ordinal={ordinal}
            total={total}
            shipment={shipment}
            shipper={shipment?.shippingModeCode}
            step={shipment?.trackingData?.shippingStep}
            trackingData={shipment?.trackingData}
            statusText={shipment?.trackingData?.shippingStatus}
            orderCanceled={status === 'CANCELED'}
            onTrackPackage={() =>
              onTrackPackage(shipment?.trackingData, shipment, orderNumber, partial, ordinal, total)
            }
          />
        ) : (
          <ShippingFlow
            header={Header(trackingData, partial, ordinal, total, released)} // EDD/NEDD message
            shipper={shipment?.shippingModeCode}
            step={trackingData?.shippingStep}
            statusText={trackingData?.shippingStatus}
            orderCanceled={status === 'CANCELED'}
            parentOrderId={parentOrderId}
            onTrackPackage={() =>
              onTrackPackage(trackingData, shipment, orderNumber, partial, ordinal, total)
            }
          >
            {trackingData?.trackingEvent && trackingData?.trackingEvent.address && (
              <div>
                <span>
                  {[
                    trackingData?.trackingEvent.address.city,
                    trackingData?.trackingEvent.address.state,
                  ]
                    .filter((v) => v)
                    .join(', ')}
                </span>
              </div>
            )}
          </ShippingFlow>
        )}
      </>
    );
  };

  // TODO extract into a separate component
  const orderShipments = () => {
    const getProducts = (shipment, returnItems) => {
      let products = shipment?.shipmentItems
        ?.map((item) => {
          const mappedItem = itemMap[item.lineItemId];
          if (!mappedItem) {
            return null;
          }

          return {
            ...mappedItem,
            totalProduct: { value: `${mappedItem?.unitPrice?.value * item?.quantity}` },
            quantity: item?.quantity,
          };
        })
        ?.filter((item) => item?.id && item?.quantity && item?.unitPrice && item?.product);

      return (
        <GridContent>
          {products?.length === 0 ? (
            <div>{'This shipment has items but they could not be retrieved from the system.'}</div>
          ) : (
            products?.map(
              ({
                id,
                lineItemAttributes,
                externalId,
                quantity,
                unitPrice,
                product,
                vetContactInfo,
                tags,
                totalProduct,
                maxDeliveryDate,
                minDeliveryDate,
                appointmentInfo,
              }) => (
                <Product
                  key={id}
                  title={product.name}
                  id={id}
                  orderNumber={orderNumber}
                  partNumber={product?.partNumber}
                  catalogEntryId={product.catalogEntryId}
                  lineItems={lineItems}
                  lineItemAttributes={lineItemAttributes}
                  externalId={externalId}
                  price={Number(totalProduct.value).toFixed(2)}
                  quantity={quantity.toString()}
                  thumbnail={product.thumbnail}
                  canceled={isItemCanceled(id)}
                  returns={
                    orderHasItemsSpreadAcrossShipments(shipments, shipment, itemMap)
                      ? returnItems
                          .filter((ri) => ri.lineItemId === id)
                          .filter((ri) =>
                            shipment?.returnTagsToRender?.includes(generateReturnItemKey(ri)),
                          )
                      : returnItems.filter((ri) => ri.lineItemId === id)
                  }
                  tags={tags}
                  vetContactInfo={vetContactInfo}
                  attributes={product?.attributes}
                  personalizationAttributes={product?.personalizationAttributeMap}
                  discontinueDate={product?.discontinueDate}
                  maxDeliveryDate={maxDeliveryDate}
                  minDeliveryDate={minDeliveryDate}
                  appointmentInfo={appointmentInfo}
                />
              ),
            )
          )}
        </GridContent>
      );
    };

    return (
      shipments &&
      shipments?.map((shipment, i) => (
        <div
          key={i}
          className={cn(i !== 0 && classes.shipmentBlockBorder, classes.shipmentBlock)}
          data-testid={`order:shipment-${shipment.id}`}
        >
          <SplitContent
            content={<>{getProducts(shipment, returnItems)}</>}
            actions={getTracking(
              shipment,
              shipments.length > 1,
              i + 1,
              shipments.length,
              'Package',
            )}
          />
        </div>
      ))
    );
  };

  // TODO extract into a separate component
  const orderAwaitingShipments = () => {
    const dummyTrackingData = {
      shippingStep: 'PACKING_ITEMS',
      shippingStatus: 'ON_TIME',
      estimatedDeliveryDate: trackingData?.estimatedDeliveryDate,
      progressPercentage: 0,
      packagesCountFromOrder: 1,
      derivedDeliveryDateStatus: 'UNKNOWN',
    };

    const getProducts = (items) => {
      let products = items
        ?.map((item) => {
          const mappedItem = itemMap[item.lineItemId];
          if (!mappedItem) {
            return null;
          }
          return {
            ...mappedItem,
            totalProduct: { value: `${mappedItem?.unitPrice?.value * item?.quantity}` },
            quantity: item?.quantity,
          };
        })
        ?.filter((item) => item?.id && item?.quantity && item?.product);

      return (
        <div data-testid="order:awaiting-shipment">
          <GridContent>
            {products?.length === 0 ? (
              <div>{'Unable to retrieve item details from the system'}</div>
            ) : (
              products?.map(
                ({
                  id,
                  lineItemAttributes,
                  externalId,
                  quantity,
                  unitPrice,
                  product,
                  tags,
                  vetContactInfo,
                  totalProduct,
                  maxDeliveryDate,
                  minDeliveryDate,
                  appointmentInfo,
                }) =>
                  product ? (
                    <Product
                      key={id}
                      id={id}
                      orderNumber={orderNumber}
                      catalogEntryId={product.catalogEntryId}
                      lineItemAttributes={lineItemAttributes}
                      externalId={externalId}
                      partNumber={product?.partNumber}
                      title={product.name}
                      lineItems={lineItems}
                      price={Number(totalProduct.value).toFixed(2)}
                      quantity={quantity.toString()}
                      thumbnail={product.thumbnail}
                      canceled={isItemCanceled(id)}
                      returns={product.returnItems}
                      tags={tags}
                      vetContactInfo={vetContactInfo}
                      attributes={product?.attributes}
                      personalizationAttributes={product?.personalizationAttributeMap}
                      discontinueDate={product?.discontinueDate}
                      maxDeliveryDate={maxDeliveryDate}
                      minDeliveryDate={minDeliveryDate}
                      appointmentInfo={appointmentInfo}
                    />
                  ) : (
                    <ProductError id={id} />
                  ),
              )
            )}
          </GridContent>
        </div>
      );
    };

    return (
      releasesNotShippedItems.length === 0 &&
      notShippedItems.length > 0 && (
        <div
          className={cn(shipments.length > 0 && classes.shipmentBlockBorder, classes.shipmentBlock)}
        >
          <SplitContent
            content={<>{getProducts(notShippedItems)}</>}
            actions={
              showPaymentAndShippingDetails ? (
                <ShipmentDetails
                  orderNumber={orderNumber}
                  currentShipment={currentShipmentAddress}
                  editable={false}
                  setShipmentAddress={setShipmentAddress}
                />
              ) : (
                getTracking(
                  { trackingData: dummyTrackingData, shippingModeCode: 'UNKNOWN' },
                  false,
                  0,
                  0,
                  false,
                  '',
                )
              )
            }
          />
        </div>
      )
    );
  };

  const orderReleaseNotShipments = () => {
    const getProducts = (items) => {
      let products = items?.lineItemIds
        ?.map((item) => {
          const mappedItem = itemMap[item];
          if (!mappedItem) {
            return null;
          }
          return {
            ...mappedItem,
            totalProduct: { value: `${mappedItem?.unitPrice?.value * mappedItem?.quantity}` },
            quantity: mappedItem?.quantity,
          };
        })
        ?.filter((item) => item?.id && item?.quantity && item?.product);

      return (
        <div data-testid="order:awaiting-shipment">
          <GridContent>
            {products?.length === 0 ? (
              <div>{'Unable to retrieve item details from the system'}</div>
            ) : (
              products?.map(
                ({
                  id,
                  lineItemAttributes,
                  externalId,
                  quantity,
                  unitPrice,
                  product,
                  tags,
                  vetContactInfo,
                  totalProduct,
                  maxDeliveryDate,
                  minDeliveryDate,
                  appointmentInfo,
                }) =>
                  product ? (
                    <Product
                      key={id}
                      id={id}
                      orderNumber={orderNumber}
                      catalogEntryId={product.catalogEntryId}
                      lineItemAttributes={lineItemAttributes}
                      externalId={externalId}
                      partNumber={product?.partNumber}
                      title={product.name}
                      lineItems={lineItems}
                      price={Number(totalProduct.value).toFixed(2)}
                      quantity={quantity.toString()}
                      thumbnail={product.thumbnail}
                      canceled={isItemCanceled(id)}
                      returns={product.returnItems}
                      tags={tags}
                      vetContactInfo={vetContactInfo}
                      attributes={product?.attributes}
                      personalizationAttributes={product?.personalizationAttributeMap}
                      discontinueDate={product?.discontinueDate}
                      maxDeliveryDate={maxDeliveryDate}
                      minDeliveryDate={minDeliveryDate}
                      appointmentInfo={appointmentInfo}
                    />
                  ) : (
                    <ProductError id={id} />
                  ),
              )
            )}
          </GridContent>
        </div>
      );
    };
    return releasesNotShippedItems?.map((shipment, i) => (
      <div
        key={i}
        className={cn(i !== 0 && classes.shipmentBlockBorder, classes.shipmentBlock)}
        data-testid={`order:shipment-${shipment.id}`}
      >
        <SplitContent
          content={<>{getProducts(shipment)}</>}
          actions={getTracking(
            {
              id: shipment.id,
              shippingModeCode: shipment.shippingModeCode,
              trackingData: { shippingStep: 'PACKING_ITEMS', shippingStatus: 'UNKNOWN' },
              fulfillmentCenterDetails: { id: shipment.fulfillmentCenter },
            },
            releasesNotShippedItems.length > 1,
            i + 1,
            releasesNotShippedItems.length,
            'Release',
          )}
        />
      </div>
    ));
  };

  // TODO extract into a separate component
  const orderCancelledItems = () => {
    const getProducts = (items) => {
      let products = items
        ?.map((item) => {
          const mappedItem = itemMap[item.lineItemId];
          if (!mappedItem) {
            return null;
          }
          return {
            ...mappedItem,
            totalProduct: { value: `${mappedItem?.unitPrice?.value * item?.quantity}` },
            quantity: item?.quantity,
          };
        })
        ?.filter((item) => item?.id && item?.quantity && item?.product);

      return (
        <GridContent>
          {products?.length === 0 ? (
            <div>{'Unable to retrieve item details from the system'}</div>
          ) : (
            products?.map(
              ({
                id,
                lineItemAttributes,
                externalId,
                quantity,
                unitPrice,
                product,
                tags,
                vetContactInfo,
                totalProduct,
                maxDeliveryDate,
                minDeliveryDate,
                appointmentInfo,
              }) =>
                product ? (
                  <Product
                    key={id}
                    id={id}
                    orderNumber={orderNumber}
                    catalogEntryId={product.catalogEntryId}
                    lineItemAttributes={lineItemAttributes}
                    externalId={externalId}
                    partNumber={product?.partNumber}
                    lineItems={lineItems}
                    title={product.name}
                    price={Number(totalProduct.value).toFixed(2)}
                    quantity={quantity.toString()}
                    thumbnail={product.thumbnail}
                    canceled={isItemCanceled(id)}
                    returns={product.returnItems}
                    tags={tags}
                    vetContactInfo={vetContactInfo}
                    attributes={product?.attributes}
                    personalizationAttributes={product?.personalizationAttributeMap}
                    discontinueDate={product?.discontinueDate}
                    maxDeliveryDate={maxDeliveryDate}
                    minDeliveryDate={minDeliveryDate}
                    appointmentInfo={appointmentInfo}
                  />
                ) : (
                  <ProductError id={id} />
                ),
            )
          )}
        </GridContent>
      );
    };

    return (
      canceledItems.length > 0 && (
        <div
          data-testid="order:canceled-items"
          className={cn(shipments.length > 0 && classes.shipmentBlockBorder, classes.shipmentBlock)}
        >
          <SplitContent
            content={<>{getProducts(canceledItems)}</>}
            actions={
              showPaymentAndShippingDetails ? (
                <ShipmentDetails
                  orderNumber={orderNumber}
                  currentShipment={currentShipmentAddress}
                  editable={false}
                  setShipmentAddress={setShipmentAddress}
                />
              ) : (
                <FeatureFlag flag="feature.explorer.orderPaymentDetailEnabled">
                  <ProfileInfo header="Payment">{paymentDetails}</ProfileInfo>
                </FeatureFlag>
              )
            }
          />
        </div>
      )
    );
  };

  return (
    <Card
      classBody={classes.reduceBodyPadding}
      header={header}
      id={`OrderCard_${id}`}
      disabledCard={false}
    >
      {orderNotifications}
      {orderBlocks}
      {orderShipments()}
      {orderAwaitingShipments()}
      {orderCancelledItems()}
      {orderReleaseNotShipments()}
    </Card>
  );
};

Order.propTypes = {
  orderNumber: PropTypes.string.isRequired,
  orderDate: PropTypes.string.isRequired,
  total: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  itemMap: PropTypes.object.isRequired,
  status: PropTypes.string,
  blocks: PropTypes.arrayOf(PropTypes.object),
  shipments: PropTypes.arrayOf(PropTypes.object),
  notShippedItems: PropTypes.arrayOf(PropTypes.object),
  releasesNotShippedItems: PropTypes.arrayOf(PropTypes.object),
  canceledItems: PropTypes.arrayOf(PropTypes.object),
  updatedItems: PropTypes.arrayOf(PropTypes.object),
  notifications: PropTypes.arrayOf(PropTypes.object),
  trackingData: PropTypes.object,
  timeUpdated: PropTypes.string,
  detailsLink: PropTypes.string,
  orderAttributes: PropTypes.arrayOf(PropTypes.string),
  paymentDetails: PropTypes.node,
  returnItems: PropTypes.arrayOf(PropTypes.object),
  shippingAddress: PropTypes.object,
  subscriptionInfos: PropTypes.arrayOf(PropTypes.object),
  cancelReason: PropTypes.string,
  onClick: PropTypes.func,
  releases: PropTypes.arrayOf(PropTypes.object),
  totalAdjustment: PropTypes.object,
  totalBeforeTax: PropTypes.object,
  totalProduct: PropTypes.object,
  totalSalesTax: PropTypes.object,
  totalShippingTax: PropTypes.object,
  lineItems: PropTypes.arrayOf(PropTypes.object),
  returns: PropTypes.arrayOf(PropTypes.object),
  replaces: PropTypes.object,
};

export default Order;
