/* eslint-disable no-unused-vars */
import { Fragment, useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Select, MenuItem, InputLabel, FormControl, Link } from '@material-ui/core';
import { Grid } from '@mui/material';
import { useSnackbar } from 'notistack';
import useEnv from '@/hooks/useEnv';
import { FeatureFlag, useFeature } from '@/features';
import Sticker from '@/components/Sticker';
import useAgentInteractions from '@/hooks/useAgentInteractions';
import { snakeCaseToTitleCase } from '@/utils/string';
import getThumbnail from '@utils/thumbnails';
import { SNACKVARIANTS } from '@/components/SnackMessage/SnackMessage';
import { LINE_ITEM_ATTRIBUTE } from '@/components/Order/utils';
import ReturnTag from '@/components/Tag/ReturnTag';
import TooltipPrimary from '@/components/TooltipPrimary';
import useEnactment from '@/hooks/useEnactment';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import useOrder from '@/hooks/useOrder';
import { getDayDateTimeTimezone } from '@/utils';
import { AllowableActions } from '@/components/Order/OrderDetailsView/utils';
import useAllowableActions from '@/hooks/useAllowableActions';
import RemoveItemDialog from '../RemoveItemDialog';
import TooltipTitle from './TooltipTitle';
import ItemTypes from './ItemTypes';
import ItemIcon from './ItemIcon';
import ItemTypesOrig from './ItemTypesOrig';

