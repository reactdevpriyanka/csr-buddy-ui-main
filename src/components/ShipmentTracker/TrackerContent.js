import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: `0 ${theme.utils.fromPx(24)} ${theme.utils.fromPx(24)}`,
    flexGrow: 1,
    overflowY: 'scroll',
    marginTop: theme.utils.fromPx(0),
  },
}));

const Content = ({ children }) => {
  const classes = useStyles();
  return <div className={classes.root}>{children}</div>;
};

Content.propTypes = {
  children: PropTypes.node,
};

export default Content;
