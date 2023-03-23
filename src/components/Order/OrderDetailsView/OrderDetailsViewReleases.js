/* eslint-disable unicorn/prefer-set-has */
/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import useOrderDetailsContext from '@/hooks/useOrderDetailsContext';
import OrderDetailsViewPackageProducts from './OrderDetailsViewPackageProducts';
import { PackageReleaseTypes } from './utils';
import PackageHeader from './PackageHeader/PackageHeader';

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const OrderDetailsViewReleases = ({
  orderNumber,
  itemMap,
  shipments = [],
  releases = [],
  canceledReleases,
  returns = [],
  orderDate,
  status,
  canceledItems = [],
  total,
  isActionAllowed,
  isReadyToRelease = false,
  giftCardOnlyEmail,
  shippingAddress,
}) => {
  const classes = useStyles();

  const { notReleasedLineItems } = useOrderDetailsContext();

  const releaseCount = _.sumBy(
    releases.filter((release) => release.status !== 'CANCELED'),
    (item) => item.lineItemIds.length,
  );

  const isCStatusRelease = _.isEmpty(releases) && isReadyToRelease;

  return (
    <div data-testid="orderDetailsViewReleasesContainer" className={classes.root}>
      {canceledReleases?.map((release, index) => (
        <PackageHeader
          headerTitle="Release Canceled"
          key={release.id}
          orderNumber={orderNumber}
          orderDate={orderDate}
          orderStatus={release.status}
          currPackage={release}
          packageNumber={index + 1}
          numberOfPackages={releases.length}
          releases={release}
          status={release.status}
          isRelease={true}
          giftCardOnlyEmail={giftCardOnlyEmail}
          shippingAddress={shippingAddress}
        />
      ))}
      {releases?.map((currRelease, index) => {
        if (_.isEmpty(currRelease)) {
          return null;
        }

        const lineItems =
          currRelease?.status === 'CANCELED'
            ? []
            : currRelease?.lineItemIds?.map((lineItemId) => {
                const product = itemMap[lineItemId];
                return {
                  ...product,
                };
              });

        const releaseTotal = lineItems.reduce((curVal, item) => {
          return (
            curVal +
            _.toNumber(item?.totalProduct?.value) +
            _.toNumber(item?.totalAdjustment?.value) +
            _.toNumber(item?.shippingTax?.value) +
            _.toNumber(item?.shippingCharge?.value) +
            _.toNumber(item?.salesTax?.value)
          );
        }, 0);

        return (
          <div key={currRelease.id}>
            <div className={classes.productsContainer}>
              <PackageHeader
                headerTitle={`${currRelease.fulfillmentCenter} - Release ${index + 1} of ${
                  releases.length
                }`}
                shipMethod={currRelease?.shippingModeCode}
                orderNumber={orderNumber}
                orderDate={orderDate}
                orderStatus={status}
                currPackage={currRelease}
                packageNumber={index + 1}
                numberOfPackages={releases.length}
                releases={currRelease}
                status={currRelease.status}
                isRelease={true}
                isCStatusRelease={isCStatusRelease}
                giftCardOnlyEmail={giftCardOnlyEmail}
                shippingAddress={shippingAddress}
              />
              <OrderDetailsViewPackageProducts
                currPackage={currRelease}
                packageNum={index + 1}
                lineItems={lineItems}
                packageTotal={releaseTotal}
                numberOfPackages={releases.length}
                orderDate={orderDate}
                orderNumber={orderNumber}
                orderStatus={status}
                releases={currRelease}
                returns={returns}
                isActionAllowed={isActionAllowed}
                isRelease={true}
                isCStatusRelease={isCStatusRelease}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

OrderDetailsViewReleases.propTypes = {
  orderNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  itemMap: PropTypes.object,
  shipments: PropTypes.arrayOf(PropTypes.object),
  releases: PropTypes.arrayOf(PropTypes.object),
  canceledReleases: PropTypes.arrayOf(PropTypes.object),
  returns: PropTypes.arrayOf(PropTypes.object),
  status: PropTypes.string,
  canceledItems: PropTypes.array,
  orderDate: PropTypes.string,
  total: PropTypes.string,
  isActionAllowed: PropTypes.func,
  isReadyToRelease: PropTypes.bool,
  shippingAddress: PropTypes.object,
  giftCardOnlyEmail: PropTypes.string,
};

export default OrderDetailsViewReleases;
