/* eslint-disable no-console */
import { format, parseISO, subDays } from 'date-fns';
// One day in milliseconds
export const oneDayInMilliseconds = 1000 * 60 * 60 * 24;

const dayMap = {
  0: 'Sunday',
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
};

const monthMap = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December',
};

export const includesTime = (date) => {
  return date.includes('T');
};

export const formatDeliveryDate = (deliveryDate) => {
  if (typeof deliveryDate === typeof undefined) {
    return 'Unknown';
  }
  const now = new Date();
  const expected = parseISO(deliveryDate);

  if (format(now, 'yyyy-MM-dd') === format(expected, 'yyyy-MM-dd')) {
    return `Today`;
  }

  return `${format(expected, 'eee, LLL d, yyyy')}`;
};

export const formatDeliveredDate = (deliveryDate, shippingStep) => {
  if (typeof deliveryDate === typeof undefined) {
    return 'Unknown';
  }

  const hasTimeData = includesTime(deliveryDate);
  const now = new Date();
  const expectedDateToFormat = hasTimeData ? deliveryDate : `${deliveryDate}`;
  const expected = new Date(expectedDateToFormat);

  let timeStr = '';
  if (hasTimeData) {
    const timing = shippingStep === 'DELIVERED' ? 'at' : 'by';
    timeStr = ` ${timing} ${format(expected, 'h:mm aaaa')}`;
  }

  if (format(now, 'yyyy-MM-dd') === format(expected, 'yyyy-MM-dd')) {
    return `Today${timeStr}`;
  }

  return `${format(expected, 'eee, LLL do')}${timeStr}`;
};

export const formatDate = (deliveryDateISO, showTime = true) => {
  if (!deliveryDateISO) return 'Unknown';
  let timeStr = '';
  const timeProvided = includesTime(deliveryDateISO);
  const deliveryDate = new Date(deliveryDateISO);

  if (showTime) {
    timeStr = timeProvided ? ` at ${format(deliveryDate, 'h:mm aaaa')}` : '';
  }

  return `${format(deliveryDate, 'L/d/yyyy')}${timeStr}`;
};

export const formatDateWithTime = (deliveryDateISO) => {
  if (!deliveryDateISO) return 'Unknown';
  const deliveryDate = new Date(deliveryDateISO);
  return `${format(deliveryDate, 'L/d/yyyy, h:mm aaaa')}`;
};

export const formatDateWithTimeNoTZ = (deliveryDateISO) => {
  if (!deliveryDateISO) return 'Unknown';
  const deliveryDate = new Date(deliveryDateISO);
  return `${format(deliveryDate, 'yyyy-MM-dd hh:mm:ss')}`;
};

//display only date
export const formatRescheduleDate = (deliveryDateISO) => {
  if (!deliveryDateISO) return 'Unknown';
  const deliveryDate = new Date(deliveryDateISO);

  return `${format(deliveryDate, 'yyyy-MM-dd')}`;
};

export const subtractDays = (date, days) => {
  if (!date) return null;
  return subDays(date, days);
};

export const formatDateYYYYMMDDIgnoreTime = (date) => {
  const formattedDate = format(date, 'yyyy-MM-dd');
  return formattedDate + 'T00:00:00';
};

export const formatDateYYYYMMDDTimeIgnoreTime = (date) => {
  if (!date) {
    return '';
  }
  return `${format(new Date(date), DATEFORMAT.DAYDATETIMETE)}`;
};

export const formatActivityDate = (activityDateISO) => {
  const now = new Date();
  const activityDate = new Date(activityDateISO);

  const isToday = activityDate.getDate() === now.getDate();
  const isYesterday = activityDate.getDate() === now.getDate() - 1;

  const timeStr = format(activityDate, 'h:mm aaaa');

  let dateStr;
  if (isToday) {
    dateStr = 'Today';
  } else if (isYesterday) {
    dateStr = 'Yesterday';
  } else {
    dateStr = activityDate.toLocaleDateString();
  }

  return `${timeStr} ${dateStr}`;
};

export const formatActivityContextEventDate = (eventDateISO) => {
  const eventDate = new Date(eventDateISO);
  let dateStr = format(eventDate, 'EEE, LLL d');
  let timeStr = format(eventDate, 'h:mm aa');

  return `${dateStr} (${timeStr} ${localTimezone()})`;
};

export const formatActivityEventDate = (eventDateISO) => {
  const eventDate = new Date(eventDateISO);
  let dateStr = format(eventDate, 'EEEE LLL d');
  let timeStr = format(eventDate, 'h:mm aaaa');
  return `${dateStr} at ${timeStr}`;
};

