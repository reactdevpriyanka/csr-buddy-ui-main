import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import cn from 'classnames';
import TooltipPrimary from '@/components/TooltipPrimary';
import InfoIcon from '@/components/Icons/info.outline-circle.svg';
import { ITEM_INVENTORY_STATUSES } from '@/constants/itemInventoryStatuses';
import { ITEM_FULFILLMENT_STATUSES } from '@/constants/itemFulfillmentStatuses';

const useStyles = makeStyles((theme) => ({
  label: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '15px',
    color: '#666666',
  },
  text: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '18px',
    color: '#121212',
  },
  infoIcon: {
    marginLeft: theme.utils.fromPx(3),
    height: '100%',
    verticalAlign: 'bottom',
    '& path': {
      fill: theme.palette.primary.alternate,
    },
  },
  tableComponent: {
    display: 'grid',
    textAlign: 'right',
  },
  canceled: {
    ...theme.utils.disabled,
    color: theme.palette.gray['200'],
  },
}));

const OrderDetailsComponentLabel = ({
  name,
  value,
  isDisabled,
  row,
  isItemSpreadAcrossPackages,
}) => {
  const classes = useStyles();

  const colorMap = {
    // InventoryStatus
    [ITEM_INVENTORY_STATUSES.ALLOCATED]: '#006B2B',
    [ITEM_INVENTORY_STATUSES.AVAILABLE]: '#121212',
    [ITEM_INVENTORY_STATUSES.BACKORDERABLE]: '#121212',
    [ITEM_INVENTORY_STATUSES.BACKORDERED]: '#121212',
    [ITEM_INVENTORY_STATUSES.NOT_ALLOCATED]: '#BC2848',
    // FulfillmentStatus
    [ITEM_FULFILLMENT_STATUSES.RELEASED]: '#006B2B',
    [ITEM_FULFILLMENT_STATUSES.SHIPPED]: '#006B2B',
    [ITEM_FULFILLMENT_STATUSES.NOT_RELEASED]: '#BC2848',
    [ITEM_FULFILLMENT_STATUSES.HOLD]: '#121212',
  };

  return (
    <div className={cn(classes.tableComponent, isDisabled && classes.canceled)}>
      <span className={classes.label}>
        {name}
        {(name === 'Discount' || name === 'Total') && isItemSpreadAcrossPackages && (
          <TooltipPrimary
            placement="top"
            title={
              name === 'Discount'
                ? `Total discount for all items with SKU #${row?.product?.partNumber ?? ' N/A'}`
                : `Total for all items with SKU #${row?.product?.partNumber ?? ' N/A'}`
            }
          >
            <span>
              <InfoIcon className={classes.infoIcon} />
            </span>
          </TooltipPrimary>
        )}
      </span>
      {name === `Status` ? (
        <span
          data-testid="orderDetailsViewPackageProductsStatus"
          className={classes.text}
          style={{ color: colorMap?.[row?.inventoryStatus || row?.fulfillmentStatus] }}
        >
          {value}
          <br />
        </span>
      ) : (
        <span className={classes.text}>
          {value} <br />
        </span>
      )}
    </div>
  );
};

OrderDetailsComponentLabel.propTypes = {
  name: PropTypes.string,
  value: PropTypes.object,
  isDisabled: PropTypes.bool,
  row: PropTypes.object,
  isItemSpreadAcrossPackages: PropTypes.bool,
};

export default OrderDetailsComponentLabel;
