import React from 'react';
import PropTypes from 'prop-types';

export default class Try extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    span: PropTypes.string,
    fallback: PropTypes.oneOfType([PropTypes.node, PropTypes.elementType]),
  };

  static getDerivedStateFromError(error) {
    return { caught: error };
  }

  state = { caught: null };

  componentDidCatch(error) {
    if (typeof window !== typeof undefined) {
      const { logger } = window.DD_LOGS || {};
      const label = this.props.span || `failed with error ${error.message}`;
      logger && logger.error(`<Try /> ${label}`, { error });
    }
  }

  render() {
    const { children, fallback: Failsafe } = this.props;

    const { caught } = this.state;

    if (caught) {
      return typeof Failsafe === 'function' ? <Failsafe error={caught} /> : Failsafe;
    }

    return children;
  }
}