export const formatGiftCardDate = (giftCardDateISO) => {
  if (!giftCardDateISO) return '-';
  return format(new Date(giftCardDateISO), 'MM-dd-yy');
};

export const formatGiftCardDeliveryDate = (giftCardDeliveredDateString) => {
  if (!giftCardDeliveredDateString) return '-';

  const nums = giftCardDeliveredDateString.split('-');
  return nums[1] + '-' + nums[2] + '-' + nums[0].slice(-2);
};

export const formatShipmentInfoDate = (shipmentInfoDateISO) => {
  if (!shipmentInfoDateISO) return '';
  return format(new Date(shipmentInfoDateISO), 'M/d/yy');
};

export const getPetAge = (petBirthdayISO) => {
  if (!petBirthdayISO) {
    return;
  }

  const now = new Date();
  const birthday = new Date(petBirthdayISO);

  const years = now.getFullYear() - birthday.getFullYear();
  const months = now.getMonth() - birthday.getMonth();

  return { years, months };
};

const TimeUnits = {
  ONE_DAY: 1000 * 60 * 60 * 24,
};

export const getDayOfYear = (dateTimeISO) => {
  const now = new Date(dateTimeISO);
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start + (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
  const day = Math.floor(diff / TimeUnits.ONE_DAY);
  return Number.parseInt(day, 10);
};

export const cardExpiration = (expirationDate) => {
  const date = new Date(expirationDate);
  let month = date.getMonth() + 1;
  if (month.toString().length < 2) month = '0' + month;
  return `Exp ${month}/${date.getFullYear()}`;
};

// Checks if a card expired anytime before the current month.
export const isCardExpired = (month, year) => {
  const expMonth = Number(month);
  const expYear = Number(year);

  const today = new Date();
  const thisMonth = today.getMonth() + 1;
  const thisYear = today.getFullYear();

  return expYear < thisYear || (expYear === thisYear && expMonth < thisMonth);
};

export const getDayOfWeek = (date) => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return dayMap[date.getDay()];
};

export const getMonth = (date) => {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return monthMap[date.getMonth()];
};

export const localTimezone = () =>
  new Date().toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ')[2];

export const DATEFORMAT = {
  DAYDATETIMETZ: "EEE', 'MMM' 'd' at 'p'",
  DAYDATEYEARTIMETZ: "EEE', 'MMM' 'd', 'yyyy' ('p'",
  DAYDATETIMET: "EEEE' 'MMM.' 'do' 'yyyy'",
  DAYDATETIMETE: "EEE,' 'MMM' 'd,' 'yyyy'",
  MONTHDATETIMETZ: "MMM' 'd,' 'yyyy' at 'p'",
};

export const getMonthDateTimeTimezone = (date) => {
  if (!date) {
    console.error('A date was not provided to getMonthDateTimeTimezone()');
    return '';
  }
  return `${format(new Date(date), DATEFORMAT.MONTHDATETIMETZ)} ${localTimezone()}`;
};

export const getDayDateTimeTimezone = (date) => {
  if (!date) {
    return '';
  }
  return `${format(new Date(date), DATEFORMAT.DAYDATETIMETZ)} ${localTimezone()}`;
};

export const getDayDateYearTimeTimezone = (date) => {
  if (!date) {
    return '';
  }
  return `${format(new Date(date), DATEFORMAT.DAYDATEYEARTIMETZ)} ${localTimezone()})`;
};

export const getDayDateTimeTime = (date) => {
  if (!date) {
    return '';
  }
  return `${format(new Date(date), DATEFORMAT.DAYDATETIMET)}`;
};

export const getDayDateTime = (date) => {
  if (!date) {
    return '';
  }
  return `${format(new Date(date), DATEFORMAT.DAYDATETIMETZ)}`;
};

export const formatToUTC = (date) => {
  if (!date) return null;
  const utcDate = new Date(date);
  const month = ('0' + (utcDate.getUTCMonth() + 1)).toString().slice(-2);
  const day = ('0' + utcDate.getUTCDate()).toString().slice(-2);
  const year = utcDate.getUTCFullYear();
  const hours = ('0' + utcDate.getUTCHours()).toString().slice(-2);
  const minutes = ('0' + utcDate.getUTCMinutes()).toString().slice(-2);
  const seconds = ('0' + utcDate.getUTCSeconds()).toString().slice(-2);
  return year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds;
};
