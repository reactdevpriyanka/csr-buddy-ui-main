import PropTypes from 'prop-types';
import Order, { mapper as orderDataMapper } from '@components/Order';
import {
  AutoshipCard,
  // AutoshipNotice,
  mapper as autoshipDataMapper,
} from '@components/Autoship';

const ActivityComponent = {
  [Symbol.for('AUTOSHIP_UPCOMING_FULFILLMENT')]: AutoshipCard,
  [Symbol.for('AUTOSHIP_CREATED')]: AutoshipCard,
  [Symbol.for('AUTOSHIP_CANCELED')]: AutoshipCard,
  [undefined]: null,
  [null]: null,
};

const componentMatcher = (type) => {
  if (type.startsWith('ORDER')) return Order;
  return ActivityComponent[Symbol.for(type)];
};

const dataMapper = (type) => {
  if (type.startsWith('AUTOSHIP')) return autoshipDataMapper;
  if (type.startsWith('ORDER')) return orderDataMapper;
  return (args) => args;
};

const Activity = ({ type, data, onClick }) => {
  const mapper = dataMapper(type);
  const Component = componentMatcher(type);

  if (!Component) return null;

  return <Component {...mapper(data, onClick)} />; // eslint-disable-line react/jsx-props-no-spreading
};

Activity.propTypes = {
  type: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  onClick: PropTypes.func,
};

export default Activity;
