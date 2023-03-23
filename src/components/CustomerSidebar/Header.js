import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  customerSidebarHeader: {
    display: 'flex',
    flexFlow: 'row nowrap',
    justifyContent: 'space-between',
    padding: `${theme.spacing(1.25)} ${theme.spacing(1.5)} 0 ${theme.spacing(1.5)}`,
    paddingTop: theme.spacing(1.25),
    marginBottom: theme.utils.fromPx(12),
    position: 'sticky',
    top: 0,
    zIndex: 10,
    backgroundColor: '#FFFFFF',
  },
}));

const Header = ({ children }) => {
  const classes = useStyles();
  return (
    <section data-testid="customer-sidebar:header" className={classes.customerSidebarHeader}>
      {children}
    </section>
  );
};

Header.propTypes = {
  children: PropTypes.node,
};

export default Header;
