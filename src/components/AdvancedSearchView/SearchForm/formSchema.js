import { format, parseISO, subDays } from 'date-fns';

let today = new Date();
let oneDayAgo = subDays(today, 1);

const initialValues = {
  orderId: '',
  logonId: '',
  status: '',
  name: '',
  address: '',
  city: '',
  zip: '',
  email: '',
  phone: '',
  partNumber: '',
  blocked: '',
  blockReason: '',
  fulfillmentCenter: '',
  account: '',
  paymentId: '',
  paypalEmail: '',
  ipAddress: '',
  timePlacedFrom: format(parseISO(oneDayAgo.toISOString()), 'yyyy-MM-dd') + 'T00:00:00',
  timePlacedTo: format(parseISO(today.toISOString()), 'yyyy-MM-dd') + 'T23:59:59',
  timeUpdatedFrom: '',
  timeUpdatedTo: '',
};

export default initialValues;
