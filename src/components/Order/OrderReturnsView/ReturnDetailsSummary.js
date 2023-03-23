/* eslint-disable jsx-a11y/anchor-is-valid */
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import ReturnTypeDetails from './ReturnTypeDetails';
import ReturnSubmitterDetails from './ReturnSubmitterDetails';
import ReturnAmountDetails from './ReturnAmountDetails';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.utils.fromPx(10),
    backgroundColor: '#FFFFFF',
  },
  paymentRow: {
    display: 'grid',
    gridTemplateColumns: '43% 28% 28%',
    padding: theme.utils.fromPx(16),
  },
}));

const ReturnDetailsSummary = ({ returnData }) => {
  const classes = useStyles();

  const isRefund = returnData?.type === 'REFUND';
  const isConcession = !['REPLACEMENT', 'REFUND'].includes(returnData?.type);

  return (
    <div data-testid="returnDetailsSummaryContainer" className={classes.root}>
      <div className={classes.paymentRow}>
        <ReturnTypeDetails returnData={returnData} />
        <ReturnSubmitterDetails returnData={returnData} />
        {(isConcession || isRefund) && <ReturnAmountDetails returnData={returnData} />}
      </div>
    </div>
  );
};

ReturnDetailsSummary.propTypes = {
  returnData: PropTypes.object,
};

export default ReturnDetailsSummary;
