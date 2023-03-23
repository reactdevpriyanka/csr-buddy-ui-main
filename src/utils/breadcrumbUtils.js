import { RootNavTags, searchableRootNavs } from '@/constants/breadcrumbConst';

export const getBreadcrumbByRootTag = ({ tag, customerId }) => {
  const crumbObj = searchableRootNavs[tag];

  const crumb = {
    id: crumbObj.id,
    title: crumbObj.title,
    link: `/customers/${customerId}/${tag}`,
  };

  return crumb;
};

export const isCrumbCoreNav = (breadcrumb) => {
  return RootNavTags.includes(breadcrumb.id);
};

export const isCrumbCoreNavByTag = (tag) => {
  const crumbObj = searchableRootNavs[tag];

  return crumbObj != null;
};
