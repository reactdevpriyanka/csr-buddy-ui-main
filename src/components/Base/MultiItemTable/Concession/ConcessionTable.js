import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import MultiItemValidText from '../common/MultiItemValidText';
import ConcessionHeaderRow from './ConcessionHeaderRow';
import ConcessionItemRow from './ConcessionItemRow';
import ConcessionFooter from './ConcessionFooter';
import ConcessionShippingRow from './ConcessionShippingRow';

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
  table: { marginTop: theme.utils.fromPx(20) },
  itemGrid: {
    display: 'grid',
    gridTemplateColumns: `${theme.utils.fromPx(75)} 1fr ${theme.utils.fromPx(130)}`,
    rowGap: theme.utils.fromPx(24),
    padding: `${theme.utils.fromPx(32)} 0`,
    borderBottom: `1px solid ${theme.palette.gray[150]}`,
  },
}));

const ERROR_MESSAGES = {
  ITEM_SELECTION: 'At least one item must be selected to continue.',
  RETURN_REASON: 'Please select a return reason to continue.',
  CONCESSION_AMOUNT: 'Please enter concession amount to continue.',
  CONCESSION_AMOUNT_MAX: 'Concession must not exceed the remaining amount.',
  NONE: '',
};

const ConcessionTable = ({
  title,
  label,
  tableItems,
  onChoose,
  onValidityChange,
  shippingConcessionInfo,
  stateFromHistory,
  saveToHistory,
}) => {
  const classes = useStyles();

  const [selectedItems, setSelectedItems] = useState(stateFromHistory?.selectedItems || {});

  const [errorMessage, setErrorMessage] = useState('');

  const [concessionState, setConcessionState] = useState(
    stateFromHistory?.concessionState || {
      shipping: false,
      returnReason: null,
      returnReasonComplete: false,
      concessionAmount: 0,
      allSelected: false,
      comment: null,
    },
  );

  const shippingDisabled = Number.parseFloat(shippingConcessionInfo.remaining) <= 0;

  /* CSR can only input dollar amounts that are 
  less than or equal to the total remaining concessions */
  const allowableConcession = useMemo(() => {
    let max = tableItems.reduce((accum, item) => {
      if (selectedItems[item.key]) {
        accum += Number.parseFloat(item.remainingQuantity);
      }
      return accum;
    }, 0);

    if (concessionState.shipping) {
      max += Number.parseFloat(shippingConcessionInfo.remaining);
    }

    return max.toFixed(2);
  }, [concessionState, selectedItems]);

  const handleItemSelect = (itemId, isSelected) => {
    setSelectedItems((state) => {
      if (isSelected) {
        return {
          ...state,
          [itemId]: isSelected,
        };
      } else {
        const updated = { ...state };
        delete updated[itemId];
        return updated;
      }
    });
  };

  const handleSelectAllChange = (allSelected) => {
    setConcessionState({
      ...concessionState,
      allSelected,
      shipping: !shippingDisabled && allSelected,
    });
  };

  const handleShippingChange = (e) => {
    setConcessionState({ ...concessionState, shipping: e.target.checked });
  };

  const handleConcessionChange = (concessionAmount) => {
    setConcessionState({ ...concessionState, concessionAmount });
  };

  const handleReturnReasonChange = (returnReason) => {
    setConcessionState({ ...concessionState, ...returnReason });
  };

  const handleCommentChange = (comment) => {
    setConcessionState((state) => ({ ...state, comment }));
  };

  const validate = () => {
    /* There are no items selected + shipping is not selected */
    if (Object.keys(selectedItems).length === 0 && !concessionState.shipping) {
      setErrorMessage(ERROR_MESSAGES.ITEM_SELECTION);
      onValidityChange(false);
      return;
    }

    /* Concession amount isn't filled in with a positive value */
    if (concessionState.concessionAmount <= 0) {
      setErrorMessage(ERROR_MESSAGES.CONCESSION_AMOUNT);
      onValidityChange(false);
      return;
    }

    /* Concession amount exceeds remaining concessions */
    if (concessionState.concessionAmount > allowableConcession) {
      setErrorMessage(ERROR_MESSAGES.CONCESSION_AMOUNT_MAX);
      onValidityChange(false);
      return;
    }

    /* Return reasons are not completed */
    if (!concessionState.returnReasonComplete) {
      setErrorMessage(ERROR_MESSAGES.RETURN_REASON);
      onValidityChange(false);
      return;
    }

    /* Yay, home free, everything checks out */
    setErrorMessage(ERROR_MESSAGES.NONE);
    onValidityChange(true);
  };

  useEffect(() => {
    validate();
    saveToHistory({ concessionState, selectedItems });
  }, [concessionState, selectedItems]);

  /* Show the submit button on load, but gray it out */
  useEffect(() => {
    onChoose();
    onValidityChange(false);
  }, []);

  const outputJSON = useMemo(() => {
    const items = [];
    for (const item of tableItems) {
      if (selectedItems[item.key]) {
        items.push({
          orderLineItemId: item.externalId,
          sendItemBack: false,
          returnReason: concessionState.returnReason,
          comment: concessionState.comment,
          returnQuantity: item.quantity,
          product: item.product,
        });
      }
    }
    if (concessionState.shipping) {
      items.push({
        returnReason: concessionState.returnReason,
        returnQuantity: 1,
        sendItemBack: false,
        orderLineItemId: 'shipping',
        product: {
          name: 'shipping',
          description: 'shipping',
        },
      });
    }
    return items;
  }, [concessionState, selectedItems]);

  return (
    <>
      <div className={classes.root}>
        <div>
          <div className={classes.heading}>{title}</div>
          <div>{label}</div>
        </div>

        <div className={classes.table}>
          <ConcessionHeaderRow
            onSelectAllChange={handleSelectAllChange}
            allSelected={concessionState.allSelected}
          />
          <div className={classes.itemGrid}>
            {tableItems.map((item) => (
              <ConcessionItemRow
                disabled={!(Number.parseFloat(item?.remainingQuantity) >= 0.01) || item.isGiftCard}
                key={item.key}
                item={item}
                allSelected={concessionState.allSelected}
                onSelectChange={handleItemSelect}
                initialSelected={selectedItems[item.key]}
              />
            ))}

            <ConcessionShippingRow
              handleShippingChange={handleShippingChange}
              concessionState={concessionState}
              shippingConcessionInfo={shippingConcessionInfo}
              disabled={shippingDisabled}
            />
          </div>
          <ConcessionFooter
            showConcessionAmountError={[
              ERROR_MESSAGES.CONCESSION_AMOUNT,
              ERROR_MESSAGES.CONCESSION_AMOUNT_MAX,
            ].includes(errorMessage)}
            showReturnReasonError={errorMessage === ERROR_MESSAGES.RETURN_REASON}
            onConcessionChange={handleConcessionChange}
            onReturnReasonChange={handleReturnReasonChange}
            onCommentChange={handleCommentChange}
            initialConcession={concessionState.concessionAmount}
            initialReturnReason={concessionState.returnReason}
            initialComment={concessionState.comment}
          />
        </div>
      </div>
      <input type="hidden" name="concessionAmount" value={concessionState.concessionAmount} />
      <input type="hidden" name="returnItems" value={JSON.stringify(outputJSON)} />
      <MultiItemValidText errorMessage={errorMessage} />
    </>
  );
};

ConcessionTable.propTypes = {
  title: PropTypes.string,
  label: PropTypes.string,
  tableItems: PropTypes.array,
  shippingConcessionInfo: PropTypes.object,
  onChoose: PropTypes.func,
  onValidityChange: PropTypes.func,
  stateFromHistory: PropTypes.object,
  saveToHistory: PropTypes.func,
};

export default ConcessionTable;
