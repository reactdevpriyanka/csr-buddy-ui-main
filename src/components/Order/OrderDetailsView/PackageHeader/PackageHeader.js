/* eslint-disable unicorn/prefer-ternary */
import cn from 'classnames';
import { Button, Link, makeStyles } from '@material-ui/core';
import { useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { snakeCaseToTitleCase } from '@/utils/string';
import ModalContext, { MODAL } from '@/components/ModalContext';
import useAgentInteractions from '@/hooks/useAgentInteractions';
import useDeliveryDescriptions from '@/hooks/useDeliveryDescriptions';
import useAthena from '@/hooks/useAthena';
import { FeatureFlag, useFeature } from '@/features';
import ATHENA_KEYS from '@/constants/athena';
import useOrderDetailsContext from '@/hooks/useOrderDetailsContext';
import PackageDetailsDialog from '../Dialogs/PackageDetailsDialog';
import { getDeliveryEstimate, getLegacyDeliveryEstimate } from '../../utils';

const useStyles = makeStyles((theme) => ({
  packageContainer: {
    display: 'grid',
    gridTemplateColumns: '40% 60%',
    borderBottom: '1px solid #CCCCCC',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    ...theme.p.x(15),
    ...theme.p.y(8),
  },
  packageStatus: {
    display: 'flex',
    gap: '3px',
    alignItems: 'baseline',
  },
  leftPanel: {
    display: 'flex',
    columnGap: '5px',
    alignItems: 'center',
  },
  rightPanel: {
    display: 'flex',
    columnGap: '16px',
    alignItems: 'center',
    justifyContent: 'right',
  },
  packagesCount: {
    fontFamily: 'Roboto',
    fontWeight: '600',
    fontSize: '16px',
    lineHeight: '20px',
    color: '#031657',
  },
  label: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '15px',
    color: '#666666',
  },
  text: {
    fontFamily: 'Roboto',
    fontWeight: '450',
    fontSize: '14px',
    lineHeight: '18px',
    color: '#121212',
  },
  packagesFooter: {
    textAlign: 'right',
    marginTop: '5px',
  },
  linkLabel: {
    fontFamily: 'Roboto',
    fontWeight: '600',
    fontSize: '14px',
    lineHeight: '18px',
    color: '#1C49C2',
    textTransform: 'none',
  },
  trackingIdLink: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '18px',
    color: '#1C49C2',
    textTransform: 'none',
    cursor: 'pointer',
  },
  trackPackageButton: {
    fontWeight: 700,
    padding: 0,
  },
  detailsButton: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  },
  redText: {
    color: '#A82245',
  },
  disabled: {
    ...theme.utils.disabled,
  },
}));

