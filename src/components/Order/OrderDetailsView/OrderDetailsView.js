import PropTypes from 'prop-types';
import _ from 'lodash';
import NextLink from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from '@material-ui/core';
import useAllowableActions from '@/hooks/useAllowableActions';
import * as blueTriangle from '@utils/blueTriangle';
import { OrderStatus } from '@/constants/OrderStatus';
import useOrderGraphql from '@/hooks/useOrderGraphql';
import OrderDetailsContext from '@/components/Order/OrderDetailsView/OrderDetailsContext';
import FeatureFlag from '@/features/FeatureFlag';
import ATHENA_KEYS from '@/constants/athena';
import useAthena from '@/hooks/useAthena';
import BreadCrumbNavBar from '@/components/BreadCrumbs/BreadCrumbNavBar';
import useFeature from '@/features/useFeature';
import OrderDetailsViewPackages from './OrderDetailsViewPackages';
import OrderDetailsViewReturns from './OrderDetailsViewReturns';
import OrderDetailsViewPayment from './OrderDetailsViewPayment';
import OrderDetailsViewProperties from './OrderDetailsViewProperties';
import OrderDetailsViewBlocks from './OrderDetailsViewBlocks';
import OrderDetailsViewHeader from './OrderDetailsViewHeader';
import OrderDetailsViewReleases from './OrderDetailsViewReleases';
import OrderDetailsViewSummary from './OrderDetailsViewSummary';
import PackageHeader from './PackageHeader/PackageHeader';
import OrderDetailsViewPackageProducts from './OrderDetailsViewPackageProducts';
import OrderDetailsViewBlocksDetails from './OrderDetailsViewBlocksDetails';
import { assignReturnsToShipments } from './utils';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: '8rem',
  },
  header: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontStyle: 'bold',
    fontSize: '20px',
    lineHeight: '25px',
    color: '#031657',
  },
  viewBreadcrumbs: {
    display: 'flex',
    marginLeft: '16px',
  },
  viewDetailsBreadcrumbs: {
    fontFamily: 'Roboto',
    fontWeight: '600',
    fontStyle: 'Regular',
    fontSize: '11px',
    lineHeight: '16px',
    letterSpacing: '0.25px',
    color: '#031657',
    display: 'block',
    marginTop: '20px',
    marginBottom: '10px',

    '&:focus, &:hover': {
      cursor: 'pointer',
    },
  },
  viewDetailsBreadcrumbsOrder: {
    fontFamily: 'Roboto',
    fontWeight: '600',
    fontStyle: 'Regular',
    fontSize: '11px',
    lineHeight: '16px',
    letterSpacing: '0.25px',
    color: '#031657',
    display: 'block',
    marginTop: '20px',
    marginBottom: '10px',
    marginLeft: '3px',
  },
}));

