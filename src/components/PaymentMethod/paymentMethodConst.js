import _ from 'lodash';
import paymentIcons from '../PaymentIcons/PaymentIcons';

// see PaymentMethodType enum in OMS
export const PaymentMethodTypeConst = {
  // card.type
  AMEX: 'AMEX',
  DISCOVER: 'DISCOVER',
  MASTERCARD: 'MASTERCARD',
  VISA: 'VISA',
  GIFTCARD: 'GIFTCARD',
  GIFT_CARD: 'GIFT_CARD',

  // service.serviceName
  APPLEPAY: 'APPLEPAY',
  APPLE_PAY: 'APPLE_PAY',
  PAYPAL: 'PAYPAL',
  PREPAY: 'PREPAY',

  GOOGLEPAY: 'GOOGLEPAY',
  GOOGLE_PAY: 'GOOGLE_PAY',
  ACCOUNTBALANCE: 'ACCOUNTBALANCE',
  ACCOUNT_BALANCE: 'ACCOUNT_BALANCE',
  UNKNOWN: 'UNKNOWN',
};

export const PaymentMethodTypeLabels = {
  // card.type
  [PaymentMethodTypeConst.AMEX]: 'Amex',
  [PaymentMethodTypeConst.DISCOVER]: 'Discover',
  [PaymentMethodTypeConst.MASTERCARD]: 'Master Card',
  [PaymentMethodTypeConst.VISA]: 'Visa',
  [PaymentMethodTypeConst.GIFTCARD]: 'Gift Card',
  [PaymentMethodTypeConst.GIFT_CARD]: 'Gift Card',

  // service.serviceName
  [PaymentMethodTypeConst.APPLEPAY]: 'ApplePay',
  [PaymentMethodTypeConst.APPLE_PAY]: 'ApplePay',
  [PaymentMethodTypeConst.PAYPAL]: 'PayPal',
  [PaymentMethodTypeConst.PREPAY]: 'Prepay',

  [PaymentMethodTypeConst.GOOGLEPAY]: 'Google Pay',
  [PaymentMethodTypeConst.GOOGLE_PAY]: 'Google Pay',
  [PaymentMethodTypeConst.ACCOUNTBALANCE]: 'Account Balance',
  [PaymentMethodTypeConst.ACCOUNT_BALANCE]: 'Account Balance',
  [PaymentMethodTypeConst.UNKNOWN]: 'Unknown payment type',
};

export const getPaymentIcon = (type) => {
  return paymentIcons[type] || paymentIcons[PaymentMethodTypeConst.UNKNOWN];
};

export const getPaymentType = (type) => {
  return PaymentMethodTypeConst[type] || PaymentMethodTypeConst[PaymentMethodTypeConst.UNKNOWN];
};

export const getPaymentTypeLabel = (type) => {
  return PaymentMethodTypeLabels[type] || PaymentMethodTypeLabels[PaymentMethodTypeConst.UNKNOWN];
};

export const isUnknownPaymentType = (type) => {
  return _.isNull(PaymentMethodTypeConst[type]);
};

export default PaymentMethodTypeConst;
