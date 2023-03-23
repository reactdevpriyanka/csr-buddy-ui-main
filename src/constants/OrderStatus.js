import theme from '@/theme';

export const OrderStatus = {
  PAYMENT_REQUIRES_REVIEW: 'PAYMENT_REQUIRES_REVIEW',
  BACKORDERED: 'BACKORDERED',
  READY_TO_RELEASE: 'READY_TO_RELEASE',
  DEPOSITED: 'DEPOSITED',
  CSR_EDIT: 'CSR_EDIT',
  SUBMITTED: 'SUBMITTED',
  NO_INVENTORY: 'NO_INVENTORY',
  PAYMENT_INITIATED: 'PAYMENT_INITIATED',
  APPROVAL_DENIED: 'APPROVAL_DENIED',
  PENDING: 'PENDING',
  RELEASED: 'RELEASED',
  SHIPPED: 'SHIPPED',
  COMPLETED: 'COMPLETED',
  WAITING_FOR_APPROVAL: 'WAITING_FOR_APPROVAL',
  CANCELED: 'CANCELED',
  SUBMITTED_INCOMPLETE: 'SUBMITTED_INCOMPLETE',
  UNKNOWN: 'UNKNOWN',
};

export const searchableOrderStatuses = {
  PAYMENT_REQUIRES_REVIEW: 'A - Payment Requires Review',
  BACKORDERED: 'B - Backordered',
  READY_TO_RELEASE: 'C - Ready To Release',
  DEPOSITED: 'D - Deposited',
  CSR_EDIT: 'E - CSR Edit',
  SUBMITTED: 'I - Submitted',
  NO_INVENTORY: 'L - No Inventory',
  PAYMENT_INITIATED: 'M - Payment Initiated',
  // APPROVAL_DENIED: 'Approval Denied',
  // PENDING: 'Pending',
  RELEASED: 'R - Released',
  SHIPPED: 'S - Shipped',
  // WAITING_FOR_APPROVAL: 'Waiting for Approval',
  CANCELED: 'X - Canceled',
  // COMPLETED: 'C - Completed',
  SUBMITTED_INCOMPLETE: 'Submitted Incomplete',
  UNKNOWN: 'Unknown',
};

export const statusColors = {
  PAYMENT_REQUIRES_REVIEW: theme.palette.error.main,
  BACKORDERED: theme.palette.blue.main,
  READY_TO_RELEASE: theme.palette.blue[600],
  DEPOSITED: theme.palette.blue[600],
  CSR_EDIT: theme.palette.error.main,
  SUBMITTED: theme.palette.gray[500],
  NO_INVENTORY: theme.palette.error.main,
  PAYMENT_INITIATED: theme.palette.blue.main,
  APPROVAL_DENIED: theme.palette.error.main,
  PENDING: theme.palette.gray[500],
  RELEASED: theme.palette.blue[600],
  SHIPPED: theme.palette.blue[600],
  WAITING_FOR_APPROVAL: theme.palette.gray[500],
  CANCELED: theme.palette.blue.main,
  COMPLETED: theme.palette.green.medium,
  SUBMITTED_INCOMPLETE: theme.palette.gray[500],
  UNKNOWN: theme.palette.gray[500],
};

export const convertOrderStatus = (status) => {
  return searchableOrderStatuses?.[status] ? searchableOrderStatuses[status] : status;
};

export const getOrderStatusIndicator = (status) => {
  return searchableOrderStatuses?.[status] ? searchableOrderStatuses[status].charAt(0) : '?';
};