const PackageHeader = ({
  headerTitle,
  packageNumber,
  currPackage,
  numberOfPackages,
  releases,
  orderNumber,
  shipMethod,
  status,
  isRelease = false,
  disableDetailsButton = false,
  giftCardOnlyEmail,
  shippingAddress,
}) => {
  const classes = useStyles();
  const { getLang } = useAthena();
  const { setModal } = useContext(ModalContext);
  const [details, setDetails] = useState(false);
  const { captureInteraction } = useAgentInteractions();
  const isCorrectEDDEnabled = useFeature(ATHENA_KEYS.CORRECT_EDD);

  const fulfillmentCenter = currPackage?.fulfillmentCenterDetails?.attributes?.displayName
    ? `${currPackage.fulfillmentCenterDetails?.attributes?.displayName} - `
    : '';

  const onTrackPackage = () => {
    setModal(MODAL.SHIPMENTTRACKER, {
      props: {
        orderInfo: {
          ...currPackage.trackingData,
          ...currPackage,
          orderNumber: orderNumber,
          shippingAddress,
          ordinal: packageNumber,
          total: numberOfPackages,
          trackingId: currPackage.trackingId,
          trackingNumber: currPackage.trackingId,
          fedExLink: currPackage.trackingUrl,
          fulfillmentCenterDetails: currPackage.fulfillmentCenterDetails,
        },
      },
    });

    captureInteraction({
      type: 'TRACKED_PACKAGE',
      subjectId: orderNumber,
      action: 'UPDATE',
      currentVal: {
        trackingId: currPackage?.trackingId || '',
        trackingUrl: currPackage?.trackingUrl || '',
      },
      prevVal: {},
    });
  };

  const deliveryDescriptions = useDeliveryDescriptions();
  const edd = useMemo(
    () =>
      isCorrectEDDEnabled
        ? getDeliveryEstimate(currPackage?.trackingData, deliveryDescriptions)
        : getLegacyDeliveryEstimate(currPackage?.trackingData, deliveryDescriptions),
    [currPackage?.trackingData, isCorrectEDDEnabled],
  );

  const oldRightPanelContents = (
    <>
      <div>
        <span className={classes.label}>{`Ship Method  `}</span>
        <span className={classes.text}>
          {shipMethod ? snakeCaseToTitleCase(shipMethod) : 'N/A'}
        </span>
      </div>

      <div className={classes.packageStatus}>
        <span className={classes.label}>{`Status  `}</span>
        <span className={cn(classes.text, status === 'CANCELED' ? classes.redText : '')}>
          {isRelease && status !== 'Ready to release' && status !== 'CANCELED'
            ? 'Released'
            : snakeCaseToTitleCase(status)}
        </span>

        {currPackage?.trackingId && (
          <div>
            <span className={classes.text}>{`  (TRK# `}</span>
            <Link
              data-testid={`orderDetailsViewPackage:${currPackage.id}:link`}
              onClick={onTrackPackage}
            >
              <span
                data-testid="ordercard:id:viewdetails:link:label"
                className={classes.trackingIdLink}
              >
                {currPackage.trackingId}
              </span>
            </Link>
            <span className={classes.text}>{`)`}</span>
          </div>
        )}
      </div>
    </>
  );

  const { promotions = [] } = useOrderDetailsContext();

  return (
    <>
      <div className={classes.packageContainer}>
        <div className={classes.leftPanel}>
          <span className={classes.packagesCount}>
            {fulfillmentCenter} {headerTitle}
          </span>{' '}
          {numberOfPackages > 0 ? (
            edd ? (
              <div>
                <span className={classes.label}>{edd.deliveryDescription ?? 'Unknown'}</span>{' '}
                <span className={classes.text}>{edd.formattedDeliveryDate}</span>
              </div>
            ) : (
              ''
            )
          ) : null}
        </div>
        <div className={classes.rightPanel}>
          <FeatureFlag
            flag="feature.explorer.trackingPackageContextMessageEnabled"
            fallback={oldRightPanelContents}
          >
            <div>
              <span className={classes.label}>
                {getLang('statusLabel', { fallback: 'Status' })}:
              </span>{' '}
              <span className={cn(classes.text, status === 'CANCELED' && classes.redText)}>
                {isRelease && status !== 'Ready to release' && status !== 'CANCELED'
                  ? getLang('releasedText', { fallback: 'Released' })
                  : snakeCaseToTitleCase(status)}
              </span>
            </div>
            <div>
              <span className={classes.label}>
                {getLang('shipMethodLabel', { fallback: 'Ship Method' })}:
              </span>{' '}
              <span className={classes.text}>
                {shipMethod ? snakeCaseToTitleCase(shipMethod) : 'N/A'}
              </span>
            </div>
            {currPackage?.trackingId && (
              <div>
                <Button className={classes.trackPackageButton} onClick={onTrackPackage}>
                  <span className={classes.linkLabel}>
                    {getLang('trackPackageLabel', { fallback: 'Track Package' })}
                  </span>
                </Button>{' '}
                <span className={classes.text}>#{currPackage.trackingId}</span>
              </div>
            )}
          </FeatureFlag>
          <Button
            className={cn(classes.detailsButton, disableDetailsButton && classes.disabled)}
            disabled={disableDetailsButton}
            data-testid="actionButton-resolve"
            onKeyDown={() => setDetails(true)}
            onClick={() => setDetails(true)}
          >
            <span className={classes.linkLabel}>
              {isRelease
                ? getLang('releaseDetailsLabel', { fallback: 'Release Details' })
                : getLang('packageDetailsLabel', { fallback: 'Package Details' })}
            </span>
          </Button>
        </div>
      </div>
      {details && (
        <PackageDetailsDialog
          openDialog={setDetails}
          open={details}
          shipment={currPackage}
          release={releases}
          orderNumber={orderNumber}
          packageNumber={packageNumber}
          numberOfPackages={isRelease ? releases.length : numberOfPackages}
          type={isRelease ? 'Release' : 'Package'}
          giftCardOnlyEmail={giftCardOnlyEmail}
          shippingAddress={shippingAddress}
          disableAdjustments={promotions?.length === 0}
          promotions={promotions}
        />
      )}
    </>
  );
};

PackageHeader.propTypes = {
  packageNumber: PropTypes.number,
  currPackage: PropTypes.object,
  numberOfPackages: PropTypes.number,
  releases: PropTypes.object,
  orderNumber: PropTypes.string,
  status: PropTypes.string,
  isRelease: PropTypes.bool,
  headerTitle: PropTypes.string,
  shipMethod: PropTypes.string,
  disableDetailsButton: PropTypes.bool,
  shippingAddress: PropTypes.object,
  giftCardOnlyEmail: PropTypes.string,
};

export default PackageHeader;
