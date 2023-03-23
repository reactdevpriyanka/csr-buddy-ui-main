import { useEffect } from 'react';
import PropTypes from 'prop-types';

const argumentsAreValid = (eventType, listener) => {
  return typeof eventType === 'string' && typeof listener === 'function';
};

export default function SimpleEventBus({ children, eventType, listener = () => null }) {
  useEffect(() => {
    if (argumentsAreValid(eventType, listener)) {
      window.addEventListener(eventType, listener);
    }

    return () => {
      if (argumentsAreValid(eventType, listener)) {
        window.removeEventListener(eventType, listener);
      }
    };
  }, [eventType, listener]);

  return children;
}

SimpleEventBus.propTypes = {
  children: PropTypes.node,
  eventType: PropTypes.string.isRequired,
  listener: PropTypes.func.isRequired,
};
