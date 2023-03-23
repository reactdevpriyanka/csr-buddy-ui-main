export const RootNavTags = ['activityFeed', 'autoship', 'orderReturns', 'healthcare'];

export const RootNavKeys = {
  activity: 'activity',
  autoship: 'autoship',
  'order-returns': 'order-returns',
  healthcare: 'healthcare',
};

export const searchableRootNavs = {
  activity: { id: 'activityFeed', title: 'Activity Feed' },
  autoship: { id: 'autoship', title: 'Autoship' },
  'order-returns': { id: 'orderReturns', title: 'Returns' },
  healthcare: { id: 'healthcare', title: 'Healthcare' },
};

export const DefaultBreadcrumbContext = {
  //default values
  setBreadcrumbs: () => {},
  addBreadcrumb: () => {},
  resetBreadcrumbs: () => {},
  breadcrumbs: [],
};
