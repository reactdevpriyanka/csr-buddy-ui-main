/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { addSessionStorageItem, getSessionStorage } from '@/utils/sessionStorage';
import ConcessionTable from './Concession/ConcessionTable';
import ReplaceRefundTable from './ReplaceRefund/ReplaceRefundTable';

const getRemainingQuantity = (returns, returnType) => {
  switch (returnType) {
    case 'REPLACEMENT':
      return returns?.replacementQuantityRemaining || 0;
    case 'REFUND':
      return returns?.refundQuantityRemaining || 0;
    case 'CONCESSION':
      return returns?.concessionAmountRemaining?.value || 0;
    default:
      return 0;
  }
};

const GIFT_CARD_ATTR = 'GIFT_CARD';

const checkIsGiftCard = (item) => (item.product?.attributes || []).includes(GIFT_CARD_ATTR);

const MultiItemTable = ({ returnType, lineItems, returnItems, ...props }) => {
  const router = useRouter();
  const { activityId } = router.query;

  const sessionStorage = getSessionStorage('gwf:history') || {};
  const storageKey = `MultiItemTable-${returnType}-${activityId}`;

  const saveToHistory = (historyData) => {
    addSessionStorageItem('gwf:history', { [storageKey]: historyData });
  };

  const stateFromHistory = sessionStorage[storageKey];

  const tableItems = useMemo(() => {
    const items = [];
    for (const item of lineItems) {
      const isGiftCard = checkIsGiftCard(item);
      const isFrozen = item?.tags?.includes('FROZEN') ?? false;
      /* The key used to reference the item in returns data. For ordinary
      items it's the externalId, but since multiple gift cards can have the
      same externalId we have to use the masked account number */
      const itemKeys = isGiftCard ? item?.product?.maskAccountList : [item.externalId];
      if (!itemKeys || itemKeys?.length === 0) continue;

      for (const key of itemKeys) {
        /* We only want to show items that have valid return data */
        const returns = returnItems?.items?.[key];
        if (returns) {
          items.push({
            ...item,
            returns,
            isGiftCard,
            isFrozen,
            remainingQuantity: getRemainingQuantity(returns, returnType),
            key /* So we can reference the item in state without checking isGiftCard each time */,
          });
        }
      }
    }
    return items;
  }, [lineItems]);

  const shippingConcessionInfo = {
    remaining: returnItems?.shippingConcessionRemaining?.value,
    previous: returnItems?.shippingConcessionExisting?.value,
    total: returnItems?.totalShippingCost,
    flatRate: returnItems?.totalFlatShipping,
  };

  if (['REFUND', 'REPLACEMENT'].includes(returnType)) {
    return (
      <ReplaceRefundTable
        {...props}
        tableItems={tableItems}
        returnType={returnType}
        saveToHistory={saveToHistory}
        stateFromHistory={stateFromHistory}
      />
    );
  }
  return (
    <ConcessionTable
      {...props}
      tableItems={tableItems}
      shippingConcessionInfo={shippingConcessionInfo}
      saveToHistory={saveToHistory}
      stateFromHistory={stateFromHistory}
    />
  );
};

MultiItemTable.propTypes = {
  returnType: PropTypes.string.isRequired,
  lineItems: PropTypes.array.isRequired,
  returnItems: PropTypes.object.isRequired,
};

export default MultiItemTable;
