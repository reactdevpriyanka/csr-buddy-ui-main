/* UI Order filters that can be run on a single activity from customer api activities */

import { ORDER_ATTRIBUTE, ORDER_STATUS } from '@components/Order/utils';
export const MENUITEM_ALL = 'All';
export const MENUITEM_AUTOSHIP = 'Autoships';

export const isPrescription = (act) =>
  (act?.data?.order?.orderAttributes || []).includes(ORDER_ATTRIBUTE.PRESCRIPTION);

/* should alternatively be able to rely on presence of subscriptionId
//activity.data.order.subscriptionInfos[0].subscriptionId */
export const isAutoship = (act) =>
  (act?.data?.order?.orderAttributes || []).includes(ORDER_ATTRIBUTE.AUTOSHIP);

export const isReturnAppeasements = (act, { appeasements }) =>
  appeasements.hasOwnProperty(act?.data?.order?.id);

export const isReturnLineItem = (act) => (act?.data?.order?.returnItems || []).length > 0;

export const isOrderCancelled = (act) => act?.data?.order?.status === ORDER_STATUS.CANCELED;

export const ACTIVITYFEED_FILTERS = {
  [MENUITEM_ALL]: (o) => o,
  Returns: (o, { appeasements }) =>
    isReturnAppeasements(o, { appeasements }) || isReturnLineItem(o),
  [MENUITEM_AUTOSHIP]: isAutoship,
  Cancellations: isOrderCancelled,
  'Prescription Items': isPrescription,
};
