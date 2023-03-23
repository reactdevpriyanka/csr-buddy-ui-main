import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import useGwfContext from '@/hooks/useGwfContext';
import ReturnItem from './ReturnItem';

const useStyles = makeStyles((theme) => ({
  root: {
    width: theme.utils.fromPx(350),
    marginBottom: theme.utils.fromPx(20),
    gridRowStart: 1,
    gridColumnStart: 1,
    gridRowEnd: 'span 500',
  },
  itemBox: {
    padding: theme.utils.fromPx(24),
    backgroundColor: 'white',
    border: `1px solid #d5d5d5`,
    borderRadius: theme.utils.fromPx(4),
    overflow: 'hidden',
    position: 'sticky',
    top: theme.utils.fromPx(20),
    '& $shipment:not(:first-child)': {
      marginTop: theme.utils.fromPx(24),
    },
  },
  headingLabel: {
    fontSize: theme.utils.fromPx(18),
    color: theme.palette.primary.main,
    marginBottom: theme.utils.fromPx(4),
  },
  label: {
    color: theme.palette.primary.main,
    paddingLeft: theme.utils.fromPx(16),
    marginBottom: theme.utils.fromPx(8),
  },
  shipment: {},
}));

const ReturnItemList = ({ lineItems = [], shipments = [] }) => {
  const classes = useStyles();

  const { returnDestinations = [] } = useGwfContext();

  const includesShippingConcession = useMemo(() => {
    return lineItems.some((lineItem) => lineItem?.orderLineItemId === 'shipping');
  }, [lineItems]);

  if (includesShippingConcession) {
    lineItems = lineItems.filter(({ orderLineItemId, concession }) => {
      return concession?.productConcession > 0 || orderLineItemId === 'shipping';
    });
  }

  // Iterates through the shipments and adds items to be rendered in cases where there are
  // items with the same ID across multiple shipments. Ultimately adheres to the returnQuantity
  // at the order level of an item so we never exceed that value
  const itemsToRender = useMemo(() => {
    let itemsSeen = {}; // used as a memo to determine how many items of each ID we have already seen from each shipment
    let items = [];
    const validIds = lineItems.map((lineItem) => lineItem?.orderLineItemId) || [];

    for (const shipment of shipments) {
      let validItemsToRender = [];

      for (const shipmentItem of shipment) {
        if (validIds.includes(shipmentItem?.externalId)) {
          let numberofItemsBeingReturned = 0;
          let foundItem = lineItems.find(
            (lineItem) => lineItem?.orderLineItemId === shipmentItem?.externalId,
          );
          foundItem = { ...foundItem, ...shipmentItem };

          if (
            !!itemsSeen?.[shipmentItem.externalId] &&
            itemsSeen[shipmentItem.externalId] < foundItem.returnQuantity
          ) {
            while (
              numberofItemsBeingReturned <
                foundItem.returnQuantity - itemsSeen[shipmentItem.externalId] &&
              numberofItemsBeingReturned < foundItem.quantityInShipment
            ) {
              numberofItemsBeingReturned += 1;
            }
          } else if (!!!itemsSeen?.[shipmentItem.externalId]) {
            itemsSeen[shipmentItem.externalId] = 0;

            while (
              numberofItemsBeingReturned < foundItem.returnQuantity &&
              numberofItemsBeingReturned < foundItem.quantityInShipment
            ) {
              numberofItemsBeingReturned += 1;
            }
          }

          if (numberofItemsBeingReturned > 0) {
            foundItem['numberofItemsBeingReturned'] = numberofItemsBeingReturned;
            itemsSeen[shipmentItem.externalId] += numberofItemsBeingReturned;
            validItemsToRender.push(foundItem);
          }
        }
      }

      items.push(validItemsToRender);
    }

    return items;
  }, [lineItems, shipments]);

  const locationMap = useMemo(() => {
    let map = {};
    for (const [location, value] of Object.entries(returnDestinations)) {
      for (const lineItemId of value?.lineItemIds) {
        map[lineItemId] = `${location}, ${value?.destination?.address?.city}`;
      }
    }

    return map;
  }, [returnDestinations]);

  return (
    <div className={classes.root}>
      <div className={classes.itemBox}>
        {itemsToRender?.map((shipment, index) => {
          return shipment?.length > 0 ? (
            <div className={classes.shipment}>
              <div className={classes.headingLabel}>Item(s) from shipment {index + 1}</div>
              {shipment?.map((item) => (
                <ReturnItem
                  key={item?.orderLineItemId}
                  thumbnail={item.product?.thumbnail}
                  name={item.product?.name}
                  partNumber={item.product?.partNumber}
                  returnQuantity={item.numberofItemsBeingReturned}
                  isShipping={item.orderLineItemId === 'shipping'}
                  sendItemBack={item?.sendItemBack}
                  returnDestination={locationMap?.[item.orderLineItemId]}
                  totalQuantity={item?.totalQuantity}
                  multipleItems={lineItems.length > 1}
                />
              ))}
            </div>
          ) : null;
        })}
        {lineItems
          ?.filter((lineItem) => lineItem?.orderLineItemId === 'shipping')
          ?.map((item) => (
            <div key={`${item.orderLineItemId}-${item.product?.name}`} className={classes.shipment}>
              <ReturnItem
                thumbnail={item.product?.thumbnail}
                name={item.product?.name}
                partNumber={item.product?.partNumber}
                returnQuantity={item.numberofItemsBeingReturned}
                isShipping={true}
                sendItemBack={item?.sendItemBack}
                returnDestination={locationMap?.[item.orderLineItemId]}
                totalQuantity={item?.totalQuantity}
                multipleItems={lineItems.length > 1}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

ReturnItemList.propTypes = {
  lineItems: PropTypes.array,
  shipments: PropTypes.array,
};

export default ReturnItemList;
