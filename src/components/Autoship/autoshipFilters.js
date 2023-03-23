import { ORDER_STATUS } from '@components/Order/utils';
export const AUTOSHIP_MENUITEM_ALL = 'All';

export const isActiveAutoship = (act) => act?.data?.order?.status === ORDER_STATUS.ACTIVE;

export const isOrderCancelled = (act) => act?.data?.order?.status === ORDER_STATUS.CANCELED;

export const AUTOSHIP_FILTERS = {
  [AUTOSHIP_MENUITEM_ALL]: (o) => o,
    Active:isActiveAutoship,
    Cancelled: isOrderCancelled,
};