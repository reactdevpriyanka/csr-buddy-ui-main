/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useContext, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FeatureFlag from '@/features/FeatureFlag';
import ModalContext, { MODAL } from '@components/ModalContext';
import OrderDetailsViewPackageProducts from './OrderDetailsViewPackageProducts';
import {
  PackageReleaseTypes,
  generateReturnItemKey,
  orderHasItemsSpreadAcrossShipments,
} from './utils';
import PackageHeader from './PackageHeader/PackageHeader';
import ShipmentTrackingBanner from './ShipmentTrackingBanner';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: '30px',
  },
}));

const OrderDetailsViewPackages = ({
  orderNumber,
  itemMap,
  shipments = [],
  releases = [],
  returns = [],
  orderDate,
  status,
  canceledItems = [],
  total,
  isActionAllowed,
  giftCardOnlyEmail,
  shippingAddress,
  returnItems = [],
}) => {
  const classes = useStyles();
  const { modal, setModal } = useContext(ModalContext);
  const orderType = useMemo(() => {
    return ['DEPOSITED', 'SHIPPED'].includes(status)
      ? PackageReleaseTypes.PACKAGE
      : PackageReleaseTypes.RELEASE;
  }, [releases, shipments]);

  return (
    <div data-testid="orderDetailsViewPackagesContainer" className={classes.root}>
      {shipments?.map((currPackage, index) => {
        const lineItems = currPackage?.shipmentItems?.map((item) => {
          const product = itemMap[item.lineItemId];
          return {
            ...product,
            ...item,
          };
        });

        const packageTotal = lineItems.reduce((curVal, item) => {
          return (
            curVal +
            _.toNumber(item?.unitPrice?.value) * _.toNumber(item?.quantity) +
            _.toNumber(item?.totalAdjustment?.value) +
            _.toNumber(item?.shippingTax?.value) +
            _.toNumber(item?.shippingCharge?.value) +
            _.toNumber(item?.salesTax?.value)
          );
        }, 0);

        const shipmentLineItemIds = shipments[index]?.shipmentItems?.map((item) => item.lineItemId);

        const relatedReleases = releases?.find(({ lineItemIds: releaseLineItemIds = [] }) => {
          return shipmentLineItemIds?.some((id) => releaseLineItemIds.includes(id));
        });

        return (
          <div key={currPackage?.id}>
            <div className={classes.productsContainer}>
              <PackageHeader
                headerTitle={`Package ${index + 1} of ${shipments.length}`}
                shipMethod={currPackage?.shippingModeCode}
                orderNumber={orderNumber}
                orderDate={orderDate}
                currPackage={currPackage}
                packageNumber={index + 1}
                numberOfPackages={shipments?.length}
                releases={relatedReleases}
                status={status}
                isRelease={false}
                isCStatusRelease={false}
                giftCardOnlyEmail={giftCardOnlyEmail}
                shippingAddress={shippingAddress}
              />
              <FeatureFlag flag="feature.explorer.trackingPackageContextMessageEnabled">
                <ShipmentTrackingBanner
                  trackingEvent={currPackage?.trackingData?.trackingEvent}
                  onTrackPackage={() => {
                    if (modal !== MODAL.SHIPMENTTRACKER) {
                      setModal(MODAL.SHIPMENTTRACKER, {
                        props: {
                          orderInfo: {
                            ...currPackage.trackingData,
                            ...currPackage,
                            orderNumber,
                            trackingData: currPackage.trackingData,
                            partial: shipments.length > 1,
                            ordinal: index + 1,
                            total: shipments.length,
                            shippingAddress,
                          },
                        },
                      });
                    }
                  }}
                />
              </FeatureFlag>
              <OrderDetailsViewPackageProducts
                currPackage={currPackage}
                orderStatus={status}
                packageNum={index + 1}
                lineItems={lineItems}
                packageTotal={packageTotal}
                numberOfPackages={shipments?.length}
                orderDate={orderDate}
                orderNumber={orderNumber}
                releases={relatedReleases}
                returns={
                  orderHasItemsSpreadAcrossShipments(shipments, currPackage, itemMap)
                    ? returns.filter((returnItem) =>
                        currPackage?.returnTagsToRender?.includes(
                          generateReturnItemKey(returnItem),
                        ),
                      )
                    : returns
                }
                isActionAllowed={isActionAllowed}
                returnItems={
                  orderHasItemsSpreadAcrossShipments(shipments, currPackage, itemMap)
                    ? returnItems.filter((returnItem) =>
                        currPackage?.returnTagsToRender?.includes(
                          generateReturnItemKey(returnItem),
                        ),
                      )
                    : returnItems
                }
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

OrderDetailsViewPackages.propTypes = {
  orderNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  itemMap: PropTypes.object,
  shipments: PropTypes.arrayOf(PropTypes.object),
  releases: PropTypes.arrayOf(PropTypes.object),
  returns: PropTypes.arrayOf(PropTypes.object),
  status: PropTypes.string,
  canceledItems: PropTypes.array,
  orderDate: PropTypes.string,
  total: PropTypes.string,
  isActionAllowed: PropTypes.func,
  shippingAddress: PropTypes.object,
  giftCardOnlyEmail: PropTypes.string,
  returnItems: PropTypes.arrayOf(PropTypes.object),
};

export default OrderDetailsViewPackages;
