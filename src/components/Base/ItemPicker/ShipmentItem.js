/* eslint-disable jsx-a11y/click-events-have-key-events */
import PropTypes from 'prop-types';
import cn from 'classnames';
import thumbnailUrl from '@utils/thumbnails';
import { makeStyles } from '@material-ui/core/styles';

const MAX_PRODUCT_SIZE = 80;

const useStyles = makeStyles((theme) => ({
  root: {
    border: `1px solid #f2f2f2`,
    borderRadius: theme.utils.fromPx(8),
    display: 'inline-grid',
    gridTemplateColumns: `${theme.utils.fromPx(MAX_PRODUCT_SIZE)} auto`,
    margin: `0 0 ${theme.utils.fromPx(16)} 0`,
    cursor: 'pointer',
    '&.selected': {
      border: `1px solid rgba(18, 140, 237, 0.5)`,
      background: `rgba(18, 140, 237, 0.25)`,
    },
    '&.disabled': {
      opacity: '0.6',
      pointerEvents: 'none',
      cursor: 'default',
    },
  },
  details: {
    padding: theme.utils.fromPx(10),
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
  bold: {
    ...theme.fonts.body.medium,
    color: '#121212',
    fontSize: theme.fonts.size.sm,
  },
  name: {
    height: theme.utils.fromPx(53),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    margin: `0 0 ${theme.utils.fromPx(8)}`,
  },
  total: {
    margin: `0 0 ${theme.utils.fromPx(5)}`,
    lineHeight: theme.utils.fromPx(16),
  },
  quantity: {
    color: theme.palette.gray.medium,
    fontSize: theme.fonts.size['2xs'],
    margin: 0,
    textTransform: 'uppercase',
  },
}));

const ShipmentItem = ({
  name,
  total,
  thumbnail,
  quantity,
  selected = false,
  disabled = false,
  onClick = () => null,
}) => {
  const classes = useStyles();

  return (
    <div
      className={cn([classes.root, selected && 'selected', disabled && 'disabled'])}
      onClick={onClick}
    >
      <figure className={classes.figure}>
        <img src={thumbnailUrl(thumbnail)} alt="" />
      </figure>
      <div className={classes.details}>
        <p className={cn([classes.name, classes.bold])}>{name}</p>
        <p className={cn([classes.total, classes.bold])}>{total}</p>
        <p className={cn([classes.quantity])}>{quantity}</p>
      </div>
    </div>
  );
};

ShipmentItem.propTypes = {
  name: PropTypes.node,
  total: PropTypes.node,
  thumbnail: PropTypes.string,
  quantity: PropTypes.string,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default ShipmentItem;
