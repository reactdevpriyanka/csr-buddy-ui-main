import { makeStyles } from '@material-ui/core/styles';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { createContext, useCallback, useEffect, useMemo, useReducer } from 'react';

import useFeature from '@/features/useFeature';
import MultiItemValidText from '../common/MultiItemValidText';
import ReplaceRefundSelectAllRow from './ReplaceRefundSelectAllRow';
import ReplaceRefundItemRow from './ReplaceRefundItemRow';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.white,
    borderRadius: theme.utils.fromPx(4),
    marginBottom: theme.utils.fromPx(20),
    padding: theme.utils.fromPx(24),
  },
  heading: {
    ...theme.fonts.h2,
    color: theme.palette.blue.dark,
    fontWeight: '500',
    marginBottom: theme.utils.fromPx(8),
  },
  grid: {
    marginTop: theme.utils.fromPx(20),
    display: 'grid',
    gridTemplateColumns: 'minmax(190px, 1fr) 3.5fr minmax(260px, 1fr) minmax(40px, 1fr)',
    alignItems: 'center',
    gridRowGap: theme.utils.fromPx(8),
  },
  refundGrid: {
    marginTop: theme.utils.fromPx(20),
    display: 'grid',
    gridTemplateColumns:
      'minmax(190px, 1fr) 3.5fr minmax(260px, 1fr) minmax(40px, 1fr) minmax(40px, 1fr)',
    alignItems: 'center',
    gridRowGap: theme.utils.fromPx(8),
  },
  row: {
    display: 'contents',
    '&>div': {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      padding: `${theme.utils.fromPx(20)} ${theme.utils.fromPx(20)} ${theme.utils.fromPx(
        20,
      )} ${theme.utils.fromPx(10)}`,
    },
  },
  topRow: {
    '&>div': {
      borderBottom: `1px solid ${theme.palette.gray['150']}`,
    },
  },
  gridHeader: {
    backgroundColor: theme.palette.gray['50'],
    borderBottom: `1px solid ${theme.palette.gray['150']}`,
    color: theme.palette.primary.main,
    ...theme.fonts.body.medium,
    padding: `${theme.utils.fromPx(10)} ${theme.utils.fromPx(20)} !important`,
  },
  centerContent: {
    justifyContent: 'center',
  },
  checkbox: {
    justifyContent: 'center',
  },
}));

export const ReplaceRefundContext = createContext(null);

/* TODO: pull these from Athena when available */
const ERROR_MESSAGES = {
  QUANTITY: 'Select a quantity to continue',
  RETURN_REASON: 'Complete all return reasons to continue',
  GIFT_CARD: 'Add a new recipient email to continue',
};

/* Reducer for our current component state, if no `id` is supplied in
the payload we can assume the update was made from the top Select All row */
const replaceRefundReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_SELECT_ALL': {
      if (state.allSelected) {
        // Reset fields for each item if we're unselecting all
        for (const [itemId] of Object.entries(state.items)) {
          state.items[itemId].sendItemBack = false;
          state.items[itemId].donateToShelter = false;
          state.items[itemId].comment = '';
        }
      }
      return { ...state, allSelected: !state.allSelected };
    }
    case 'UPDATE': {
      const { id, ...updated } = action.payload;
      if (!id) {
        return { ...state, allResponses: { ...state.allResponses, ...updated } };
      }
      return { ...state, items: { ...state.items, [id]: { ...state.items[id], ...updated } } };
    }
    case 'SET_ERROR_MESSAGE': {
      const { errorMessage } = action.payload;
      return { ...state, errorMessage };
    }
    default:
      return state;
  }
};

