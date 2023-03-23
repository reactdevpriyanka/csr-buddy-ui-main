import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    background: '#f5f5f5',
    borderRadius: theme.utils.fromPx(4),
    marginBottom: theme.utils.fromPx(24),
    padding: theme.utils.fromPx(16),
  },
}));

const NewTrackerHUD = ({ children }) => {
  const classes = useStyles();

  return <div className={classes.root}>{children}</div>;
};

NewTrackerHUD.propTypes = {
  children: PropTypes.node,
};

export default NewTrackerHUD;
