import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  customerName: {
    ...theme.fonts.h1,
    marginBottom: theme.spacing(0.25),
    color: theme.palette.blue.dark,
  },
}));

const CustomerName = ({ children }) => {
  const classes = useStyles();
  return (
    <Typography
      variant="h1"
      className={classes.customerName}
      data-testid="customer-sidebar:static-customer-name"
    >
      {children}
    </Typography>
  );
};

CustomerName.propTypes = {
  children: PropTypes.node,
};

export default CustomerName;
