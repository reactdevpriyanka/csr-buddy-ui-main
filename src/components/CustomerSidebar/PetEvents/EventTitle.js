import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    ...theme.fonts.body.medium,
    color: theme.palette.black,
  },
}));

const EventTitle = ({ children }) => {
  const classes = useStyles();

  return <div className={classes.root}>{children}</div>;
};

EventTitle.propTypes = {
  children: PropTypes.node,
};

export default EventTitle;
