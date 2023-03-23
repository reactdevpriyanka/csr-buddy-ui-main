/**
 * Remove any null / undefined / empty string values coming out of the query params
 * @param {{}}} params
 * This implementation is borrowed from Suzzie
 */
export function cleanParams(params, ignoreArray = false) {
  return Object.entries(params).reduce((newObj, [key, value]) => {
    if (
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0 && !ignoreArray) ||
      (Object.prototype.toString.call(value) === '[object Object]' &&
        Object.keys(value).length === 0)
    ) {
      return newObj;
    }
    return { ...newObj, [key]: typeof value === 'string' ? value.trim() : value };
  }, {});
}

export function sortParams([a], [b]) {
  // Normalize case
  var aUpper = a.toLowerCase();
  var bUpper = b.toLowerCase();
  if (aUpper < bUpper) return -1;
  else if (aUpper > bUpper) return 1;
  return 0;
}

export function stringifyKeyValue(key, value) {
  switch (key) {
    // Boolean
    case 'blocked':
      return `${key}: ${value}`;
    // String
    case 'account':
    case 'address':
    case 'city':
    case 'email':
    case 'ipAddress':
    case 'logonId':
    case 'memberId':
    case 'name':
    case 'parentOrderId':
    case 'paypalEmail':
    case 'phone':
    case 'subscriptionId':
    case 'timePlacedFrom':
    case 'timePlacedTo':
    case 'timeUpdatedFrom':
    case 'timeUpdatedTo':
    case 'zip':
      return `${key}: "${value}"`;

    // Array - only single item supported at the moment
    case 'fulfillmentCenters':
    case 'partNumbers':
    case 'payReferenceIds':
      return `${key}: ["${value}"]`;
    case 'blockReasons':
    case 'excludedStatuses':
    case 'productAttributes':
    case 'statuses':
      return `${key}: [${value}]`;

    // Map from UI single-input to filter criteria
    case 'fulfillmentCenter':
      return `fulfillmentCenters: ["${value}"]`;
    case 'payReferenceId':
      return `payReferenceIds: ["${value}"]`;
    case 'partNumber':
      return `partNumbers: ["${value}"]`;
    case 'blockReason':
      return `blockReasons: [${value}]`;
    case 'status':
      return `statuses: [${value}]`;
    default:
      return `${key}: ${value}`;
  }
}
