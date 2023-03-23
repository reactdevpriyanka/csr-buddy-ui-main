import { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

export default function OnAndOffEventBus({ children, offType, onType, defaultState = false }) {
  const [isOn, setIsOn] = useState(defaultState);

  const offListener = useCallback(() => setIsOn(false), [setIsOn]);

  const onListener = useCallback(() => setIsOn(true), [setIsOn]);

  useEffect(() => {
    window.addEventListener(offType, offListener);
    window.addEventListener(onType, onListener);
    return () => {
      window.removeEventListener(offType, offListener);
      window.removeEventListener(onType, onListener);
    };
  }, [offType, onType, offListener, onListener]);

  if (typeof children === 'function') {
    return children({ off: offListener, on: onListener, isOn });
  }

  return isOn ? children : null;
}

OnAndOffEventBus.propTypes = {
  offType: PropTypes.string.isRequired,
  onType: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  defaultState: PropTypes.bool,
};
