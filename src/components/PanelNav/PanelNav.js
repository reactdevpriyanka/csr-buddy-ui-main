import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'flex-end',
    padding: theme.spacing(0.125, 0),
  },
}));

const PanelNav = ({ children }) => {
  const classes = useStyles();
  return (
    <nav role="navigation" className={classes.root}>
      {children}
    </nav>
  );
};

PanelNav.propTypes = {
  children: PropTypes.node,
};

export default PanelNav;
