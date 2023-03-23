import Button from '@components/Button';
import Checkbox from '@mui/material/Checkbox';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { useContext, useEffect, useMemo, useState } from 'react';
import useFeature from '@/features/useFeature';
import ReturnReason from '../common/ReturnReason';
import { ReplaceRefundContext } from './ReplaceRefundTable';

const useStyles = makeStyles((theme) => ({
  allProductsText: {
    ...theme.fonts.body.bold,
  },
  checkBox: {
    justifyContent: 'center',
  },
}));

const ReplaceRefundSelectAllRow = ({
  rowClasses,
  checkboxClass,
  orderHasUpdatableItems,
  onSelectAllClick,
  returnType,
}) => {
  const classes = useStyles();

  const { allSelected, allResponses, handleUpdate, items } = useContext(ReplaceRefundContext);

  const shelterDonationEnabled = useFeature('feature.explorer.shelterDonationEnabled');

  const [error, setError] = useState(false);

  const {
    onlyGiftCardsRefund = false,
    onlyGiftCardsReplacement = false,
    onlyFrozenItems = false,
  } = useMemo(() => {
    const onlyGiftCards = Object.keys(items).every((key) =>
      items[key]?.product?.attributes?.includes('GIFT_CARD'),
    );

    const onlyFrozenItems = Object.keys(items).every((key) => items[key]?.isFrozen === true);

    return {
      onlyGiftCardsRefund: onlyGiftCards && returnType === 'REFUND',
      onlyGiftCardsReplacement: onlyGiftCards && returnType === 'REPLACEMENT',
      onlyFrozenItems: onlyFrozenItems,
    };
  }, [items]);

  useEffect(() => {
    if (allSelected && !allResponses?.returnReasonComplete) {
      setError(true);
    } else {
      setError(false);
    }
  }, [allSelected, allResponses]);

  /* Reset sendItemBack and donateToShelter when "Select All" is clicked */
  useEffect(() => {
    if (!allSelected) {
      handleUpdate({ sendItemBack: false, donateToShelter: false });
    }
  }, [allSelected]);

  const disableSendBack = useMemo(
    () =>
      !allSelected ||
      !!allResponses.donateToShelter ||
      onlyGiftCardsRefund ||
      onlyGiftCardsReplacement ||
      onlyFrozenItems,
    [allSelected, allResponses, onlyGiftCardsRefund, onlyGiftCardsReplacement, onlyFrozenItems],
  );

  const disableShelterDonation = useMemo(
    () => !allSelected || !!allResponses.sendItemBack || onlyGiftCardsRefund || onlyFrozenItems,
    [allSelected, allResponses, onlyGiftCardsRefund],
  );

  return (
    <div className={rowClasses}>
      <div>
        <Button
          onClick={onSelectAllClick}
          disabled={!orderHasUpdatableItems}
          data-testid="select-all-button"
        >
          {allSelected ? 'Unselect All' : 'Select All'}
        </Button>
      </div>
      <div className={classes.allProductsText}>All products in this order</div>
      <div>
        <ReturnReason
          testId="select-all-return-reasons"
          limitToUnauthorized={onlyGiftCardsRefund}
          allItemsSelected={allSelected}
          error={error}
          disabled={!allSelected}
          onCommentUpdate={(comment) => handleUpdate({ comment })}
          onReturnReasonUpdate={({ returnReason, returnReasonComplete }) =>
            handleUpdate({ returnReason, returnReasonComplete })
          }
          initialState={allResponses.returnReason}
          initialComment={allResponses.comment}
          isInSelectAllRow
        />
      </div>
      <div className={checkboxClass}>
        <Checkbox
          data-testid="send-back:select-all"
          checked={!!allResponses.sendItemBack}
          onChange={(e) => handleUpdate({ sendItemBack: e.target.checked })}
          disabled={disableSendBack}
        />
      </div>
      {shelterDonationEnabled && returnType === 'REFUND' && (
        <div className={checkboxClass}>
          <Checkbox
            data-testid="donate-to-shelter:select-all"
            checked={!!allResponses.donateToShelter}
            disabled={disableShelterDonation}
            onChange={(e) => handleUpdate({ donateToShelter: e.target.checked })}
          />
        </div>
      )}
    </div>
  );
};

ReplaceRefundSelectAllRow.propTypes = {
  rowClasses: PropTypes.string,
  orderHasUpdatableItems: PropTypes.bool,
  onSelectAllClick: PropTypes.func,
  checkboxClass: PropTypes.string,
  returnType: PropTypes.string,
};

export default ReplaceRefundSelectAllRow;
