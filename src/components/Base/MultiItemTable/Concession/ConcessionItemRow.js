import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { Checkbox } from '@material-ui/core';
import { useMemo, useState, useEffect, useRef } from 'react';
import { dollarFormat } from '@/utils/string';
import MultiItemProductDesc from '../common/MultiItemProductDesc';
import MultiItemGiftCardDetails from '../common/MultiItemGiftCardDetails';
import ConcessionDetailRow from './ConcessionDetailRow';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'contents',
  },
  remainingAmount: {
    ...theme.fonts.body.bold,
    alignSelf: 'center',
  },
  checkbox: {
    alignSelf: 'center',
  },
}));

const ConcessionItemRow = ({ item, allSelected, disabled, onSelectChange, initialSelected }) => {
  const classes = useStyles();
  const [isSelected, setIsSelected] = useState(initialSelected || false);
  const [showGiftCardRow, setShowGiftCardRow] = useState(false);

  const selectAllClicked = useRef(false);

  const itemDetails = useMemo(() => {
    if (item.isGiftCard) return [];
    return [
      { label: 'Unit $', value: dollarFormat(item.unitPrice?.value) },
      { label: 'QTY ordered', value: item.quantity },
      {
        label: 'Discount',
        value: `(${dollarFormat(item.totalAdjustment?.value?.replace('-', ''))})`,
      },
      { label: 'Total', value: dollarFormat(item.totalProductCost?.value) },
      {
        label: 'Previous Con.',
        value: dollarFormat(item.returns?.concessionAmountExisting?.value),
      },
      { label: 'Remaining amt', value: dollarFormat(item.remainingQuantity) },
    ];
  }, [item]);

  const handleCheckboxChange = (checked) => {
    setIsSelected(checked);
    onSelectChange(item.key, checked);
  };

  useEffect(() => {
    if (disabled) return;

    if (allSelected) {
      selectAllClicked.current = true;
      handleCheckboxChange(true);
    } else if (selectAllClicked.current) {
      handleCheckboxChange(false);
    }
  }, [allSelected]);

  return (
    <div className={classes.root}>
      <div className={classes.checkbox}>
        <Checkbox
          onChange={(e) => handleCheckboxChange(e.target.checked)}
          checked={isSelected}
          disabled={disabled}
        />
      </div>
      <div>
        <MultiItemProductDesc
          item={item}
          showGiftCardDetailToggle={item.isGiftCard}
          onGiftCardDetailToggle={setShowGiftCardRow}
        />
      </div>
      <div className={classes.remainingAmount}>{dollarFormat(item.remainingQuantity)}</div>
      {isSelected && <ConcessionDetailRow details={itemDetails} />}
      {showGiftCardRow && <MultiItemGiftCardDetails item={item} />}
    </div>
  );
};

ConcessionItemRow.propTypes = {
  item: PropTypes.object,
  allSelected: PropTypes.bool,
  disabled: PropTypes.bool,
  onSelectChange: PropTypes.func,
  initialSelected: PropTypes.bool,
};

export default ConcessionItemRow;
