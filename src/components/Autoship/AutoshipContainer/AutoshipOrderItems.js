import TooltipPrimary from '@/components/TooltipPrimary';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';

const useStyles = makeStyles((theme) => ({
  actionContainer: {
    marginBottom: '8px',
    '&:last-child': {
      marginBottom: '0px',
    },
  },
  unorderedList: {
    paddingLeft: theme.utils.fromPx(16),
    marginTop: theme.utils.fromPx(4),
    listStyleType: 'disc',
    '& li::marker': {
      fontSize: '75%',
    },
    '&:last-child': {
      marginBottom: '0px',
    },
  },
  itemActionDescription: {
    color: '#666666',
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '18px',
    fontFamily: 'Roboto',
    width: theme.utils.fromPx(225),
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '&:hover': {
      cursor: 'pointer',
      color: '#031657',
      fontWeight: 500,
      fontSize: '14px',
      lineHeight: '18px',
      fontFamily: 'Roboto',
    },
  },
  tooltipInfo: {
    fontSize: theme.utils.fromPx(12),
    '& > *:not(:last-child)': {
      marginBottom: theme.utils.fromPx(8),
    },
  },
}));

const AutoshipOrderItems = ({ items = [] }) => {
  const classes = useStyles();

  const toolTipInfo = (name) => {
    return (
      <div className={classes.tooltipInfo}>
        <div>{name}</div>
      </div>
    );
  };

  return (
    items &&
    (items || []).length > 0 &&
    items.map((item) => (
      <div key={item.id} data-testid={`order-items-${item.id}`} className={classes.actionContainer}>
        <ul className={classes.unorderedList}>
          <li>
            <TooltipPrimary title={toolTipInfo(item.product.name)}>
              <div
                data-testid={`order-item-product-${item.id}-${item.product.partNumber}`}
                className={classnames(classes.itemActionDescription, classes.textEllipsisContainer)}
              >
                <span>{item.product.name}</span>
              </div>
            </TooltipPrimary>
          </li>
        </ul>
      </div>
    ))
  );
};

AutoshipOrderItems.propTypes = {
  items: PropTypes.array,
};

export default AutoshipOrderItems;
