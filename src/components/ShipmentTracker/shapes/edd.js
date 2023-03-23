import PropTypes from 'prop-types';

/* Unfortunately we don't have time data at the moment, just a simple day-month-year */
export default {
  isDelivered: PropTypes.bool,
  dayOfWeek: PropTypes.oneOf([
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ]),
  dayOfMonth: PropTypes.number,
  /* meridiem: PropTypes.oneOf(['am', 'pm']), */
  month: PropTypes.oneOf([
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]),
  /*   time: (props, propName, componentName) => {
    if (!/\d{1,2}:\d{1,2}/.test(props[propName])) {
      return new Error(
      	`Invalid prop ${propName} (${props[propName]}) supplied to ${componentName}`
      );
    }
  }, */
};