const useStyles = makeStyles((theme) => ({
  productContainer: {
    borderColor: 'lightgray',
    borderWidth: 'thin',
    borderStyle: 'solid',
    borderRadius: theme.utils.fromPx(5),
  },
  figure: {
    margin: '0',
    padding: '0',
    display: 'flex',
    height: '100%',
    alignItems: 'center',
    flexFlow: 'row nowrap',
    backgroundColor: '#f5f5f5',
    borderRadius: theme.utils.fromPx(5),
    '& div > img': {
      maxWidth: theme.utils.fromPx(95),
      maxHeight: theme.utils.fromPx(98),
      width: 'auto',
      margin: '0 auto',
      textAlign: 'center',
      display: 'block',
    },
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
    borderRadius: `${theme.utils.fromPx(0)} ${theme.utils.fromPx(4)} ${theme.utils.fromPx(
      4,
    )} ${theme.utils.fromPx(0)}`,
    textAlign: 'center',
    padding: '2px 4px',
    marginBottom: 0,
    width: 'fit-content',
  },
  container: {
    position: 'relative',
    width: '100%',
    margin: '0 auto',
    display: 'inline-grid',
    alignContent: 'center',
    padding: `${theme.utils.fromPx(8)} 0px`,
  },
  overview: {
    margin: theme.utils.fromPx(16),
  },
  title: {
    ...theme.fonts.body.bold,
    color: theme.palette.gray.medium,
    paddingTop: `${theme.utils.fromPx()}`,
    lineHeight: 1.2,
    fontSize: 16,
  },
  price: {
    ...theme.fonts.body.medium,
    margin: `0 0 ${theme.utils.fromPx(4)} 0`,
  },
  quantity: {
    padding: `${theme.utils.fromPx(0)} 0 0 0`,
    color: theme.palette.gray.light,
    float: 'right',
  },
  quantitySelect: {
    float: 'right',
  },
  removeButton: {
    textTransform: 'none',
    color: theme.palette.red.medium,
    float: 'right',
    marginRight: theme.utils.fromPx(2),
  },
  addtoCartButton: {
    textTransform: 'none',
    color: theme.palette.blue.medium,
    float: 'right',
    marginRight: theme.utils.fromPx(2),
    marginTop: theme.utils.fromPx(2),
  },
  prescriptionsButton: {
    textTransform: 'none',
    color: theme.palette.blue.medium,
    float: 'right',
    marginRight: theme.utils.fromPx(2),
    marginBottom: theme.utils.fromPx(2),
  },
  canceledThumbnail: {
    opacity: '0.5',
  },
  canceledText: {
    color: theme.palette.gray['200'],
  },
  partNumber: {
    width: 'fit-content',
    display: 'block',
    fontSize: theme.typography.pxToRem(12),
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: theme.typography.pxToRem(15),
    letterSpacing: '-0.03em',
    color: '#666666',
  },
  pdpLink: {
    width: 'fit-content',
    display: 'block',
    fontSize: theme.typography.pxToRem(12),
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: theme.typography.pxToRem(15),
    letterSpacing: '-0.03em',
    color: theme.palette.blue[800],
    marginBottom: '4px',
  },
  thumbnail: {
    mixBlendMode: 'multiply',
  },
  itemDescription: {
    fontSize: theme.utils.fromPx(14),
    lineHeight: 1.3,
    minHeight: theme.utils.fromPx(18.2),
    marginBottom: theme.utils.fromPx(18.2),
    fontWeight: 500,
    display: '-webkit-box',
    WebkitLineClamp: 1,
    height: theme.utils.fromPx(18.2), //font size * line height * #lines
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  sticker: {
    color: '#BC2848',
  },
  exitToAppIcon: {
    marginLeft: '6px !important',
  },
}));

const Product = ({
  bundleItem,
  thumbnail,
  title,
  price,
  quantity,
  canceled,
  returns,
  id,
  externalId,
  orderNumber,
  catalogEntryId,
  lineItemAttributes = [],
  tags,
  vetContactInfo,
  partNumber,
  attributes,
  personalizationAttributes,
  discontinueDate,
  maxDeliveryDate,
  minDeliveryDate,
  appointmentInfo,
}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [updatableQty, setUpdatableQty] = useState(quantity);
  const [disabled, setDisabled] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const { removeQty, mutate } = useOrder();
  const { sfwUrl } = useEnv();
  const pdpLinkStyleEnabled = useFeature('feature.explorer.pdpLinkStyleEnabled');
  const productEnhancedTagsEnabled = useFeature('feature.explorer.productEnhancedTagsEnabled');
  const { captureInteraction } = useAgentInteractions();
  const { openEnactmentPage } = useEnactment();
  const { isActionAllowed } = useAllowableActions(orderNumber);

  const openPrescriptionsPage = useCallback(() => {
    openEnactmentPage(`/pethealth/my-prescriptions`);
  }, [openEnactmentPage]);

  const openPDPCartPage = useCallback(
    (catalogId) => {
      openEnactmentPage(`/app/dp/${catalogId}`);
    },
    [openEnactmentPage],
  );

  const isPharmacyItem = attributes?.includes('PHARMACEUTICAL');

  const quantityEditable =
    !canceled &&
    lineItemAttributes?.includes(LINE_ITEM_ATTRIBUTE.QTY_REDUCIBLE) &&
    isActionAllowed({ actionName: AllowableActions.REDUCE_QUANTITY });

  const productRemovable =
    !canceled &&
    lineItemAttributes.includes(LINE_ITEM_ATTRIBUTE.CANCELLABLE) &&
    isActionAllowed({ actionName: AllowableActions.REMOVE_ITEM });

  const quantityOptions = useMemo(() => {
    let options = [];
    for (let i = quantity; i > 0; i--) {
      options.push(i);
    }
    return options;
  }, [quantity]);

  const updateItemQuantity = async (
    quantity,
    type,
    oldQty,
    { successMessage, errorMessage } = {},
  ) => {
    try {
      setDisabled(true);
      await removeQty({ orderId: orderNumber, itemId: externalId, quantity });
      await mutate();
      await captureInteraction({
        type: type,
        subjectId: orderNumber,
        action: 'UPDATE',
        currentVal: { quantity: quantity },
        prevVal: { quantity: oldQty || '' },
      });
      if (successMessage) {
        enqueueSnackbar({
          messageHeader: 'Success',
          variant: SNACKVARIANTS.SUCCESS,
          messageSubheader: successMessage,
        });
      }
    } catch {
      enqueueSnackbar({
        messageHeader: 'Error',
        variant: SNACKVARIANTS.ERROR,
        messageSubheader: errorMessage,
      });
    } finally {
      setDisabled(false);
    }
  };

  const handleQtyUpdate = (event) => {
    const updated = event?.target?.value;
    setUpdatableQty(updated);
    /* Subtract from our current qty - API is not an absolute value */
    updateItemQuantity(quantity - updated, 'REDUCED_QUANTITY', quantity, {
      successMessage: 'Item quantity updated',
      errorMessage: 'Could not update item quantity',
    });
  };

  const removeItem = async () => {
    await updateItemQuantity(quantity, 'REMOVED_ITEM', null, {
      errorMessage: 'Item removal was not successful',
      successMessage: 'Item cancellation is processing',
    });
    setDisabled(true);
    setShowRemoveModal(false);
  };

  const primaryTitle = (canceled ? '(Cancelled) ' : '') + title;

  return (
    <>
      <div data-testid={`card:product:${id}`} className={classes.productContainer}>
        <Grid container spacing={1.5} wrap="nowrap">
          <Grid item xs="auto" sx={{ minWidth: '125px' }}>
            <figure
              data-testid="product:thumbnail"
              className={cn(canceled && classes.canceledThumbnail, classes.figure)}
            >
              <div className={classes.container}>
                {returns && returns[0] && (
                  <div className={classes.imgOverlay}>
                    {snakeCaseToTitleCase(returns[0].reasonCategory)}
                  </div>
                )}
                <img
                  className={cn(classes.thumbnail, {
                    [classes.thumbnailWithBadge]: returns && returns[0],
                  })}
                  src={getThumbnail(thumbnail)}
                  alt=""
                />
              </div>
            </figure>
          </Grid>
          <Grid item xs sx={{ paddingBottom: '12px', paddingRight: '12px' }}>
            <Grid container direction="column" justifyContent="flex-start" alignItems="stretch">
              <Grid
                wrap="nowrap"
                container
                item
                sx={{ paddingTop: '1rem' }}
                className={cn(
                  cn(canceled && classes.canceledText),
                  classes.overview,
                  'overview',
                  (productRemovable || quantityEditable) && 'editable',
                )}
                data-testid="product:overview"
              >
                <Grid item xs>
                  <div className={cn(canceled && classes.canceledText, classes.title)}>
                    <Link
                      aria-label={`ITEM #${id}`}
                      className={pdpLinkStyleEnabled ? classes.pdpLink : classes.partNumber}
                      data-testid={`product:catalogEntryId:link:${id}`}
                      href={new URL(`/app/dp/${catalogEntryId}`, sfwUrl).href}
                      rel="noopener"
                      target="_blank"
                      underline={pdpLinkStyleEnabled ? 'hover' : 'none'}
                    >
                      <span data-testid={`product:catalogEntryId:${id}`}>
                        {' '}
                        {`ITEM #${partNumber}`}
                      </span>
                    </Link>
                  </div>
                  <div
                    data-testid="product:title"
                    className={cn(canceled && classes.canceledText, classes.itemDescription)}
                  >
                    <TooltipPrimary
                      title={<TooltipTitle>{primaryTitle}</TooltipTitle>}
                      placement="top"
                    >
                      <ItemIcon attributes={attributes?.[0]} /> <span>{primaryTitle}</span>
                    </TooltipPrimary>
                  </div>
                </Grid>
                <Grid item xs="auto" justifyContent="flex-end">
                  {quantityEditable ? (
                    <div>
                      <FormControl variant="outlined" className={classes.quantitySelect}>
                        <InputLabel id={`${id}-qty-label`} htmlFor={`${id}-qty-select`}>
                          Qty
                        </InputLabel>
                        <Select
                          id={`${id}-qty-select`}
                          labelId={`${id}-qty-select-label`}
                          value={updatableQty}
                          onChange={handleQtyUpdate}
                          data-testid="product:qty-update-select"
                          label="Qty"
                        >
                          {quantityOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                  ) : (
                    <span
                      data-testid="product:qty"
                      className={cn(canceled && classes.canceledText, classes.quantity)}
                    >
                      {`Qty ${quantity}`}
                    </span>
                  )}
                </Grid>
              </Grid>
              <FeatureFlag flag="feature.innovationday.storefront.deeplinking">
                <Grid item xs>
                  <Button
                    data-testid="product:add-to-cart-button"
                    size="small"
                    className={classes.addtoCartButton}
                    onClick={() => openPDPCartPage(catalogEntryId)}
                  >
                    Add to cart <ExitToAppIcon className="exitToAppIcon" />
                  </Button>
                </Grid>
              </FeatureFlag>
              {isPharmacyItem && (
                <FeatureFlag flag="feature.innovationday.storefront.deeplinking">
                  <Grid item xs="auto">
                    <Button
                      data-testid="product:prescription-button"
                      size="small"
                      className={classes.prescriptionsButton}
                      onClick={openPrescriptionsPage}
                    >
                      Prescriptions <ExitToAppIcon className="exitToAppIcon" />
                    </Button>
                  </Grid>
                </FeatureFlag>
              )}
              <Grid container item spacing={0.5} justifyContent="flex-end" alignItems="center">
                <Grid item sx={{ marginRight: 'auto' }}>
                  <p
                    data-testid="product:price"
                    className={cn(canceled && classes.canceledText, classes.price)}
                  >{`$${price}`}</p>
                </Grid>
                {tags && (
                  <FeatureFlag flag="feature.explorer.productCardItemTypeEnabled">
                    {productEnhancedTagsEnabled ? (
                      <ItemTypes
                        bundleItem={bundleItem}
                        tags={tags}
                        vetContactInfo={vetContactInfo}
                        product={{
                          discontinueDate: discontinueDate,
                          personalizationAttributeMap: personalizationAttributes,
                        }}
                        minMaxDates={{
                          maxDeliveryDate: maxDeliveryDate,
                          minDeliveryDate: minDeliveryDate,
                        }}
                        appointmentInfo={appointmentInfo}
                      />
                    ) : (
                      // TODO: At some point we need to get rid of this when we know
                      //       This feature is excepted
                      <ItemTypesOrig
                        bundleItem={bundleItem}
                        tags={tags}
                        vetContactInfo={vetContactInfo}
                      />
                    )}
                  </FeatureFlag>
                )}
                {personalizationAttributes && attributes?.includes('GIFT_CARD') && (
                  <Grid item xs="auto">
                    <TooltipPrimary
                      title={
                        <TooltipTitle>
                          {personalizationAttributes?.RecipientEmail && (
                            <div>
                              <b>Recipient: </b> {personalizationAttributes.RecipientEmail}
                            </div>
                          )}
                          {personalizationAttributes?.ScheduledDate && (
                            <div>
                              <b>Schedule Delivery: </b>
                              {getDayDateTimeTimezone(personalizationAttributes.ScheduledDate)}
                            </div>
                          )}
                          {personalizationAttributes?.Message && (
                            <div>
                              <b>Message: </b>
                              {personalizationAttributes.Message}
                            </div>
                          )}
                        </TooltipTitle>
                      }
                      placement="bottom"
                    >
                      <span>
                        <Sticker className={classes.sticker}>DELIVERY DETAILS</Sticker>
                      </span>
                    </TooltipPrimary>
                  </Grid>
                )}
                {returns?.length > 0 &&
                  returns.map((returnItem) => (
                    <ReturnTag key={returnItem.returnId} returnItem={returnItem} isGridItem />
                  ))}
                {productRemovable && (
                  <Grid item xs>
                    <Button
                      data-testid="product:remove-button"
                      size="small"
                      className={classes.removeButton}
                      onClick={() => setShowRemoveModal(true)}
                    >
                      Remove
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <RemoveItemDialog
        show={showRemoveModal}
        productTitle={title}
        orderNumber={orderNumber}
        onClose={() => setShowRemoveModal(false)}
        onConfirm={removeItem}
      />
    </>
  );
};

Product.propTypes = {
  title: PropTypes.string.isRequired,
  bundleItem: PropTypes.bool,
  quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  price: PropTypes.string.isRequired,
  thumbnail: PropTypes.string.isRequired,
  tags: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  canceled: PropTypes.bool,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  externalId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  orderNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  catalogEntryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  lineItemAttributes: PropTypes.arrayOf(PropTypes.string),
  maxDeliveryDate: PropTypes.string,
  minDeliveryDate: PropTypes.string,
  partNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  returns: PropTypes.arrayOf(
    PropTypes.shape({
      returnId: PropTypes.string.isRequired,
      lineItemId: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      reasonCategory: PropTypes.string.isRequired,
    }),
  ),
  personalizationAttributes: PropTypes.object,
  vetContactInfo: PropTypes.object,
  attributes: PropTypes.arrayOf(PropTypes.string),
  discontinueDate: PropTypes.string,
  appointmentInfo: PropTypes.object,
};

export default Product;
