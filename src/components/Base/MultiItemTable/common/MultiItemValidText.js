import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'flex-end',
    color: theme.palette.red[600],
  },
}));

const MultiItemValidText = ({ errorMessage }) => {
  const classes = useStyles();

  return (
    <div data-testid="multi-item:valid-text" className={classes.root}>
      {errorMessage}
    </div>
  );
};

MultiItemValidText.propTypes = {
  errorMessage: PropTypes.string,
};

export default MultiItemValidText;
