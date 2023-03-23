/* eslint-disable react/jsx-props-no-spreading */
import _ from 'lodash';
import { Fragment, useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import cn from 'classnames';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { IconButton, Link } from '@material-ui/core';
import useEnv from '@/hooks/useEnv';
import { currencyFormatter } from '@/utils/string';
import { getImg } from '@/components/Autoship/AutoshipViewDetailsDialog/AutoshipViewDetailsDialogHelper';
import TrashIcon from '@mui/icons-material/DeleteOutlineSharp';
import { useSnackbar } from 'notistack';
import { SNACKVARIANTS } from '@/components/SnackMessage/SnackMessage';
import RemoveItemDialog from '@/components/Card/RemoveItemDialog';
import Sticker from '@/components/Sticker';
import { getDayDateTimeTimezone } from '@/utils';
import { FeatureFlag } from '@/features';
import useAgentInteractions from '@/hooks/useAgentInteractions';
import useOrderDetailsContext from '@/hooks/useOrderDetailsContext';
import ReturnTag from '@/components/Tag/ReturnTag';
import useOrderGraphql from '@/hooks/useOrderGraphql';
import TooltipPrimary from '@/components/TooltipPrimary';
import { Grid } from '@mui/material';
import useFeature from '@/features/useFeature';
import useAthena from '@/hooks/useAthena';
import useOrder from '@/hooks/useOrder';
import { LINE_ITEM_ATTRIBUTE } from '../utils';
import { formatItemType } from '../../Card/utils';
import { AllowableActions, getAttributes } from './utils';
import QuantitySelector from './OrderDetailsQuantitySelector';
import OrderDetailsComponentLabel from './OrderDetailsComponentLabel';
import OrderDetailsItemStatus from './OrderDetailsItemStatus';

const useStyles = makeStyles((theme) => ({
  dialog: {
    '& .MuiDialog-paper': {
      minWidth: `${theme.utils.fromPx(1200)}`,
    },
  },
  dialogTitle: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: `${theme.utils.fromPx(24)}`,
    lineHeight: `${theme.utils.fromPx(28)}`,
    letterSpacing: '0.25%',
    color: '#000000',
  },
  dialogFooter: {
    display: 'grid',
    gridTemplateColumns: `${theme.utils.fromPx(300)} ${theme.utils.fromPx(300)} auto`,
    gridColumnGap: `${theme.utils.fromPx(20)}`,
    marginTop: `${theme.utils.fromPx(30)}`,
    marginLeft: `${theme.utils.fromPx(15)}`,
    marginBottom: `${theme.utils.fromPx(30)}`,
  },
  shippingInfo: {
    '& div:first-child': {
      marginBottom: '0px',
    },
  },
  subtotalValues: {
    textAlign: 'end',
    marginRight: `${theme.utils.fromPx(25)}`,
  },
  figure: {
    margin: '0',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
    flexFlow: 'row nowrap',
    '& div > img': {
      width: '100%',
      margin: '0',
      textAlign: 'center',
      display: 'block',
    },
  },
  container: {
    position: 'relative',
    width: theme.utils.fromPx(120),
    margin: '0',
    display: 'inline-grid',
    alignContent: 'center',
  },
  description: {
    display: 'flex',
    flexDirection: 'column',
  },
  partNumber: {
    fontSize: theme.typography.pxToRem(12),
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: theme.typography.pxToRem(15),
    letterSpacing: '-0.03em',
    color: '#666666',
  },
  activityHeader: {
    backgroundColor: 'white',
    '&.primaryBackground': {
      backgroundColor: 'white',
    },
  },
  closeButton: {
    color: '#000',
  },
  trashIcon: {
    color: '#851940',
  },
  itemStatus: {
    display: 'grid',
    whiteSpace: 'nowrap',
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
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '18px',
    color: '#121212',
  },
  imgOverlay: {
    top: '0',
    background: '#666666' /* Black see-through */,
    color: '#ffffff',
    position: 'absolute',
    transition: '.5s ease',
    opacity: 1,
    fontSize: theme.utils.fromPx(12),
    fontWeight: 700,
    borderRadius: `0 ${theme.utils.fromPx(4)} ${theme.utils.fromPx(4)} 0`,
    textAlign: 'center',
    padding: '2px 4px',
    marginBottom: 0,
    width: 'fit-content',
    whiteSpace: 'nowrap',
  },
  packagesFooter: {
    textAlign: 'right',
    marginTop: '10px',
    marginBottom: '10px',
    marginRight: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  tableComponent: {
    display: 'grid',
    textAlign: 'right',
  },
  quantityPanel: {
    paddingTop: theme.utils.fromPx(5),
    paddingLeft: theme.utils.fromPx(5),
  },
  sticker: {
    fontFamily: 'Roboto',
    fontWeight: '600',
    fontSize: '12px',
    lineHeight: '15px',
    marginRight: '4px',
    marginLeft: '4px',
  },
  tagTitle: {
    marginRight: theme.utils.fromPx(4),
    pointerEvents: 'all',
    opacity: '1 !important',
  },
  thumbnail: {
    marginLeft: '23px !important',
    width: '70% !important',
  },
  thumbnailWithBadge: {
    paddingTop: '8px',
  },
  canceled: {
    ...theme.utils.disabled,
    color: theme.palette.gray['200'],
  },
  itemCanceled: {
    ...theme.utils.disabled,
    color: theme.palette.gray['200'],
  },
  quantityOrdered: {
    marginRight: theme.utils.fromPx(8),
    marginLeft: theme.utils.fromPx(1),
  },
  tagsection: {
    display: 'flex',
    fontSize: theme.typography.pxToRem(12),
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'normal',
    color: 'white',
  },
  tooltipTagtitle: {
    fontWeight: 'bold',
    fontStyle: 'bold',
    fontSize: theme.typography.pxToRem(13),
    fontFamily: 'Roboto',
    margin: `0 ${theme.utils.fromPx(8)} 0 0`,
  },
  infoIcon: {
    marginLeft: theme.utils.fromPx(3),
    height: '100%',
    verticalAlign: 'bottom',
    '& path': {
      fill: theme.palette.primary.alternate,
    },
  },
}));

const OrderDetailsViewPackageProducts = ({
  orderNumber,
  packageNum,
  lineItems = [],
  packageTotal,
  isActionAllowed,
  isRelease = false,
  currPackage,
  orderStatus,
  returns,
  returnItems,
}) => {
  const classes = useStyles();

  const { sfwUrl: baseURL } = useEnv();

  const { enqueueSnackbar } = useSnackbar();

  const { removeQty, mutate } = useOrder();

  const [showRemoveModal, setShowRemoveModal] = useState(false);

  const [currentProduct, setCurrentProduct] = useState();

  const { captureInteraction } = useAgentInteractions();

  const {
    canceledItems,
    revalidateOrderDetailsGraphql,
    shipments,
    itemMap,
  } = useOrderDetailsContext();

  const { data: orderDetailsGraphql } = useOrderGraphql(orderNumber);
  const { getLang } = useAthena(); // athena config

  const vetDietTagEnabled = useFeature('feature.explorer.vetDietTagEnabled');

  const itemStatusEnabled = useFeature('feature.explorer.itemStatusEnabled');

  const [quantityChangeLoading, setQuantityChangeLoading] = useState(
    lineItems.reduce((state, lineItem) => {
      return {
        ...state,
        [lineItem?.externalId]: false,
      };
    }, {}),
    [],
  );

  const isItemCanceled = useCallback(
    // Graphql data will be more up to date so it's prioritized
    (lineItemId) => {
      if (orderStatus === 'CANCELED') {
        return canceledItems?.some((item) => item.lineItemId === lineItemId);
      } else {
        if (orderDetailsGraphql?.byOrderId?.lineItems) {
          if (
            orderDetailsGraphql.byOrderId.lineItems.some((item) => lineItemId === item.legacyId)
          ) {
            return false;
          }
          return true;
        }
        return false;
      }
    },
    [orderDetailsGraphql, canceledItems],
  );

  const getTitleElem = (title) => {
    return <span className={classes.tooltipText}>{title}</span>;
  };

  const getItemType = (tags, appointmentInfo, vetContactInfo, product, rowData) => {
    return tags?.map((tag) => {
      const key = `${tag}`;
      const testId = `product:itemtype:sticker:${key}`;
      if (!vetDietTagEnabled && tag.includes('VET_DIET')) return null;
      return tag.includes('VET_DIET') ? (
        <Grid item xs="auto" key={key} className={classes.itemCanceled}>
          <Sticker key={testId}>
            <TooltipPrimary
              title={getTitleElem(
                <>
                  {vetContactInfo?.clinicName != null && (
                    <div className={classes.tagsection}>
                      <p className={classes.tooltipTagtitle}>
                        {getLang('ClinicName', { fallback: 'Clinic Name' })}:{' '}
                      </p>{' '}
                      {vetContactInfo?.clinicName}
                    </div>
                  )}
                  {vetContactInfo?.petName != null && (
                    <div className={classes.tagsection}>
                      <p className={classes.tooltipTagtitle}>
                        {getLang('PetName', { fallback: 'Pet Name' })}:{' '}
                      </p>{' '}
                      {vetContactInfo?.petName}
                    </div>
                  )}
                </>,
              )}
              placement="bottom"
            >
              <span data-testid={testId} className={classes.tagTitle}>
                {formatItemType(tag)}
              </span>
            </TooltipPrimary>
          </Sticker>
        </Grid>
      ) : (
        <Grid item xs="auto" key={key}>
          <Sticker
            key={key}
            className={
              tag.includes('OUT_OF_STOCK') ||
              tag.includes('FORCED_BACK_ORDER') ||
              tag.includes('DISCONTINUED')
                ? 'red'
                : 'default'
            }
            toolTip={getAttributes(tag, appointmentInfo, vetContactInfo, product, rowData)}
          >
            <span data-testid={testId} className={classes.tagTitle}>
              {formatItemType(tag)}
            </span>
          </Sticker>
        </Grid>
      );
    });
  };

  const getDescription = (product, rowData) => {
    const getGiftCardData = () => {
      if ((product?.attributes || []).includes('GIFT_CARD')) {
        const giftCardInfo = product?.personalizationAttributeMap;
        return giftCardInfo ? (
          <div data-testid={`product:sticker:${product?.catalogEntryId}:tooltip`}>
            <div>
              <span>{getLang('orderPackageRecipient', { fallback: 'Recipient:' })}</span>
              <span>{giftCardInfo?.RecipientEmail}</span>
            </div>

            <div>
              <span>{getLang('orderPackageFrom', { fallback: 'From:' })}</span>
              <span>{giftCardInfo?.SenderName}</span>
            </div>

            <div>
              <span>{getLang('orderScheduledDelivery', { fallback: 'Scheduled Delivery:' })}</span>
              <span>{getDayDateTimeTimezone(giftCardInfo?.ScheduledDate)}</span>
            </div>

            <div>
              <span>{getLang('orderPackageMessage', { fallback: 'Message:' })}</span>
              <span>{giftCardInfo?.Message}</span>
            </div>
          </div>
        ) : null;
      }
    };

    const giftCardInfo = getGiftCardData();

    return (
      <div className={classes.description} key={product?.partNumber}>
        <Link
          target="_blank"
          rel="noopener"
          className={classes.btnModifyAutoship}
          data-testid={`product:catalogEntryId:link:${product?.catalogEntryId}`}
          aria-label={`ITEM #${product?.catalogEntryId}`}
          underline="none"
          href={`${baseURL}/app/dp/${product?.catalogEntryId}`}
        >
          <span
            data-testid={`product:catalogEntryId:${product?.catalogEntryId}`}
            className={classes.partNumber}
          >{`ITEM #${product?.partNumber}`}</span>
        </Link>
        <Link
          className={cn(classes.btnModifyAutoship, isItemCanceled(rowData?.id) && classes.canceled)}
          target="_blank"
          rel="noopener"
          data-testid={`product:catalogEntryId:link:${product?.catalogEntryId}`}
          aria-label={`ITEM #${product?.catalogEntryId}`}
          underline="none"
          href={`${baseURL}/app/dp/${product?.catalogEntryId}`}
        >
          {isItemCanceled(rowData?.id) && <span>(Canceled) </span>}
          <span>{product?.description}</span>
        </Link>
        <Grid container item spacing={0.5} justifyContent="flex-start" alignItems="center">
          <FeatureFlag flag="feature.explorer.productCardItemTypeEnabled">
            <span>
              <Grid
                container
                spacing={0.1}
                className={cn(
                  classes.quantityPanel,
                  isItemCanceled(rowData?.id) && classes.canceled,
                )}
              >
                <span className={classes.quantityOrdered}>
                  {getLang('QtyOrdered', { fallback: 'Qty Ordered' })}: {rowData?.quantity}
                </span>
                {getItemType(
                  rowData?.tags,
                  rowData?.appointmentInfo,
                  rowData?.vetContactInfo,
                  product,
                  rowData,
                )}
                {returnItems &&
                  returnItems
                    ?.filter((returnItem) => returnItem.lineItemId === rowData?.id)
                    ?.map((returnItem) => (
                      <Fragment key={returnItem.returnId}>
                        <ReturnTag returnItem={returnItem} isGridItem={true} />
                      </Fragment>
                    ))}
                {giftCardInfo && (
                  <Grid item xs="auto">
                    <Sticker className={classes.sticker} toolTip={giftCardInfo}>
                      <span
                        data-testid={`product:sticker:${product?.catalogEntryId}`}
                        className={classes.tagTitle}
                      >
                        {getLang('orderPackageDeliveryDetails', { fallback: 'DELIVERY DETAILS' })}
                      </span>
                    </Sticker>
                  </Grid>
                )}
              </Grid>
            </span>
          </FeatureFlag>
        </Grid>
      </div>
    );
  };

  const updateItemQuantity = async (
    quantity,
    orderNumber,
    externalId,
    type,
    oldQty,
    deleteItem = false,
    { successMessage, errorMessage } = {},
  ) => {
    try {
      const body = {
        orderId: orderNumber,
        itemId: externalId,
        ...(!deleteItem && { quantity: oldQty - quantity }),
      };

      setQuantityChangeLoading((state) => ({
        ...state,
        [externalId]: true,
      }));

      removeQty(body)
        .then(() => {
          mutate();
          captureInteraction({
            type: type,
            subjectId: orderNumber,
            action: 'UPDATE',
            currentVal: { quantity: oldQty - quantity },
            prevVal: { quantity: oldQty || '' },
          });

          return revalidateOrderDetailsGraphql();
        })
        .then(() => {
          enqueueSnackbar({
            messageHeader: 'Success',
            variant: SNACKVARIANTS.SUCCESS,
            messageSubheader: successMessage,
          });
        })
        .catch(() => {
          enqueueSnackbar({
            messageHeader: 'Error',
            variant: SNACKVARIANTS.ERROR,
            messageSubheader: errorMessage,
          });
        })
        .finally(() => {
          setQuantityChangeLoading((state) => ({
            ...state,
            [externalId]: false,
          }));
        });

      if (successMessage) {}
    } catch {} finally {}
  };

  const handleQtyUpdate = useCallback((newQuantity, quantity, orderNumber, externalId) => {
    updateItemQuantity(newQuantity, orderNumber, externalId, 'REDUCED_QUANTITY', quantity, false, {
      successMessage: 'Item quantity updated',
      errorMessage: 'Could not update item quantity',
    });
  }, []);

  const removeItem = async () => {
    await updateItemQuantity(
      null,
      orderNumber,
      currentProduct?.externalId,
      'REMOVED_ITEM',
      null,
      true,
      {
        errorMessage: 'Item removal was not successful',
        successMessage: 'Successfully removed the item',
      },
    );
    setCurrentProduct();
  };

  const showRemove = (product) => {
    setCurrentProduct(product);
    setShowRemoveModal(true);
  };

  const getDeleteIcon = (product, rowData) => {
    const productRemovable =
      rowData?.lineItemAttributes &&
      rowData?.lineItemAttributes.includes(LINE_ITEM_ATTRIBUTE.CANCELLABLE) &&
      !rowData?.canceled;

    if (!productRemovable || !isActionAllowed({ actionName: AllowableActions.REMOVE_ITEM })) {
      return null;
    }

    return (
      <IconButton
        className={classes.iconButton}
        variant="outlined"
        onClick={() => {
          showRemove(rowData);
        }}
        data-testid="remove-item-trash-icon"
      >
        <TrashIcon className={classes.trashIcon} />
      </IconButton>
    );
  };

  const getQuantitySelector = (product, rowData) => {
    const quantityEditable =
      rowData?.lineItemAttributes?.includes(LINE_ITEM_ATTRIBUTE.QTY_REDUCIBLE) &&
      !rowData?.canceled;

    if (!quantityEditable || !isActionAllowed({ actionName: AllowableActions.REDUCE_QUANTITY })) {
      return null;
    }

    return (
      <QuantitySelector
        quantity={rowData?.quantity}
        justifyContent="end"
        showTotalCount={false}
        max={rowData?.quantity}
        isLoading={quantityChangeLoading?.[rowData?.externalId]}
        onUpdate={(returnQuantity) => {
          handleQtyUpdate(returnQuantity, rowData?.quantity, orderNumber, rowData?.externalId);
        }}
      />
    );
  };

  const isItemSpreadAcrossPackages = useCallback(
    (lineItemId) => {
      if (shipments?.length > 0 && currPackage) {
        const otherShipmentIds = shipments
          ?.filter((shipment) => shipment.id !== currPackage.id)
          ?.map(({ shipmentItems = [] }) => shipmentItems)
          ?.flat()
          ?.map(({ lineItemId }) => lineItemId);

        return otherShipmentIds?.includes(lineItemId);
      }
      return false;
    },
    [shipments],
  );

  const packageContainsSpreadItems = useMemo(() => {
    if (shipments?.length > 0 && currPackage) {
      return currPackage?.shipmentItems
        ?.map(({ lineItemId }) => lineItemId)
        ?.some((lineItemId) => isItemSpreadAcrossPackages(lineItemId));
    }

    return false;
  }, [shipments, currPackage]);

  const getImgComponent = (catalogEntryId, thumbnail, returnItem, isDisabled) => {
    return (
      <Link
        target="_blank"
        rel="noopener"
        className={cn(classes.btnModifyAutoship, isDisabled && classes.canceled)}
        data-testid={`product:catalogEntryId:link:${catalogEntryId}`}
        aria-label={`ITEM #${catalogEntryId}`}
        underline="none"
        href={`${baseURL}/app/dp/${catalogEntryId}`}
      >
        {getImg({ thumbnail: thumbnail, classes: classes, returnItem: returnItem })}
      </Link>
    );
  };

  const columns = useMemo(() => [
    {
      id: 'product',
      label: '',
      minWidth: '75px',
      maxWidth: '75px',
      paddingLeft: '0',
      format: (value, row) => {
        const returnItem = _.map(returns, (obj) => obj.items)
          .flat()
          .find((item) => item?.partNumber === value?.partNumber);
        return getImgComponent(
          value?.catalogEntryId,
          value?.thumbnail,
          returnItem,
          isItemCanceled(row.id),
        );
      },
    },
    {
      id: 'product',
      label: '',
      minWidth: 500,
      maxWidth: 500,
      padding: '0 16px 0 16px',
      format: (value, rowData) => {
        return getDescription(value, rowData);
      },
    },
    {
      id: 'product',
      label: '',
      minWidth: 175,
      maxWidth: 175,
      padding: '0 16px 0 16px',
      align: 'center',
      format: (value, rowData) => getQuantitySelector(value, rowData),
    },
    {
      id: 'itemStatus',
      label: 'Status',
      minWidth: 100,
      padding: '50px 16px 16px 16px',
      format: function render(value, row) {
        return (
          itemStatusEnabled && (
            <OrderDetailsComponentLabel
              name="Status"
              value={<OrderDetailsItemStatus row={row} />}
              isDisabled={isItemCanceled(row.id)}
              row={row}
              isItemSpreadAcrossPackages={isItemSpreadAcrossPackages(row.id)}
            />
          )
        );
      },
    },
    {
      id: 'unitPrice',
      label: 'Unit $',
      minWidth: 100,
      maxWidth: 100,
      padding: '0 16px 0 16px',
      format: function render(value, row) {
        return (
          <OrderDetailsComponentLabel
            name="Unit $"
            value={currencyFormatter(value?.value)}
            isDisabled={isItemCanceled(row.id)}
            row={row}
            isItemSpreadAcrossPackages={isItemSpreadAcrossPackages(row.id)}
          />
        );
      },
    },
    {
      id: 'totalAdjustment',
      label: 'Discount',
      minWidth: 100,
      maxWidth: 100,
      padding: '0 16px 0 16px',
      align: 'right',
      format: function render(value, row) {
        return (
          <OrderDetailsComponentLabel
            name="Discount"
            value={currencyFormatter(value?.value)}
            isDisabled={isItemCanceled(row.id)}
            row={row}
            isItemSpreadAcrossPackages={isItemSpreadAcrossPackages(row.id)}
          />
        );
      },
    },
    {
      id: 'totalProduct',
      label: 'Total',
      minWidth: 100,
      maxWidth: 100,
      padding: '0 16px 0 16px',
      align: 'right',
      format: function render(value, row) {
        const quantity = isItemSpreadAcrossPackages(row.id)
          ? itemMap[row?.id]?.quantity
          : row?.quantity;

        const total =
          _.toNumber(row?.unitPrice?.value) * _.toNumber(quantity) +
          _.toNumber(row?.totalAdjustment?.value);
        return (
          <OrderDetailsComponentLabel
            name="Total"
            value={currencyFormatter(total)}
            isDisabled={isItemCanceled(row.id)}
            row={row}
            isItemSpreadAcrossPackages={isItemSpreadAcrossPackages(row.id)}
          />
        );
      },
    },
    {
      id: 'product',
      label: '',
      minWidth: 60,
      maxWidth: 60,
      padding: '0 16px 0 16px',
      align: 'right',
      format: (value, rowData) => getDeleteIcon(value, rowData),
    },
  ]);

  return (
    <Paper
      data-testid="orderDetailsViewPackageProductsContainer"
      sx={{
        width: '100%',
        overflow: 'hidden',
        boxShadow: 'none',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
      }}
    >
      <TableContainer>
        <Table
          sx={{
            [`& .${tableCellClasses.root}`]: {
              borderBottom: 'none',
            },
          }}
          stickyHeader
          aria-label="sticky table"
        >
          <TableBody>
            {lineItems?.map((row) => {
              return (
                <TableRow role="checkbox" tabIndex={-1} key={row.id}>
                  {columns?.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{
                          minWidth: column.minWidth,
                          maxWidth: column.maxWidth,
                          padding: column.padding,
                        }}
                      >
                        {column.format(value, row)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className={classes.packagesFooter}>
          {!packageContainsSpreadItems && (
            <>
              <span className={classes.label}>{`${isRelease ? 'Release' : 'Package'} ${
                packageNum ?? ''
              } total   `}</span>
              <span className={classes.text}>{currencyFormatter(packageTotal)}</span>
            </>
          )}
        </div>
      </TableContainer>
      {currentProduct && showRemoveModal && (
        <RemoveItemDialog
          show={showRemoveModal}
          productTitle={currentProduct?.product?.description ?? currentProduct?.product?.name}
          orderNumber={orderNumber}
          lineItemId={currentProduct?.id}
          onClose={() => setShowRemoveModal(false)}
          onConfirm={() => removeItem(currentProduct)}
        />
      )}
    </Paper>
  );
};

OrderDetailsViewPackageProducts.propTypes = {
  orderNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  packageNum: PropTypes.number,
  lineItems: PropTypes.array.isRequired,
  packageTotal: PropTypes.number,
  isActionAllowed: PropTypes.func,
  isRelease: PropTypes.bool,
  currPackage: PropTypes.object,
  orderStatus: PropTypes.string,
  returns: PropTypes.arrayOf(PropTypes.object),
  returnItems: PropTypes.arrayOf(PropTypes.object),
};

export default OrderDetailsViewPackageProducts;