const OrderDetailsView = ({
  orderNumber,
  itemMap,
  orderDate,
  orderDetails,
  revalidateOrderDetails,
  status,
  total,
  shipments = [],
  releases = [],
  notReleasedLineItems,
  releasesNotShippedItems = [],
  submitter,
  remoteIp,
  comment,
  businessChannel,
  submitterDetail,
  timeUpdated,
  returns = [],
  shippingAddress,
  subscriptionInfos = [],
  blocks = [],
  lineItems = [],
  replaces,
  timePlaced,
  orderComments,
  returnItems = [],
}) => {
  const classes = useStyles();

  const router = useRouter();

  const { getLang } = useAthena();

  const { id: customerId } = router.query;

  const breadcrumb = useMemo(() => {
    return {
      id: 'OrderDetails',
      title: `Order #${orderNumber}`,
      link: `/customers/${customerId}/orders/${orderNumber}`,
    };
  }, [orderNumber, customerId]);

  const { isActionAllowed } = useAllowableActions(orderNumber);

  const [componentInitialized, setComponentInitialized] = useState(false);

  const dynamicBreadcrumbProviderEnabled = useFeature(
    'feature.explorer.dynamicBreadcrumbProviderEnabled',
  );

  const readyToReleaseAthenaString = getLang(ATHENA_KEYS.READY_TO_RELEASE, {
    fallback: 'Ready to Release',
  });

  const pageName = 'Order Details View - VT';

  useEffect(() => assignReturnsToShipments(shipments, returnItems, itemMap), [
    shipments,
    returnItems,
    itemMap,
  ]);

  useEffect(() => {
    // do component load work
    setComponentInitialized(true);
    blueTriangle.start(pageName);
  }, []);

  useEffect(() => {
    if (componentInitialized) {
      // do component unload
      blueTriangle.end(pageName);
    }
  }, [componentInitialized]);

  const { data: orderDetailsGraphql, mutate: revalidateOrderDetailsGraphql } = useOrderGraphql(
    orderNumber,
  );

  const packageCount = useMemo(() => {
    return shipments ? shipments.length : 0;
  }, [shipments]);

  const isReadyToRelease = ![
    OrderStatus.RELEASED,
    OrderStatus.SHIPPED,
    OrderStatus.DEPOSITED,
  ].includes(status);

  const showReleases = useMemo(() => {
    return !_.isEmpty(releasesNotShippedItems) || isReadyToRelease;
  }, [releasesNotShippedItems, isReadyToRelease]);

  const showBlocks = useMemo(() => {
    return blocks.filter((block) => !block.resolved).length > 0;
  }, [blocks]);

  const parentOrderId = useMemo(() => {
    if (!subscriptionInfos || subscriptionInfos?.length === 0) {
      return 'N/A';
    }

    return subscriptionInfos?.[0]?.subscriptionId ?? 'N/A';
  }, [subscriptionInfos]);

  const giftCardOnlyEmail = useMemo(() => {
    const giftCardCount = lineItems.reduce((preVal, item) => {
      return item?.product?.attributes?.includes('GIFT_CARD') ? ++preVal : preVal;
    }, 0);

    if (giftCardCount === lineItems.length) {
      return lineItems[0]?.product?.personalizationAttributeMap?.RecipientEmail;
    }

    return null;
  }, [lineItems]);

  const updatedNotReleasedLineItems = useMemo(() => {
    const updatedLineItems = orderDetailsGraphql?.byOrderId?.lineItems;

    return notReleasedLineItems?.map((lineItem) => {
      const updatedLineItem = updatedLineItems?.find((li) => li.legacyId === lineItem.id);
      return updatedLineItem ? { ...lineItem, quantity: updatedLineItem.quantity } : lineItem;
    });
  }, [orderDetailsGraphql]);

  return (
    <OrderDetailsContext.Provider
      value={{
        ...orderDetails,
        itemMap,
        revalidateOrderDetailsGraphql,
        revalidateOrderDetails,
      }}
    >
      <div data-testid="orderDetailsViewContainer" className={classes.root}>
        {!dynamicBreadcrumbProviderEnabled ? (
          <div className={classes.viewBreadcrumbs}>
            <NextLink href={`/customers/${customerId}/activity`}>
              <Link data-testid="ordercard:id:viewdetails:link">
                <span
                  data-testid="ordercard:id:viewdetails:link:label"
                  className={classes.viewDetailsBreadcrumbs}
                >
                  {`ACTIVITY FEED`}
                </span>
              </Link>
            </NextLink>
            <span className={classes.viewDetailsBreadcrumbsOrder}>{`/ ORDER #${orderNumber}`}</span>
          </div>
        ) : (
          <div data-testid="orderDynamicBreadcrumb">
            <BreadCrumbNavBar breadcrumb={breadcrumb} />
          </div>
        )}
        {showBlocks && <OrderDetailsViewBlocks blocks={blocks} />}

        <OrderDetailsViewHeader
          orderNumber={orderNumber}
          orderDate={orderDate}
          replaces={replaces}
          isActionAllowed={isActionAllowed}
          orderComments={orderComments}
        />

        <OrderDetailsViewSummary
          orderNumber={orderNumber}
          status={status}
          timeUpdated={timeUpdated}
          orderTotal={total?.value}
          totalItems={lineItems?.length ? lineItems.length : 0}
          packageCount={packageCount}
          parentOrderId={parentOrderId}
        />

        {updatedNotReleasedLineItems && (
          <div>
            <PackageHeader
              headerTitle={status === 'CANCELED' ? status : readyToReleaseAthenaString}
              orderNumber={orderNumber}
              orderDate={timePlaced}
              orderStatus={status}
              numberOfPackages={releases.length}
              isRelease={true}
              disableDetailsButton={true}
              status={status === 'CANCELED' ? status : readyToReleaseAthenaString}
              giftCardOnlyEmail={giftCardOnlyEmail}
              shippingAddress={shippingAddress}
            />
            <OrderDetailsViewPackageProducts
              lineItems={updatedNotReleasedLineItems}
              numberOfPackages={updatedNotReleasedLineItems.length}
              orderDate={orderDate}
              orderNumber={orderNumber}
              orderStatus={status}
              isActionAllowed={isActionAllowed}
              isRelease={true}
              packageTotal={updatedNotReleasedLineItems?.reduce((total, item) => {
                return (total += Number.parseFloat(item?.totalProduct?.value ?? 0));
              }, 0)}
              giftCardOnlyEmail={giftCardOnlyEmail}
              shippingAddress={shippingAddress}
            />
          </div>
        )}

        {showReleases && (
          <OrderDetailsViewReleases
            orderNumber={orderNumber}
            status={status}
            itemMap={itemMap}
            shipments={shipments}
            releases={releasesNotShippedItems}
            canceledReleases={releases?.filter((release) => release.status === 'CANCELED')}
            returns={returns}
            orderDate={orderDate}
            isActionAllowed={isActionAllowed}
            isReadyToRelease={isReadyToRelease}
            giftCardOnlyEmail={giftCardOnlyEmail}
            shippingAddress={shippingAddress}
          />
        )}

        <OrderDetailsViewPackages
          orderNumber={orderNumber}
          status={status}
          itemMap={itemMap}
          shipments={shipments}
          releases={releases}
          returns={returns}
          orderDate={orderDate}
          isActionAllowed={isActionAllowed}
          giftCardOnlyEmail={giftCardOnlyEmail}
          shippingAddress={shippingAddress}
          returnItems={returnItems}
        />

        <OrderDetailsViewPayment
          orderNumber={orderNumber}
          shippingAddress={shippingAddress}
          giftCardOnlyEmail={giftCardOnlyEmail}
          isActionAllowed={isActionAllowed}
        />
        <OrderDetailsViewReturns returns={returns} itemMap={itemMap} />
        <FeatureFlag flag="feature.explorer.orderViewBlockHistoryEnabled">
          <OrderDetailsViewBlocksDetails orderNumber={orderNumber} blocks={blocks} />
        </FeatureFlag>

        <OrderDetailsViewProperties
          submitter={submitter}
          channel={businessChannel}
          remoteIp={remoteIp}
          comment={comment}
          submitterDetail={submitterDetail}
        />
      </div>
    </OrderDetailsContext.Provider>
  );
};

