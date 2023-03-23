import { makeStyles } from '@material-ui/core';
import {
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
} from '@mui/material';
import PropTypes from 'prop-types';
import CloseIcon from '@icons/close.svg';
import toFormattedPhoneNumber from '@/utils/formatters';
import { snakeCaseToTitleCase, currencyFormatter } from '@/utils/string';
import * as blueTriangle from '@utils/blueTriangle';
import { formatDateWithTime, getDayDateYearTimeTimezone } from '@/utils';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import useOrderDetailsContext from '@/hooks/useOrderDetailsContext';
import { useEffect, useState } from 'react';
import { SlideUpTransition } from '@/utils/transitions';
import { useSnackbar } from 'notistack';
import { SNACKVARIANTS } from '@/components/SnackMessage/SnackMessage';
import useAgentInteractions from '@/hooks/useAgentInteractions';
import useCancelRelease from '@/hooks/useCancelRelease';
import useAthena from '@/hooks/useAthena';
import { useFeature } from '@/features';
import ATHENA_KEYS from '@/constants/athena';
import ContextualMessageAlert from '../../Notification/ContextualMessageAlert';
import OrderAdjustmentDetails from '../OrderAdjustmentDetails';

const useStyles = makeStyles((theme) => ({
  root: {},
  title: {
    color: theme.palette.primary.main,
    fontSize: theme.utils.fromPx(20),
    fontWeight: 600,
  },
  titleContainer: {
    backgroundColor: 'rgba(145, 145, 145, 0.2)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: `${theme.utils.fromPx(8)} !important`,
    paddingLeft: `${theme.utils.fromPx(16)} !important`,
    maxHeight: `${theme.utils.fromPx(58)} !important`,
  },
  columnHeader: {
    color: theme.palette.primary.main,
    fontSize: theme.utils.fromPx(16),
    paddingBottom: theme.utils.fromPx(12),
    fontWeight: 600,
  },
  lightValueHeader: {
    fontSize: theme.utils.fromPx(12),
    color: theme.palette.gray.light,
    paddingBottom: theme.utils.fromPx(6),
  },
  value: {
    paddingBottom: theme.utils.fromPx(12),
    fontSize: theme.utils.fromPx(14),
    overflowWrap: 'break-word',
  },
  mediumValueHeader: {
    fontSize: theme.utils.fromPx(14),
    color: theme.palette.gray.light,
    fontWeight: 700,
  },
  mediumValue: {
    fontSize: theme.utils.fromPx(14),
    color: theme.palette.gray.light,
    fontWeight: 400,
    paddingBottom: theme.utils.fromPx(12),
  },
  packageTotalContainer: {
    backgroundColor: '#F9F9F9',
    borderRadius: theme.utils.fromPx(4),
    padding: `${theme.utils.fromPx(10)} !important`,
  },
  packageTotalsHeader: {
    fontSize: theme.utils.fromPx(14),
    color: theme.palette.gray.light,
    fontWeight: 500,
  },
  packageTotalsValue: {
    fontSize: theme.utils.fromPx(16),
    fontWeight: 700,
    float: 'right',
  },
  packageTotalsRow: {
    '&:not(:last-child)': {
      paddingBottom: theme.utils.fromPx(13),
    },
  },
  dialogContent: {
    padding: `${theme.utils.fromPx(12)} ${theme.utils.fromPx(16)} ${theme.utils.fromPx(
      16,
    )} !important`,
  },
  contentGrid: {
    paddingTop: theme.utils.fromPx(2),
    marginBottom: theme.utils.fromPx(12),
  },
  releaseCard: {
    backgroundColor: theme.palette.grey[50],
    padding: theme.utils.fromPx(16),
    borderRadius: theme.utils.fromPx(4),
    '&:not(:last-child)': {
      marginBottom: theme.utils.fromPx(12),
    },
  },
  releaseId: {
    color: theme.palette.primary.main,
    fontSize: theme.utils.fromPx(16),
    fontWeight: 700,
  },
  badge: {
    backgroundColor: '#FFC80C',
    float: 'right',
    fontWeight: 700,
    fontSize: theme.utils.fromPx(14),
    borderRadius: theme.utils.fromPx(4),
    padding: `0px ${theme.utils.fromPx(16)}`,
    maxHeight: theme.utils.fromPx(24),
    alignSelf: 'center',
  },
  closeIcon: {
    float: 'right',
    marginLeft: `${theme.utils.fromPx(18)} !important`,
  },
  titleActions: {
    display: 'flex',
  },
  divider: {
    marginBottom: `${theme.utils.fromPx(13)} !important`,
  },
  noPackageTotalsMessage: {
    padding: theme.utils.fromPx(10),
    backgroundColor: '#DBEBF9 !important',
    color: `${theme.palette.blue.chewyBrand} !important`,
    borderRadius: `${theme.utils.fromPx(8)}`,
  },
  adjustmentName: {
    color: '#031657',
    fontWeight: '700',
    paddingBottom: theme.utils.fromPx(13),
  },
  valueContainer: {
    '& .MuiAccordionSummary-root': {
      '& #valueContainer': {
        fontWeight: '700',
      },
    },
  },
}));

