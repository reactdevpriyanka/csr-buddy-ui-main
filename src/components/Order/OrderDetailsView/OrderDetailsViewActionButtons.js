import { useState } from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useAthena from '@/hooks/useAthena';
import { ButtonGroup, Button } from '@mui/material';
import useFeature from '@/features/useFeature';
import { AddPromotionDialog, PriceAdjustmentDialog } from './Dialogs';
import { AllowableActions } from './utils';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    justifyContent: 'right',
    columnGap: '1px',
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
  buttonLabel: {
    fontWeight: '700',
    fontSize: '16px',
    lineHeight: '20px',
    color: theme.palette.blue.chewyBrand,
    textTransform: 'none',
  },
}));

export default function OrderDetailsViewActionButtons({ orderNumber, isActionAllowed }) {
  const classes = useStyles();
  const { getLang } = useAthena();
  const [isAddPromotionDialogOpen, setIsAddPromotionDialogOpen] = useState(false);
  const [isPriceAdjustmentDialogOpen, setIsPriceAdjustmentDialogOpen] = useState(false);
  const addPromotionDialogEnabled = useFeature('feature.orderDetails.addPromotionDialogEnabled');
  const priceAdjustmentDialogEnabled = useFeature(
    'feature.orderDetails.priceAdjustmentDialogEnabled',
  );

  return (
    <>
      <div data-testid="orderDetailsViewActionButtonsContainer" className={classes.container}>
        <ButtonGroup variant="outlined" sx={{ backgroundColor: 'white' }}>
          {isActionAllowed({ actionName: AllowableActions.ADD_PROMOTION_CODE }) &&
            addPromotionDialogEnabled && (
              <Button
                aria-label={getLang('addPromotionTitle', { fallback: 'Add Promotion' })}
                className={classes.button}
                data-testid="button:open-add-promotion-dialog"
                disableRipple
                onClick={() => setIsAddPromotionDialogOpen(true)}
                variant="outlined"
              >
                <span className={classes.buttonLabel}>
                  {getLang('addPromotionTitle', { fallback: 'Add Promotion' })}
                </span>
              </Button>
            )}
          {isActionAllowed({ actionName: AllowableActions.ADD_PRICE_ADJUSTMENT }) &&
            priceAdjustmentDialogEnabled && (
              <Button
                aria-label={getLang('priceAdjustmentTitle', { fallback: 'Price Adjustment' })}
                className={classes.button}
                data-testid="button:open-price-adjustment-dialog"
                disableRipple
                onClick={() => setIsPriceAdjustmentDialogOpen(true)}
                variant="outlined"
              >
                <span className={classes.buttonLabel}>
                  {getLang('priceAdjustmentTitle', { fallback: 'Price Adjustment' })}
                </span>
              </Button>
            )}
        </ButtonGroup>
      </div>
      {isAddPromotionDialogOpen && (
        <AddPromotionDialog
          isOpen={isAddPromotionDialogOpen}
          openDialog={setIsAddPromotionDialogOpen}
          orderNumber={orderNumber}
        />
      )}
      {isPriceAdjustmentDialogOpen && (
        <PriceAdjustmentDialog
          isOpen={isPriceAdjustmentDialogOpen}
          openDialog={setIsPriceAdjustmentDialogOpen}
          orderNumber={orderNumber}
        />
      )}
    </>
  );
}

OrderDetailsViewActionButtons.propTypes = {
  orderNumber: PropTypes.string.isRequired,
  isActionAllowed: PropTypes.func.isRequired,
};
