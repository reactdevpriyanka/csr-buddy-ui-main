import { TextField } from '@material-ui/core';
import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import useAthena from '@/hooks/useAthena';
import { dollarFormat } from '@/utils/string';
import ReturnReason from '../common/ReturnReason';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.utils.fromPx(40),
    display: 'grid',
    gridTemplateColumns: `${theme.utils.fromPx(275)} 1fr`,
    rowGap: theme.utils.fromPx(24),
    alignItems: 'center',
    justifyItems: 'right',
    fontSize: theme.fonts.size.md,
  },
  detailsLabel: {
    ...theme.fonts.body.bold,
    justifySelf: 'left',
    paddingLeft: theme.utils.fromPx(90),
  },
  toBeGivenLabel: {
    justifySelf: 'left',
    paddingLeft: theme.utils.fromPx(90),
  },
}));

const ConcessionFooter = ({
  onConcessionChange,
  onReturnReasonChange,
  onCommentChange,
  showConcessionAmountError,
  showReturnReasonError,
  initialReturnReason,
  initialComment,
  initialConcession,
}) => {
  const classes = useStyles();
  const { getLang } = useAthena();

  const [concessionAmount, setConcessionAmount] = useState(dollarFormat(initialConcession || 0));
  const parsedAmount = Number.parseFloat(concessionAmount.replace(/[^\d.-]/g, ''));

  const formatConcessionAmount = () => {
    if (!Number.isNaN(parsedAmount) && parsedAmount > 0) {
      const formatted = `$${parsedAmount.toFixed(2)}`;
      setConcessionAmount(formatted);
      onConcessionChange(parsedAmount);
    } else {
      setConcessionAmount('$0.00');
      onConcessionChange(0);
    }
  };

  const handleFocus = () => {
    if (parsedAmount === 0) {
      setConcessionAmount('');
    }
  };

  return (
    <div className={classes.root}>
      {/* Top row */}
      <div className={classes.toBeGivenLabel}>
        {getLang('concessionFooterAmtLabel', { fallback: 'Concession to be given' })}
      </div>
      <div>
        <TextField
          error={showConcessionAmountError}
          label="concession amount"
          variant="outlined"
          onChange={(e) => setConcessionAmount(e.target.value)}
          onBlur={formatConcessionAmount}
          onFocus={handleFocus}
          value={concessionAmount}
          type="text"
        />
      </div>

      {/* Bottom row */}
      <div className={classes.detailsLabel}>
        {getLang('concessionfooterDetailsLabel', { fallback: 'Concession Details' })}
      </div>
      <div>
        <ReturnReason
          initialState={initialReturnReason}
          initialComment={initialComment}
          error={showReturnReasonError}
          orientation="horizontal"
          onReturnReasonUpdate={onReturnReasonChange}
          onCommentUpdate={onCommentChange}
        />
      </div>
    </div>
  );
};

ConcessionFooter.propTypes = {
  onConcessionChange: PropTypes.func,
  onReturnReasonChange: PropTypes.func,
  onCommentChange: PropTypes.func,
  showConcessionAmountError: PropTypes.bool,
  showReturnReasonError: PropTypes.bool,
  initialReturnReason: PropTypes.object,
  initialComment: PropTypes.string,
  initialConcession: PropTypes.string,
};

export default ConcessionFooter;