const PackageDetailsDialog = ({
  open,
  openDialog,
  shipment,
  release,
  packageNumber,
  numberOfPackages,
  type,
  shippingAddress,
  giftCardOnlyEmail,
  expand = false,
  disableAdjustments = false,
  promotions = [],
}) => {
  const classes = useStyles();

  const {
    totalProduct,
    totalSalesTax,
    totalAdjustment,
    totalShipping,
    totalBeforeTax,
    total,
    itemMap,
    id: orderNumber,
    timePlaced: orderDate,
    releases: allReleases,
    shipments: allShipments,
    revalidateOrderDetails,
  } = useOrderDetailsContext();

  const { getLang } = useAthena();

  const { enqueueSnackbar } = useSnackbar();

  const { cancelRelease } = useCancelRelease();

  const { captureInteraction } = useAgentInteractions();

  const [isDialogOpen, setIsDialogOpen] = useState(open);

  const [cancelReleaseInFlight, setCancelReleaseInFlight] = useState(false);

  const isCorrectEDDEnabled = useFeature(ATHENA_KEYS.CORRECT_EDD);

  const contextualMessagingEnabled = useFeature(
    ATHENA_KEYS.TRACKING_PACKAGE_CONTEXT_MESSAGING_ENABLED,
  );

  const pageName = 'Package Details Dialog - VT';

  useEffect(() => {
    blueTriangle.start(pageName);

    return () => {
      blueTriangle.end(pageName);
    };
  }, []);

  const handleClose = () => {
    setIsDialogOpen(false);
    setTimeout(() => {
      openDialog(false);
    }, 300);
  };

  const handleCancelRelease = () => {
    setCancelReleaseInFlight(true);
    cancelRelease(orderNumber, release.id)
      .then(() =>
        captureInteraction({
          type: 'CANCELLED_RELEASE',
          subjectId: orderNumber,
          action: 'UPDATE',
          currentVal: { releaseId: release?.id },
          prevVal: {},
        }),
      )
      .then(() => {
        enqueueSnackbar({
          messageHeader: 'Success',
          variant: SNACKVARIANTS.SUCCESS,
          messageSubheader: `Cancelled release #${release.id}`,
          persist: false,
        });
      })
      .catch(() => {
        enqueueSnackbar({
          messageHeader: 'Error',
          variant: SNACKVARIANTS.ERROR,
          messageSubheader: `Failed to cancel release #${release.id}`,
          persist: false,
        });
      })
      .finally(() => {
        setCancelReleaseInFlight(false);
        revalidateOrderDetails();
      });
  };

  return (
    <Dialog
      data-testid={`package-details-${packageNumber}`}
      id={`package-details-${packageNumber}`}
      fullWidth
      maxWidth="md"
      open={isDialogOpen}
      keepMounted
      onClose={handleClose}
      TransitionComponent={SlideUpTransition}
      dialogTitleClasses={classes.titleClasses}
      contentClassName={classes.dialogContent}
    >
      <DialogTitle className={classes.titleContainer}>
        <span className={classes.title}>
          {shipment?.fulfillmentCenterDetails?.id && (
            <span>{shipment.fulfillmentCenterDetails.id} - </span>
          )}
          {type} Details
          {numberOfPackages >= 1
            ? ` (${packageNumber} of ${allShipments?.length})`
            : type === 'Release'
            ? ` (${packageNumber} of ${allReleases?.length})`
            : null}
        </span>
        <span className={classes.titleActions}>
          <IconButton
            classes={{ root: classes.closeIcon }}
            aria-label="close"
            onClick={handleClose}
            data-testid="package-details-close-button"
          >
            <CloseIcon />
          </IconButton>
        </span>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        {type === 'Release' &&
          release?.status !== 'CANCELED' &&
          release?.attributes?.includes('CANCELLABLE') && (
            <Button
              sx={{
                float: 'right',
                color: '#1C49C2',
                border: '1px solid #1C49C2',
                textTransform: 'none',
                minWidth: '135px',
              }}
              onClick={handleCancelRelease}
              variant="outlined"
              disabled={cancelReleaseInFlight}
            >
              {cancelReleaseInFlight ? (
                <CircularProgress
                  size={24}
                  sx={{ float: 'right', color: '#1C49C2' }}
                  color="primary"
                />
              ) : (
                <span>Cancel Release</span>
              )}
            </Button>
          )}

        {shipment && (
          <>
            {contextualMessagingEnabled && shipment?.trackingData?.trackingEvent && (
              <ContextualMessageAlert trackingEvent={shipment?.trackingData?.trackingEvent} />
            )}
            <Grid container spacing={1} className={classes.contentGrid}>
              <Grid item xs={4}>
                <div className={classes.columnHeader}>{type} Details</div>
                {release?.status === 'CANCELED' || shipment?.status === 'CANCELED' ? (
                  <div>N/A</div>
                ) : (
                  <>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <div className={classes.lightValueHeader}>Order #</div>
                        <div className={classes.value}>{orderNumber ?? 'Unknown'}</div>
                        <div className={classes.lightValueHeader}>Fufillment Center</div>
                        <div className={classes.value}>
                          {(shipment?.fulfillmentCenter ||
                            shipment?.fulfillmentCenterDetails?.attributes?.displayName) ??
                            'Unknown'}
                        </div>
                        <div className={classes.lightValueHeader}>Ship Method</div>
                        <div className={classes.value}>
                          {shipment?.shippingModeCode ?? 'Unknown'}
                        </div>
                        <div className={classes.lightValueHeader}>Dimensions</div>
                        <div className={classes.value}>N/A</div>
                      </Grid>
                      <Grid item xs={6}>
                        <div className={classes.lightValueHeader}>Total # of Items</div>
                        <div className={classes.value}>
                          {shipment?.shipmentItems?.length ?? 'Unknown'}
                        </div>
                        <div className={classes.lightValueHeader}>Fufilment Center Type</div>
                        <div className={classes.value}>
                          {snakeCaseToTitleCase(
                            (shipment?.fulfillmentCenterType ||
                              shipment?.fulfillmentCenterDetails?.attributes
                                ?.fulfillmentCenterType) ??
                              'Unknown',
                          )}
                        </div>
                        <div className={classes.lightValueHeader}>Tracking Number</div>
                        <div className={classes.value}>
                          {!shipment?.trackingId && <div>-</div>}
                          <a target="_blank" href={shipment?.trackingUrl} rel="noreferrer">
                            {shipment?.trackingId}
                          </a>
                        </div>
                        <div className={classes.lightValueHeader}>Weight</div>
                        <div className={classes.value}>N/A</div>
                      </Grid>
                    </Grid>
                    <div className={classes.lightValueHeader}>Recipient</div>
                    <div className={classes.value}>
                      {giftCardOnlyEmail ? giftCardOnlyEmail : shippingAddress?.fullName}
                    </div>
                    <div className={classes.lightValueHeader}>Shipping Address</div>
                    {!giftCardOnlyEmail && shippingAddress ? (
                      <div className={classes.value}>
                        {shippingAddress.addressLine1}
                        <br />
                        {shippingAddress.addressLine2}
                        {shippingAddress.addressLine2 && <br />}
                        {shippingAddress.city}, {shippingAddress.state}, {shippingAddress.postcode},{' '}
                        {shippingAddress.country}
                        <br />
                        {'P: '}
                        {toFormattedPhoneNumber(shippingAddress.phone)}
                        <br />
                      </div>
                    ) : (
                      <div className={classes.value}>-</div>
                    )}
                  </>
                )}
              </Grid>

              <Grid item xs={4}>
                <div className={classes.columnHeader}>Date Details</div>
                {release?.status === 'CANCELED' || shipment?.status === 'CANCELED' ? (
                  <div>N/A</div>
                ) : (
                  <>
                    <div className={classes.lightValueHeader}>Order Date</div>
                    <div className={classes.value}>
                      {getDayDateYearTimeTimezone(orderDate) ?? 'Unknown'}
                    </div>
                    <div className={classes.lightValueHeader}>FC Acknowledgement</div>
                    <div className={classes.value}>
                      {release.fulfillmentAck
                        ? getDayDateYearTimeTimezone(release.fulfillmentAck)
                        : 'N/A'}
                    </div>
                    <div className={classes.lightValueHeader}>Customer Notification</div>
                    <div className={classes.value}>
                      {release.customerConfirm
                        ? getDayDateYearTimeTimezone(release.customerConfirm)
                        : 'N/A'}
                    </div>
                    <div className={classes.lightValueHeader}>Payment Capture</div>
                    <div className={classes.value}>
                      {release.captureDate
                        ? getDayDateYearTimeTimezone(release.captureDate)
                        : 'N/A'}
                    </div>
                    <div className={classes.lightValueHeader}>Ship Date</div>
                    <div className={classes.value}>
                      {getDayDateYearTimeTimezone(shipment?.timeShipped) ?? 'Unknown'}
                    </div>
                    {isCorrectEDDEnabled ? null : (
                      <>
                        <div className={classes.lightValueHeader}>
                          {getLang('promisedDeliveryDateText', {
                            fallback: 'Promised Delivery Date',
                          })}
                        </div>
                        {!shipment?.trackingData?.chewyPromisedDeliveryDate && <div>-</div>}
                        <div className={classes.value}>
                          {getDayDateYearTimeTimezone(
                            shipment?.trackingData?.chewyPromisedDeliveryDate,
                          )}
                        </div>
                      </>
                    )}
                    <div className={classes.lightValueHeader}>
                      {getLang('actualDeliveryDateText', {
                        fallback: 'Actual Delivery Date',
                      })}
                    </div>
                    <div className={classes.value}>
                      {!shipment?.trackingData?.actualDeliveryTime && <div>-</div>}
                      {getDayDateYearTimeTimezone(shipment?.trackingData?.actualDeliveryTime) ??
                        'Unknown'}
                    </div>
                  </>
                )}
              </Grid>
              <Grid item xs={4}>
                <div className={classes.packageTotalContainer}>
                  <div className={classes.columnHeader}>{type} Totals</div>
                  {type === 'Package' && (
                    <div>
                      {numberOfPackages === 1 ? (
                        <div data-testid={`package-breakdown-${packageNumber}`}>
                          <div className={classes.packageTotalsRow}>
                            <span className={classes.packageTotalsHeader}>Package Subtotal:</span>
                            <span className={classes.packageTotalsValue}>
                              ${totalProduct.value}
                            </span>
                          </div>
                          <div className={classes.adjustmentName}>
                            <OrderAdjustmentDetails
                              expand={expand}
                              disableAdjustments={promotions?.length === 0}
                              promotions={promotions}
                              adjustmentTotal={currencyFormatter(totalAdjustment?.value)}
                              className={classes.valueContainer}
                            />
                          </div>
                          <div className={classes.packageTotalsRow}>
                            <span className={classes.packageTotalsHeader}>Shipping:</span>
                            <span className={classes.packageTotalsValue}>
                              ${totalShipping.value}
                            </span>
                          </div>
                          <div className={classes.packageTotalsRow}>
                            <span className={classes.packageTotalsHeader}>Total Before Tax:</span>
                            <span className={classes.packageTotalsValue}>
                              ${totalBeforeTax.value}
                            </span>
                          </div>
                          <div className={classes.packageTotalsRow}>
                            <span className={classes.packageTotalsHeader}>Sales Tax</span>
                            <span className={classes.packageTotalsValue}>
                              ${totalSalesTax.value}
                            </span>
                          </div>
                          <Divider classes={{ root: classes.divider }} />
                          <div className={classes.packageTotalsRow}>
                            <span className={classes.packageTotalsHeader}>{type} Totals:</span>
                            <span className={classes.packageTotalsValue}>${total.value}</span>
                          </div>
                        </div>
                      ) : (
                        <Card className={classes.noPackageTotalsMessage} elevation={0}>
                          <span>
                            <Grid container>
                              <Grid xs="auto" item sx={{ pr: 1 }}>
                                <InfoOutlinedIcon sx={{ color: '#1C49C2' }} />
                              </Grid>
                              <Grid xs item>
                                Multiple packages in this release; no payment per package totals
                                available.
                              </Grid>
                            </Grid>
                          </span>
                        </Card>
                      )}
                    </div>
                  )}
                  {type === 'Release' && <div>N/A</div>}
                </div>
              </Grid>
            </Grid>
          </>
        )}
        {release && (
          <div key={release.id} className={classes.releaseCard}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <span className={classes.releaseId}>Release ID #{release?.id}</span>
                <span className={classes.badge}>
                  {snakeCaseToTitleCase(release?.status ?? 'Unknown')}
                </span>
              </Grid>
              <Grid item xs={3}>
                <div className={classes.lightValueHeader}>Date Created</div>
                <div className={classes.value}>
                  {formatDateWithTime(release?.timeCreated) ?? 'Unknown'}
                </div>
              </Grid>
              <Grid item xs={3}>
                <div className={classes.lightValueHeader}>Release Seq #</div>
                <div className={classes.value}>{release?.releaseNumber ?? 'Unknown'}</div>
              </Grid>
              <Grid item xs={3}>
                <div className={classes.lightValueHeader}>Qty / Items</div>
                <div className={classes.value}>
                  {/* {shipment?.shipmentItems.map(({ partNumber, quantity }) => (
                    <div key={partNumber}>
                      {quantity} - {partNumber}
                    </div>
                  ))} */}
                  {release?.lineItemIds?.map((lineItemId) => (
                    <div key={itemMap[lineItemId]?.product?.partNumber}>
                      {itemMap[lineItemId]?.quantity} - {itemMap[lineItemId]?.product?.partNumber}
                    </div>
                  ))}
                </div>
              </Grid>
              <Grid item xs={3}>
                <div className={classes.lightValueHeader}>Updated</div>
                <div className={classes.value}>
                  {formatDateWithTime(release?.timeUpdated) ?? 'Unknown'}
                </div>
              </Grid>
            </Grid>
          </div>
        )}
        {shipment && (
          <div className={classes.releaseCard}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <span className={classes.releaseId}>
                  Manifest {type === 'Package' && <span>ID #{shipment?.id}</span>}
                </span>
                {type === 'Package' ? (
                  <span className={classes.badge}>
                    {snakeCaseToTitleCase(release?.status) ?? 'Unknown'}
                  </span>
                ) : (
                  <span className={classes.releaseId}> --- N/A</span>
                )}
              </Grid>
              {type === 'Package' && (
                <>
                  <Grid item xs={3}>
                    <div className={classes.lightValueHeader}>Date Shipped</div>
                    <div className={classes.value}>
                      {formatDateWithTime(shipment?.timeShipped) ?? 'Unknown'}
                    </div>
                  </Grid>
                  <Grid item xs={3}>
                    <div className={classes.lightValueHeader}>Ship Mode</div>
                    <div className={classes.value}>{shipment?.shippingModeCode ?? 'Unknown'}</div>
                  </Grid>
                  <Grid item xs={3}>
                    <div className={classes.lightValueHeader}>Tracking #</div>
                    <div className={classes.value}>{shipment?.trackingId ?? 'Unknown'}</div>
                  </Grid>
                  <Grid item xs={3}>
                    <div className={classes.lightValueHeader}>Updated</div>
                    <div className={classes.value}>
                      {formatDateWithTime(release?.timeUpdated) ?? 'Unknown'}
                    </div>
                  </Grid>
                </>
              )}
            </Grid>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

PackageDetailsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  openDialog: PropTypes.func.isRequired,
  shipment: PropTypes.object,
  release: PropTypes.object,
  packageNumber: PropTypes.number,
  type: PropTypes.string,
  numberOfPackages: PropTypes.number,
  shippingAddress: PropTypes.object,
  giftCardOnlyEmail: PropTypes.string,
  expand: PropTypes.bool,
  disableAdjustments: PropTypes.bool,
  promotions: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string,
      promotion: PropTypes.string,
      value: PropTypes.number,
    }),
  ),
};

export default PackageDetailsDialog;
