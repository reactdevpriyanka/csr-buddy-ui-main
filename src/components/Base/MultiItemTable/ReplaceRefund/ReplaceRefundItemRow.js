import Checkbox from '@mui/material/Checkbox';
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import useFeature from '@/features/useFeature';
import MultiItemQuantitySelector from '../common/MultiItemQuantitySelector';
import ReturnReason from '../common/ReturnReason';
import MultiItemProductDesc from '../common/MultiItemProductDesc';
import MultiItemGiftCardDetails from '../common/MultiItemGiftCardDetails';
import { ReplaceRefundContext } from './ReplaceRefundTable';

const ReplaceRefundItemRow = ({ item, rowClasses, checkboxClass, returnType }) => {
  const { allSelected, handleUpdate, items } = useContext(ReplaceRefundContext);
  const [error, setError] = useState({});
  const [giftCardDetailsOverride, setGiftCardDetailsOverride] = useState(false);
  const shelterDonationEnabled = useFeature('feature.explorer.shelterDonationEnabled');

  const itemReturnData = items[item.key];
  const shouldReceiveEligible = item.returns?.shouldReceiveEligible;
  const shelterDonationQualified = item.returns?.shelterDonationQualified;

  const showGiftCardRow =
    item.isGiftCard && (itemReturnData?.returnQuantity > 0 || giftCardDetailsOverride);

  useEffect(() => {
    if (allSelected) {
      setError({});
      return;
    }
    const hasQuantity = itemReturnData.returnQuantity > 0;
    const hasReturnReason = itemReturnData.returnReasonComplete;

    let quantityError = false;
    let returnReasonError = false;

    if (hasReturnReason && !hasQuantity) {
      quantityError = true;
    } else if (!hasReturnReason && hasQuantity) {
      returnReasonError = true;
    }

    setError({
      quantity: quantityError,
      returnReason: returnReasonError,
    });
  }, [itemReturnData, allSelected]);

  /* Reset sendItemBack when "Select All" is clicked */
  useEffect(() => {
    if (allSelected) {
      handleUpdate({ id: item.key, sendItemBack: false });
    }
  }, [allSelected]);

  return (
    <>
      <div key={item.key} className={rowClasses}>
        <div>
          <MultiItemQuantitySelector
            itemId={item?.externalId}
            max={item.remainingQuantity}
            onUpdate={(returnQuantity) => handleUpdate({ id: item.key, returnQuantity })}
            error={error?.quantity}
            initialQuantity={itemReturnData?.returnQuantity}
            outOfStock={item?.tags?.includes('OUT_OF_STOCK')}
            discontinued={item?.tags?.includes('DISCONTINUED')}
            returnType={returnType}
            availability={item?.returns?.availability}
          />
        </div>
        <div>
          <MultiItemProductDesc
            item={item}
            showGiftCardDetailToggle={!item.remainingQuantity && item.isGiftCard}
            onGiftCardDetailToggle={setGiftCardDetailsOverride}
            outOfStock={item?.tags?.includes('OUT_OF_STOCK')}
            discontinued={item?.tags?.includes('DISCONTINUED')}
          />
        </div>
        <div>
          <ReturnReason
            itemId={item?.externalId}
            clearReturnReason={itemReturnData.returnQuantity === 0}
            limitToUnauthorized={item.isGiftCard && returnType === 'REFUND'}
            allItemsSelected={allSelected}
            error={error?.returnReason}
            disabled={allSelected || !item.remainingQuantity}
            onCommentUpdate={(comment) => handleUpdate({ id: item.key, comment })}
            initialState={itemReturnData.returnReason}
            initialComment={itemReturnData.comment}
            onReturnReasonUpdate={({ returnReason, returnReasonComplete }) =>
              handleUpdate({ id: item.key, returnReason, returnReasonComplete })
            }
          />
        </div>
        <div className={checkboxClass}>
          <Checkbox
            checked={itemReturnData.sendItemBack}
            disabled={
              allSelected ||
              !item.remainingQuantity ||
              !shouldReceiveEligible ||
              !!itemReturnData.donateToShelter ||
              item.isGiftCard
            }
            onChange={(e) => handleUpdate({ id: item.key, sendItemBack: e.target.checked })}
          />
        </div>
        {shelterDonationEnabled && returnType === 'REFUND' && (
          <div className={checkboxClass}>
            <Checkbox
              checked={!!itemReturnData.donateToShelter}
              disabled={
                allSelected ||
                !item.remainingQuantity ||
                !shouldReceiveEligible ||
                itemReturnData.sendItemBack ||
                !shelterDonationQualified ||
                item.isGiftCard
              }
              onChange={(e) => handleUpdate({ id: item.key, donateToShelter: e.target.checked })}
            />
          </div>
        )}
      </div>
      {showGiftCardRow && (
        <MultiItemGiftCardDetails
          item={item}
          returnType={returnType}
          initialEmail={itemReturnData?.newRecipientEmail}
          onEmailUpdate={(email) => handleUpdate({ id: item.key, newRecipientEmail: email })}
        />
      )}
    </>
  );
};

ReplaceRefundItemRow.propTypes = {
  item: PropTypes.object,
  rowClasses: PropTypes.string,
  returnType: PropTypes.string,
  checkboxClass: PropTypes.string,
};

export default ReplaceRefundItemRow;
