import { subWeeks, isValid } from 'date-fns';
import * as Yup from 'yup';

export const phoneRegExp = /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;

export const validationSchema = Yup.object({
  orderId: Yup.string().trim().matches(/^\d*$/, 'Must be numeric characters'),
  status: Yup.string().trim(),
  name: Yup.string().trim(),
  logonId: Yup.string().trim(),
  address: Yup.string().trim(),
  city: Yup.string().trim(),
  zip: Yup.string().matches(
    /^\d{5}(?:-\d{4})?$/,
    'Must be 5 or 9 digits with a format of ##### or #####-####',
  ),
  email: Yup.string().email().trim(),
  phone: Yup.string()
    .trim()
    .matches(phoneRegExp, 'Phone number is not valid')
    .min(7, 'Phone number is not valid')
    .max(16, 'Phone number is not valid'),
  partNumber: Yup.string().trim(),
  blocked: Yup.string().trim(),
  blockReason: Yup.string().trim(),
  fulfillmentCenter: Yup.string().trim(),
  account: Yup.string().trim().min(4).max(4),
  payReferenceId: Yup.string().trim(),
  paypalEmail: Yup.string().email().trim(),
  ipAddress: Yup.string().trim(),
  timePlacedFrom: Yup.string()
    .trim()
    .test('duration', 'The start date must be before the end date', function (value) {
      return checkDuration(value, this.parent.timePlacedTo, this);
    })
    .nullable(),
  timePlacedTo: Yup.string().trim().nullable(),
  timeUpdatedFrom: Yup.string()
    .trim()
    .test('duration', 'The start date must be before the end date', function (value) {
      return checkDuration(value, this.parent.timeUpdatedTo, this);
    })
    .nullable(),
  timeUpdatedTo: Yup.string().trim().nullable(),
  subscriptionId: Yup.string().trim(),
});

export const OrderfilterFormWhiteList = [
  'id',
  'orderId',
  'memberId',
  'address',
  'email',
  'name',
  'phone',
  'ipAddress',
  'logonId',
  'status',
  'statuses',
  'excludedStatuses',
  'siteId',
  'paypalEmail',
  'payReferenceIds',
  'account',
  'donationOrgId',
  'subscriptionId',
  'parentOrderId',
  'blockReason',
  'fulfillmentCenter',
  'partNumber',
];

export function isValidDateRange(startDateVal, endDateVal) {
  if (startDateVal && endDateVal) {
    const startDate = new Date(startDateVal);
    const endDate = new Date(endDateVal);
    if (startDate.getTime() > endDate.getTime()) {
      return false;
    }
    const twoWeeksAgo = subWeeks(endDate, 2);
    if (startDate.getTime() < twoWeeksAgo.getTime()) {
      return false;
    }
  }
  return true;
}

const orderFiltersOnlySearchWithThemNotAllowed = new Set(['city', 'zip']);

/**
 * Returns a list of errors on a filter form if there are any
 *
 * @param {object} validationSchema // The schema used to validate the current form
 * @param {object} values // The current values for the form
 * @returns {object} // The list of errors the form currently has.  If none then the form is currently valid or not dirty
 */
export const doFilterFormValidation = async (
  validationSchema,
  filterFormWhiteList = [],
  values,
) => {
  let errors = {};

  if (!values) {
    return errors;
  }

  const validationOptions = {
    abortEarly: false,
  };

  await validationSchema.validate(values, validationOptions).catch((error) => {
    for (let i = 0; i < error.inner.length; i++) {
      const currentError = error.inner[i];
      const currErrorParams = currentError.params;

      if (currErrorParams.value !== '' && currErrorParams.value !== null) {
        errors[currErrorParams.path] = currentError.message;
      }
    }
  });

  if (JSON.stringify(errors) === '{}' && filterFormWhiteList.length > 0) {
    const results = Object.entries(values).filter(
      ([name, value]) => value !== '' && value !== null,
    );

    if (results.length === 1 && !filterFormWhiteList.includes(results[0][0])) {
      errors[results[0][0]] = 'There must be at least 2 items to search on';
    }

    if (results.length === 3 && orderFiltersOnlySearchWithThemNotAllowed.has(results[0][0])) {
      errors[results[0][0]] =
        'at least one of memberId, address, name, phone, statuses, excludedStatuses, siteId, paypalEmail, payReferenceIds, account, donationOrgId, subscriptionId, parentOrderId, blockReasons, fulfillmentCenters, partNumbers, or trackingId must be set';
    }
  }

  return errors;
};

export function checkDuration(startDateStr, endDateStr, ctx) {
  if (startDateStr && endDateStr) {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    if (!isValid(startDate) || !isValid(endDate)) {
      return false;
    }
    if (startDate.getTime() > endDate.getTime()) {
      return false;
    }
    const twoWeeksAgo = subWeeks(endDate, 2);
    if (startDate.getTime() < twoWeeksAgo.getTime()) {
      return ctx.createError({ message: 'The date range should be less than 2 weeks' });
    }
  }
  return true;
}
