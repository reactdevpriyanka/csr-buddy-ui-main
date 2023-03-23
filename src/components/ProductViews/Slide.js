import PropTypes from 'prop-types';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import Stars from '@components/StarRating';
import PlusIcon from '@icons/plus.svg';
import CircleCheckIcon from '@icons/check-circle.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    background: 'transparent',
    border: `1px solid #f2f2f2`,
    borderRadius: `${theme.utils.fromPx(8)} 0 0 ${theme.utils.fromPx(8)}`,
    display: 'grid',
    gridTemplateColumns: `${theme.utils.fromPx(125)} 1fr`,
    gridTemplateRows: 'auto',
    padding: 0,
    textAlign: 'left',
    width: theme.utils.fromPx(325),
    overflow: 'hidden',
    '&.selected': {
      border: `1px solid ${theme.palette.blue.light}`,
    },
  },
  figure: {
    background: '#f7f7f7',
    display: 'inline-grid',
    justifyContent: 'center',
    alignContent: 'center',
    width: '100%',
    padding: theme.utils.fromPx(16),
    margin: 0,
  },
  img: {
    height: 'auto',
    width: 'auto',
    maxHeight: theme.utils.fromPx(85),
    maxWidth: '100%',
  },
  info: {
    padding: theme.utils.fromPx(8),
  },
  name: {
    ...theme.fonts.body.medium,
    fontSize: theme.utils.fromPx(14),
    lineHeight: theme.utils.fromPx(18),
    margin: `0 0 ${theme.utils.fromPx(8)}`,
    height: theme.utils.fromPx(36),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  price: {
    ...theme.fonts.body.medium,
    fontSize: theme.utils.fromPx(14),
    lineHeight: theme.utils.fromPx(16),
    margin: `0 0 ${theme.utils.fromPx(6)}`,
  },
  strikethrough: {
    color: theme.palette.gray.light,
    display: 'inline-block',
    fontWeight: '400',
    margin: `0 0 0 ${theme.utils.fromPx(7)}`,
    textDecoration: 'line-through',
  },
  sku: {
    ...theme.fonts.body.normal,
    color: theme.palette.gray.light,
    fontSize: theme.utils.fromPx(10),
    margin: 0,
  },
  starRatings: {
    background: 'white',
  },
  footer: {
    display: 'grid',
    gridTemplateColumns: `1fr ${theme.utils.fromPx(24)}`,
    alignItems: 'center',
  },
  plusButton: {
    border: '1px solid #ddd',
    borderRadius: '100%',
    background: 'transparent',
    display: 'inline-flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    margin: 0,
    width: theme.utils.fromPx(24),
    height: theme.utils.fromPx(24),
    transition: 'border 0.2s, color 0.2s',
    '&.selected': {
      border: `1px solid transparent`,
      color: theme.palette.blue.light,
    },
  },
}));

const Slide = ({
  name = '',
  offerPrice = '',
  onClick = () => {},
  rating = 0,
  ratingCount = 0,
  root: Root = 'button',
  selected = false,
  sku,
  strikethroughPrice = '',
  thumbnailSrc,
}) => {
  const classes = useStyles();

  return (
    <Root
      className={cn([classes.root, selected && 'selected'])}
      onClick={onClick}
      data-testid="product:slide"
    >
      <figure className={classes.figure}>
        <img src={thumbnailSrc} alt="" className={classes.img} />
      </figure>
      <div className={classes.info}>
        <h3 className={classes.name} title={name}>
          {name}
        </h3>
        <p className={classes.price}>
          {offerPrice}
          <span className={classes.strikethrough}>{strikethroughPrice}</span>
        </p>
        <p className={classes.sku}>{`SKU ${sku}`}</p>
        <footer className={classes.footer}>
          <Stars percentage={rating} label={ratingCount} />
          <span className={cn([classes.plusButton, selected && 'selected'])}>
            {selected ? <CircleCheckIcon /> : <PlusIcon />}
          </span>
        </footer>
      </div>
    </Root>
  );
};

Slide.propTypes = {
  name: PropTypes.string,
  offerPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onClick: PropTypes.func,
  rating: PropTypes.number,
  ratingCount: PropTypes.number,
  root: PropTypes.elementType,
  selected: PropTypes.bool,
  sku: PropTypes.string,
  strikethroughPrice: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  thumbnailSrc: PropTypes.string,
};

export default Slide;
