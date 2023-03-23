import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import classNames from 'classnames';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(0.5),
    '&.grid': {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridColumnGap: theme.utils.fromPx(24),
      gridRowGap: theme.utils.fromPx(24),
      alignItems: 'stretch',
    },
    '&.disabled': {
      opacity: '0.5',
    },
    '&.rowPadding': {
      '& > :not(:last-child)': {
        marginBottom: theme.utils.fromPx(24),
      },
    },
  },
}));

const GridContent = ({ children, disabled = false }) => {
  const classes = useStyles();
  const isLargeScreen = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const hasMultipleChildren = React.Children.count(children) > 1;

  return (
    <div
      data-testid="card:gridcontent"
      className={classNames(classes.root, {
        disabled,
        grid: isLargeScreen && hasMultipleChildren,
        rowPadding: hasMultipleChildren && !isLargeScreen,
      })}
    >
      {children}
    </div>
  );
};

GridContent.propTypes = {
  children: PropTypes.node,
  disabled: PropTypes.bool,
};

export default GridContent;
