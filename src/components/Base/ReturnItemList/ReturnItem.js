import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import thumbnailUrl from '@utils/thumbnails';
import Sticker from '@/components/Sticker';

const MAX_PRODUCT_SIZE = 60;

const useStyles = makeStyles((theme) => ({
  container: {
    '&:not(:last-child)': {
      marginBottom: theme.utils.fromPx(16),
    },
  },
  card: {
    border: `1px solid #f2f2f2`,
    backgroundColor: '#FAFAFA',
    borderRadius: theme.utils.fromPx(8),
  },
  itemGrid: {
    display: 'inline-grid',
    gridTemplateColumns: `${theme.utils.fromPx(MAX_PRODUCT_SIZE)} auto`,
    padding: `0 ${theme.utils.fromPx(4)}`,
  },
  figure: {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: theme.utils.fromPx(MAX_PRODUCT_SIZE),
    height: theme.utils.fromPx(120),
    padding: 0,
    margin: 0,
    '& > img': {
      width: '100%',
      height: 'auto',
    },
  },
  details: {
    padding: theme.utils.fromPx(10),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  name: {
    height: theme.utils.fromPx(40),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    margin: `0`,
    color: theme.palette.gray.dark,
    fontSize: theme.fonts.size.sm,
    whiteSpace: 'initial',
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
  },
  quantity: {
    color: theme.palette.gray.light,
    fontSize: theme.utils.fromPx(12),
    margin: 0,
    float: 'left',
    paddingTop: theme.utils.fromPx(4),
  },
  partNumber: {
    margin: 0,
    fontSize: theme.fonts.size['xs'],
    color: theme.palette.gray.light,
  },
  shipping: {
    fontSize: theme.fonts.size.md,
    textAlign: 'center',
    padding: theme.utils.fromPx(20),
  },
  sendBack: {
    float: 'right',
    color: theme.palette.yellow.medium,
  },
  destination: {
    fontSize: theme.utils.fromPx(12),
    lineHeight: theme.utils.fromPx(15),
    paddingLeft: theme.utils.fromPx(16),
    color: '#121212',
  },
}));

const ReturnItem = ({
  thumbnail,
  name,
  totalQuantity,
  returnQuantity,
  partNumber,
  isShipping,
  shipmentNumber = 'n/a',
  sendItemBack,
  returnDestination,
  multipleItems = false,
}) => {
  const classes = useStyles();

  if (isShipping) {
    return (
      <div className={`${classes.card}`}>
        <div className={classes.shipping}>Shipping</div>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <div className={`${classes.card} ${classes.itemGrid}`}>
        <figure className={classes.figure}>
          {thumbnail && <img src={thumbnailUrl(thumbnail)} alt="" />}
        </figure>
        <div className={classes.details}>
          {partNumber && <p className={classes.partNumber}>ITEM #{partNumber}</p>}
          {name && <p className={classes.name}>{name} </p>}
          {returnQuantity && totalQuantity && (
            <span className={classes.quantity}>
              <span>Qty: {returnQuantity}</span>
              {<span>/{totalQuantity}</span>}
              {sendItemBack && (
                <span className={classes.sendBack}>
                  <Sticker>SEND BACK</Sticker>
                </span>
              )}
            </span>
          )}
        </div>
      </div>
      {sendItemBack && multipleItems && (
        <span className={classes.destination}>Return Destination: {returnDestination}</span>
      )}
    </div>
  );
};

ReturnItem.propTypes = {
  thumbnail: PropTypes.string,
  name: PropTypes.string,
  totalQuantity: PropTypes.number,
  returnQuantity: PropTypes.number,
  partNumber: PropTypes.string,
  isShipping: PropTypes.bool,
  shipmentNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  sendItemBack: PropTypes.bool,
  returnDestination: PropTypes.string,
  multipleItems: PropTypes.bool,
};

export default ReturnItem;
