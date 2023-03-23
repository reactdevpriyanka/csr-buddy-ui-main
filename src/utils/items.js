/** Generates a dictionary line-items for
 * lookup within individual shipments when rendering
 * items referenced by ID */
export const generateItemMap = (lineItems) => {
  const itemMap = {};
  for (let j in lineItems) {
    const item = lineItems[j];
    itemMap[item.id] = { ...item };
  }
  return itemMap;
};

/** Adds the line-item dictionary as well as a createdAt property to each group of activities */
export const addItemMapToActivities = (activities) => {
  for (let i in activities) {
    const activity = activities[i];
    if (!activity.data) {
      activity.data = {
        order: {
          itemMap: [],
          timePlaced: new Date(),
          total: '0.00',
        },
      };
      continue;
    }
    activities[i].createdAt = new Date(activities[i].createdAt);
    if (activities[i].data.order) {
      const { lineItems } = activities[i].data.order;
      const itemMap = generateItemMap(lineItems);
      activities[i].data.order.itemMap = itemMap;
    }
  }
  return activities;
};

export const mapAutoshipsToOrders = (activities) => {
  const autoships = {};
  for (const activity of activities) {
    if (activity.type.startsWith('AUTOSHIP')) {
      autoships[activity.autoship.id] = [];
    }
    if (activity.type.startsWith('ORDER')) {
      const { subscriptionInfos } = activities.order;
      for (const subscription of subscriptionInfos) {
        if (subscription.parentOrderId in autoships) {
          autoships[subscription.parentOrderId].push(activity);
        } else if (subscription.subscriptionId in autoships) {
          autoships[subscription.subscriptionId].push(activity);
        } else {
          autoships[subscription.parentOrderId] = [activity];
        }
      }
    }
  }
  return autoships;
};
