import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: `0 0 ${theme.utils.fromPx(4)} 0`,
  },
  text: {
    color: 'red',
    fontSize: '1rem',
    fontFamily: 'Roboto, sans-serif',
  },
}));

const ProductError = ({ id, quantity, unitPrice }) => {
  const classes = useStyles();
  return (
    <div data-testid="unknown-product-error" className={classes.root}>
      <div className={classes.text}>Unknown Product</div>
      LineItemID: {id}
      Quantity: {quantity}
      Price: {unitPrice}
    </div>
  );
};

ProductError.propTypes = {
  id: PropTypes.node,
  quantity: PropTypes.node,
  unitPrice: PropTypes.node,
};

export default ProductError;
