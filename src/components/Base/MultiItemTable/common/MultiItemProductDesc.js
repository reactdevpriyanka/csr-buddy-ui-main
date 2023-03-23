import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import getThumbnail from '@utils/thumbnails';
import { useState, useEffect } from 'react';
import Sticker from '@/components/Sticker';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'grid',
    gridTemplateAreas: `"img itemId"
                        "img desc"
                        "img metaData"`,
    gridTemplateColumns: `60px 1fr`,
    columnGap: theme.utils.fromPx(8),
  },
  img: {
    gridArea: 'img',
    alignSelf: 'center',
    width: '100%',
    maxHeight: theme.utils.fromPx(60),
    maxWidth: theme.utils.fromPx(60),
  },
  itemId: {
    gridArea: 'itemId',
    fontSize: theme.fonts.size.xs,
    color: theme.palette.gray.light,
  },
  desc: {
    gridArea: 'desc',
    fontSize: theme.fonts.size.md,
  },
  metaData: {
    gridArea: 'metaData',
  },
  qty: {
    fontSize: theme.fonts.size.xs,
    marginRight: theme.utils.fromPx(10),
  },
  itemException: {
    marginRight: theme.utils.fromPx(4),
  },
  giftCardDetailsButton: {
    background: 'none',
    border: 'none',
    padding: '0',
    color: theme.palette.blue.medium,
    cursor: 'pointer',
  },
}));

const RETURN_TYPES = {
  REFUND: 'REFUNDED',
  REPLACEMENT: 'REPLACEMENT',
  CONCESSION: 'CONCESSION',
};

const getExceptions = (returns = {}) => {
  const exceptions = [];
  if (Number.parseFloat(returns?.concessionAmountExisting?.value) > 0) {
    exceptions.push(RETURN_TYPES.CONCESSION);
  }
  if (returns?.refundQuantityExisting > 0) {
    exceptions.push(RETURN_TYPES.REFUND);
  }
  if (returns?.replacementQuantityExisting > 0) {
    exceptions.push(RETURN_TYPES.REPLACEMENT);
  }
  return exceptions;
};

const MultiItemProductDesc = ({
  item: {
    returns,
    isGiftCard,
    product,
    quantity,
    key: giftCardNumber,
    product: { name: productName },
  },
  showGiftCardDetailToggle,
  onGiftCardDetailToggle,
  discontinued,
  outOfStock,
}) => {
  const classes = useStyles();
  /* Gift card details override button */
  const [showGiftCardDetails, setShowGiftCardDetails] = useState(false);
  const exceptions = getExceptions(returns);

  useEffect(() => {
    onGiftCardDetailToggle(showGiftCardDetails);
  }, [showGiftCardDetails]);

  return (
    <div>
      <div className={classes.root}>
        <img
          className={classes.img}
          src={getThumbnail(product?.thumbnail)}
          alt={product.description}
        />
        <div className={classes.itemId}>ITEM #{product?.partNumber}</div>
        <div className={classes.desc}>
          {productName}
          {/* Giftcard items are keyed by the mask account number */}
          {isGiftCard && giftCardNumber && <div>{giftCardNumber}</div>}
        </div>
        <div className={classes.metaData}>
          {!isGiftCard && <span className={classes.qty}>Qty Ordered: {quantity}</span>}
          {exceptions.map((exception) => (
            <span key={exception} className={classes.itemException}>
              <Sticker>{exception}</Sticker>
            </span>
          ))}
          {outOfStock && (
            <span className={classes.itemException}>
              <Sticker type="red">{'OUT OF STOCK'}</Sticker>
            </span>
          )}
          {discontinued && (
            <span className={classes.itemException}>
              <Sticker type="default">{'DISCONTINUED'}</Sticker>
            </span>
          )}
          {showGiftCardDetailToggle && (
            <div>
              <button
                className={classes.giftCardDetailsButton}
                onClick={() => setShowGiftCardDetails(!showGiftCardDetails)}
              >
                {showGiftCardDetails ? 'Hide Details' : 'Show Details'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

MultiItemProductDesc.propTypes = {
  item: PropTypes.object.isRequired,
  showGiftCardDetailToggle: PropTypes.bool,
  onGiftCardDetailToggle: PropTypes.func,
  discontinued: PropTypes.bool,
  outOfStock: PropTypes.bool,
};

export default MultiItemProductDesc;
