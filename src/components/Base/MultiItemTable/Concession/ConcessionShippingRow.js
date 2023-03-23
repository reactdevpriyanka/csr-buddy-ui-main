import { dollarFormat } from '@/utils/string';
import { Checkbox } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import ConcessionDetailRow from './ConcessionDetailRow';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'contents',
    '&>div': {
      alignSelf: 'center',
    },
  },
  shippingAmount: {
    ...theme.fonts.body.bold,
  },
  shippingText: {
    fontSize: theme.fonts.size.md,
  },
}));

const ConcessionShippingRow = ({
  handleShippingChange,
  concessionState,
  disabled,
  shippingConcessionInfo,
}) => {
  const classes = useStyles();

  const shippingDetails = useMemo(() => {
    if (disabled) return [];
    return [
      { label: 'Flat rate', value: dollarFormat(shippingConcessionInfo.flatRate) },
      { label: 'Total', value: dollarFormat(shippingConcessionInfo.total) },
      {
        label: 'Previous Con.',
        value: dollarFormat(shippingConcessionInfo.previous),
      },
      { label: 'Remaining amt', value: dollarFormat(shippingConcessionInfo.remaining) },
    ];
  }, [shippingConcessionInfo]);

  return (
    <>
      <div className={classes.root}>
        <div>
          <Checkbox
            onChange={handleShippingChange}
            checked={concessionState.shipping}
            disabled={disabled}
          />
        </div>
        <div className={classes.shippingText}>Shipping</div>
        <div className={classes.shippingAmount}>
          {dollarFormat(shippingConcessionInfo.remaining)}
        </div>
      </div>
      {concessionState.shipping && <ConcessionDetailRow details={shippingDetails} />}
    </>
  );
};

ConcessionShippingRow.propTypes = {
  handleShippingChange: PropTypes.func,
  concessionState: PropTypes.object,
  disabled: PropTypes.bool,
  shippingConcessionInfo: PropTypes.shape({
    remaining: PropTypes.string,
    previous: PropTypes.string,
    total: PropTypes.string,
    flatRate: PropTypes.string,
  }),
};

export default ConcessionShippingRow;
