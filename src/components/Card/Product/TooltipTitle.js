import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    fontSize: theme.typography.pxToRem(12),
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'normal',
    color: 'white',
  },
}));

export default function TooltipTitle({ children }) {
  const classes = useStyles();
  return <span className={classes.root}>{children}</span>;
}

TooltipTitle.propTypes = {
  children: PropTypes.node,
};
