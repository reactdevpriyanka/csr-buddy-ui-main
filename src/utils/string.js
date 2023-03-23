/* Returns a string with all words capitalized.
  "hello this is a string" => "Hello This Is A String" */
export const capitalize = (val) => {
  if (!val) return '';

  val = val.trim();
  val = val.replace(/  +/g, ' ');

  const words = val.split(' ');

  const capitalized = [];
  for (const word of words) {
    capitalized.push(`${word[0].toUpperCase()}${word.slice(1).toLowerCase()}`);
  }
  return capitalized.join(' ');
};

/**
 * @param "ORDER_CANCELED"
 * @returns "Order Canceled"
 */
export const snakeCaseToTitleCase = (val) => {
  if (!val) return '';
  return capitalize(val.trim().toLowerCase().replace(/_/g, ' '));
};

/**
 *
 * @param "Order Cancled"
 * @returns "ORDER_CANCELED"
 */
export const titleCaseToSnakeCase = (val) => {
  if (!val) return '';
  val = val.replace(' ', '_');
  val = val.toUpperCase();
  return val;
};

/**
 *
 * @param "Bruce Springsteen"
 * @returns "Bruce S."
 */
export const abbreviateLastName = (val) => {
  if (!val) return '';
  val = val.split(' ');
  val = val[0] + ' ' + val[1].charAt(0) + '.';
  return val;
};

/**
 * @param {String} input  Any stringified number, int or float. e.g. "123.40000"
 * @returns {String} A formatted USD currency string e.g. $123.40
 */
export const dollarFormat = (val = '') => {
  const num = Number.parseFloat(`${val}`.replace(/[^\d.-]/g, ''));
  if (Number.isNaN(num)) {
    throw new TypeError('dollarFormat parameter must be float parseable');
  }
  return `$${num.toFixed(2)}`;
};

/**
 * @param {String} val  Any stringified number, int or float. e.g. "123.40"
 * @param {String} currency represents which type of currency to display.  Defaulted to USD. e.g. "123.40"
 * @returns {String} A formatted currency string based on the supplied currency e.g. $123.40
 */
export const currencyFormatter = (val, local = 'en-US', currency = 'USD') => {
  const result = Number.parseFloat(val).toLocaleString('en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
  if (Number.isNaN(result)) {
    throw new TypeError('currencyFormatter parameter must be float parseable');
  }
  return result;
};

/**
 * @param {String} key A string representing the key that is used in Athena
 * @param {String} fallback String used as a fallback if the key isn't found in Athena
 * @param {Array} substitutions Array of strings used to dynamically replace from string retrieved from Athena
 * @param {Function} getLang The useAthena method used to get strings from Athena
 * @returns {String} A formatted string with all of it's dynamic values replaced if needed
 */
export const getDynamicString = ({ key = '', fallback = '', substitutions = [], getLang }) => {
  if (!getLang) return fallback;

  const result = getLang(key, { fallback: fallback, substitutions: substitutions });

  return result;
};

export const formatPhoneNumber = (phoneNumber) => {
  var cleaned = ('' + phoneNumber).replace(/\D/g, '');
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return null;
};

export const removeUnderscores = (str) => {
  if (!str) return '';
  return str.replace(/_/g, ' ');
};
