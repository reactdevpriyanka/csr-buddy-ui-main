export const processActivities = (chewyEnv, activities) => {
  for (const activity of activities) {
    if (activity.data.order) {
      activity.data.order.detailsLink = `https://cs-platform.csbb.${chewyEnv}.chewy.com/orders/${activity.data.order.id}`;
    }
    if (activity.data.autoship) {
      activity.data.autoship.action = `https://cs-platform.csbb.${chewyEnv}.chewy.com/subscriptions/${activity.data.autoship.id}`;
    }
  }
  return activities;
};
