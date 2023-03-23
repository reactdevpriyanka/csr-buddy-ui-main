import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    ...theme.fonts.h1,
    color: theme.palette.blue.dark,
    marginBottom: theme.utils.fromPx(20),
  },
}));

const Subheading = ({ children }) => {
  const classes = useStyles();

  return (
    <Typography variant="h2" className={classes.root}>
      {children}
    </Typography>
  );
};

Subheading.propTypes = {
  children: PropTypes.node,
};

export default Subheading;
