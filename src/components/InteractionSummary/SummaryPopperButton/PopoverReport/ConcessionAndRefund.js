import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { snakeCaseToTitleCase } from '@/utils/string';
import classNames from 'classnames';

const useStyles = makeStyles((theme) => ({
  returnAmount: {
    fontSize: '14px',
    fontWeight: 500,
  },
  label: {
    color: theme.palette.white,
    fontSize: '12px',
    fontWeight: 400,
  },
  row: {
    marginTop: '12px',
  },
}));

const ConcessionAndRefund = ({
  details: { returnAmount, returnType, totalRefunded, productConcession, shippingConcession },
  includesShippingConcession = false,
}) => {
  const classes = useStyles();

  // Create our number formatter.
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return returnAmount ? (
    // Utilize V2 GWF Values
    <>
      <div className={classNames(classes.label, classes.row)}>
        {snakeCaseToTitleCase(returnType)}
      </div>
      <div className={classes.returnAmount}>
        {formatter.format(includesShippingConcession ? shippingConcession : returnAmount)}
      </div>
    </>
  ) : (
    // Utilize V1 GWF Values
    <>
      {totalRefunded > 0 && (
        <>
          <div className={classNames(classes.label, classes.row)}>Refund</div>
          <div className={classes.returnAmount}>{formatter.format(totalRefunded)}</div>
        </>
      )}
      {productConcession > 0 && (
        <>
          <div className={classNames(classes.label, classes.row)}>Concession</div>
          <div className={classes.returnAmount}>{formatter.format(productConcession)}</div>
        </>
      )}
    </>
  );
};

ConcessionAndRefund.propTypes = {
  details: PropTypes.object,
  includesShippingConcession: PropTypes.bool,
};

export default ConcessionAndRefund;
