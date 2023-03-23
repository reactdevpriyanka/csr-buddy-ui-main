/* eslint-disable react/jsx-props-no-spreading */
import cn from 'classnames';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {},
  label: {
    fontSize: theme.fonts.size.md,
    color: theme.palette.gray.medium,
    fontWeight: '500',
    marginBottom: theme.spacing(1),
  },
}));

const Unimplemented = ({ node, responseHandler }) => {
  const testId = `gwf-input:unimplemented`;
  const classes = useStyles();

  return (
    <div data-testid={testId} className={classes.root}>
      <Typography variant="h2" className={cn(classes.label)} data-testid={`${testId}:label`}>
        {node.label}
      </Typography>
    </div>
  );
};

Unimplemented.propTypes = {
  node: PropTypes.object.isRequired,
  responseHandler: PropTypes.func.isRequired,
};

export default Unimplemented;