const ReplaceRefundTable = ({
  title,
  label,
  onChoose,
  onValidityChange,
  tableItems,
  returnType,
  saveToHistory,
  stateFromHistory,
}) => {
  const classes = useStyles();
  const shelterDonationEnabled = useFeature('feature.explorer.shelterDonationEnabled');
  const [returnState, dispatch] = useReducer(
    replaceRefundReducer,
    stateFromHistory || {
      allSelected: false,
      allResponses: {},
      errorMessage: ERROR_MESSAGES.QUANTITY,
      items: tableItems.reduce((accum, item) => {
        accum[item.key] = {
          externalId: item.externalId,
          product: item.product,
          isGiftCard: item.isGiftCard,
          isFrozen: item.isFrozen,
          sendItemBack: item.returns?.shouldSendItemBack || false,
          donateToShelter: item.returns?.donateToShelter || false,
          shouldReceiveEligible: item.returns?.shouldReceiveEligible || false,
          shelterDonationQualified: item.returns?.shelterDonationQualified || false,
        };
        return accum;
      }, {}),
    },
  );

  /* Enable the Select All button only when we have items
  that can be refunded/replaced */
  const orderHasUpdatableItems = useMemo(() => {
    for (const item of tableItems) {
      if (item.remainingQuantity > 0) {
        return true;
      }
    }
    return false;
  }, [tableItems]);

  const handleSendItemBack = (allResponses, allSelected, item) => {
    return allSelected
      ? allResponses?.sendItemBack && item?.shouldReceiveEligible && !item.isGiftCard
      : item.sendItemBack;
  };

  const handleDonateToShelter = (allResponses, allSelected, item) => {
    if (allSelected) {
      return allResponses.donateToShelter && item.shelterDonationQualified && !item.isGiftCard;
    }
    return item.donateToShelter;
  };

  const handleReturnReason = (allResponses, allSelected, item) => {
    if (item?.isGiftCard && returnType === 'REFUND') {
      return { primary: 'UNAUTHORIZED_PURCHASE' };
    }
    return allSelected === true ? allResponses.returnReason : item.returnReason;
  };

  /* Format our data for the summary GWF call */
  const outputJSON = useMemo(() => {
    const items = [];

    for (const itemId in returnState.items) {
      const item = returnState.items[itemId];
      const { allSelected, allResponses } = returnState;

      if (item.returnQuantity > 0) {
        const returnItemValue = {
          orderLineItemId: item.externalId,
          sendItemBack: handleSendItemBack(allResponses, allSelected, item),
          donateToShelter: handleDonateToShelter(allResponses, allSelected, item),
          returnReason: handleReturnReason(allResponses, allSelected, item),
          comment: allSelected ? allResponses.comment : item.comment,
          returnQuantity: item.returnQuantity,
          product: item.product,
          selectAll: allSelected,
        };
        if (item.newRecipientEmail) {
          returnItemValue.newRecipientEmail = item.newRecipientEmail;
        }

        // Alter resturnState.items to show which items below are actually eligible to donate or send back
        if (allSelected) {
          const { isGiftCard, isFrozen = false } = item;

          if (allResponses.donateToShelter) {
            const { shelterDonationQualified } = item;
            returnState.items[itemId].donateToShelter =
              shelterDonationQualified && !isGiftCard && !isFrozen;
          }
          if (!allResponses.donateToShelter) {
            returnState.items[itemId].donateToShelter = false;
          }

          if (allResponses.sendItemBack) {
            const { shouldReceiveEligible } = item;
            returnState.items[itemId].sendItemBack = shouldReceiveEligible && !isGiftCard;
          }
          if (!allResponses.sendItemBack) {
            returnState.items[itemId].sendItemBack = false;
          }
        }

        items.push(returnItemValue);
      }
    }

    return items;
  }, [returnState]);

  /* This feels massively overcomplicated, unfortunately there are just a
  lot of valid/invalid scenarios for the form */
  const validate = () => {
    const { allSelected, allResponses, items } = returnState;
    let errorMessage = '';
    let hasSubmitableItems = false;
    let isValid = true;

    /* All items selected - short circuit the item validation check */
    if (allSelected) {
      if (allResponses?.returnReasonComplete) {
        onValidityChange(true);
        /* Check that all gift cards have recipient emails */
        if (returnType === 'REPLACEMENT') {
          for (const itemId in items) {
            const item = items[itemId];
            if (item.isGiftCard && !item.newRecipientEmail) {
              errorMessage = ERROR_MESSAGES.GIFT_CARD;
              onValidityChange(false);
            }
          }
        }
      } else {
        errorMessage = ERROR_MESSAGES.RETURN_REASON;
        onValidityChange(false);
      }
      dispatch({ type: 'SET_ERROR_MESSAGE', payload: { errorMessage } });
      return;
    }

    /* Make sure each item is in a valid state.
    Both quantity AND return reason are selected */
    for (const itemId in items) {
      const item = items[itemId];
      if (item.returnQuantity > 0 && item.returnReasonComplete) {
        hasSubmitableItems = true;
      }

      if (item.returnQuantity > 0 && !item.returnReasonComplete) {
        isValid = false;
        errorMessage = ERROR_MESSAGES.RETURN_REASON;
        break;
      }

      if (item.returnReasonComplete && item.returnQuantity === 0) {
        isValid = false;
        errorMessage = ERROR_MESSAGES.QUANTITY;
        break;
      }

      if (
        item.isGiftCard &&
        !item.newRecipientEmail &&
        item.returnQuantity > 0 &&
        returnType === 'REPLACEMENT'
      ) {
        isValid = false;
        errorMessage = ERROR_MESSAGES.GIFT_CARD;
        break;
      }
    }

    /* If the form is untouched show the Quantity error message */
    if (!hasSubmitableItems && !errorMessage) {
      errorMessage = ERROR_MESSAGES.QUANTITY;
    }

    dispatch({ type: 'SET_ERROR_MESSAGE', payload: { errorMessage } });

    /* Enable the submit button if we have at least one item
    that is completely filled out and the rest of the
    items are untouched */
    if (hasSubmitableItems && isValid) {
      onValidityChange(true);
    } else {
      onValidityChange(false);
    }
  };

  /* Show the submit button on load, but gray it out */
  useEffect(() => {
    onChoose();
    onValidityChange(false);
  }, []);

  /* Check for component validity on state updates */
  useEffect(() => {
    validate();
    saveToHistory(returnState);
  }, [returnState.allResponses, returnState.allSelected, returnState.items]);

  const handleUpdate = useCallback(
    (payload) =>
      dispatch({
        type: 'UPDATE',
        payload,
      }),
    [dispatch],
  );

  return (
    <ReplaceRefundContext.Provider value={{ ...returnState, handleUpdate }}>
      <div data-testid="replace-refund-table:root" className={classes.root}>
        <div>
          <div className={classes.heading}>{title}</div>
          <div>{label}</div>
        </div>
        <div
          className={
            shelterDonationEnabled && returnType === 'REFUND' ? classes.refundGrid : classes.grid
          }
        >
          {/* Column Headers */}
          <div className={classes.row}>
            <div className={classes.gridHeader}>Available Quantity</div>
            <div className={classes.gridHeader}>Product</div>
            <div className={classes.gridHeader}>Reason</div>
            <div className={cn(classes.gridHeader, classes.centerContent)}>Send Back</div>
            {shelterDonationEnabled && returnType === 'REFUND' && (
              <div className={cn(classes.gridHeader, classes.centerContent)}>Shelter Donation</div>
            )}
          </div>

          {/* Select All Row */}
          <ReplaceRefundSelectAllRow
            orderHasUpdatableItems={orderHasUpdatableItems}
            rowClasses={cn(classes.row, classes.topRow, classes.rightAlign)}
            checkboxClass={classes.checkbox}
            onSelectAllClick={() => dispatch({ type: 'TOGGLE_SELECT_ALL' })}
            returnType={returnType}
          />

          {/* Item Rows */}
          {tableItems.map((item) => (
            <ReplaceRefundItemRow
              item={item}
              key={item.key}
              rowClasses={classes.row}
              checkboxClass={classes.checkbox}
              returnType={returnType}
            />
          ))}
        </div>
      </div>
      <MultiItemValidText errorMessage={returnState.errorMessage} />
      <input
        type="hidden"
        name="returnItems"
        value={JSON.stringify(outputJSON)}
        data-testid="refund-replace-data-output"
      />
    </ReplaceRefundContext.Provider>
  );
};

ReplaceRefundTable.propTypes = {
  title: PropTypes.string,
  label: PropTypes.string,
  tableItems: PropTypes.array.isRequired,
  onChoose: PropTypes.func,
  onValidityChange: PropTypes.func,
  returnType: PropTypes.string,
  saveToHistory: PropTypes.func,
  stateFromHistory: PropTypes.object,
};

export default ReplaceRefundTable;