OrderDetailsView.propTypes = {
  orderNumber: PropTypes.string,
  orderDate: PropTypes.string,
  total: PropTypes.object,
  submitter: PropTypes.string,
  remoteIp: PropTypes.string,
  businessChannel: PropTypes.string,
  submitterDetail: PropTypes.object,
  comment: PropTypes.string,
  itemMap: PropTypes.object,
  status: PropTypes.string,
  blocks: PropTypes.arrayOf(PropTypes.object),
  shipments: PropTypes.arrayOf(PropTypes.object),
  releases: PropTypes.arrayOf(PropTypes.object),
  releasesNotShippedItems: PropTypes.arrayOf(PropTypes.object),
  timeUpdated: PropTypes.string,
  returns: PropTypes.arrayOf(PropTypes.object),
  shippingAddress: PropTypes.object,
  subscriptionInfos: PropTypes.arrayOf(PropTypes.object),
  lineItems: PropTypes.arrayOf(PropTypes.object),
  replaces: PropTypes.object,
  notReleasedLineItems: PropTypes.arrayOf(PropTypes.object),
  timePlaced: PropTypes.string,
  orderDetails: PropTypes.object,
  revalidateOrderDetails: PropTypes.func,
  orderComments: PropTypes.arrayOf(PropTypes.object),
  returnItems: PropTypes.arrayOf(PropTypes.object),
};

export default OrderDetailsView;
