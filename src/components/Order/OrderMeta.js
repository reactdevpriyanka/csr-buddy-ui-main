import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    color: '#797979',
    display: 'inline-block',
    fontSize: '0.85rem',
    margin: '0.75rem 0.5rem 0 0',
  },
  price: {
    color: '#588e5a',
    fontWeight: '600',
  },
}));

const OrderMeta = ({ totalPrice, totalItems }) => {
  const classes = useStyles();

  return (
    <span className={classes.root}>
      <span className={classes.price}>{`$${(totalPrice / 100).toFixed(2)}`}</span>
      <span className={classes.delimiter}>{' for '}</span>
      <span className={classes.shipments}>{`${totalItems} items`}</span>
    </span>
  );
};

OrderMeta.propTypes = {
  totalPrice: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
};

export default OrderMeta;
