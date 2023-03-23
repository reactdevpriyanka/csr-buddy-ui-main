import React from 'react';
import PropTypes from 'prop-types';
import { datadogLogs } from '@datadog/browser-logs';
import { withStyles } from '@material-ui/core/styles';

export class DefaultErrorBoundary extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object,
  };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  state = { hasError: false };

  componentDidCatch(error) {
    datadogLogs?.logger?.error(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={this.props.classes.root}>
          <p className={this.props.classes.title}>{'Whoops!'}</p>
          <p className={this.props.classes.subtitle}>{'An error has occurred'}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const styles = {
  root: {
    background: 'red',
    borderRadius: '4px',
    padding: '24px',
    margin: '0 0 20px 0',
  },
  title: {
    color: 'white',
    fontSize: '2.4rem',
    lineHeight: '0.8rem',
  },
  subtitle: {
    color: 'white',
    fontSize: '2rem',
    lineHeight: '0.6rem',
  },
};

export default withStyles(styles)(DefaultErrorBoundary);
