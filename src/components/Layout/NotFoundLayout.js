import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {},
}));

export default function NotFoundLayout({ children }) {
  const classes = useStyles();

  return <main className={classes.root}>{children}</main>;
}

NotFoundLayout.propTypes = {
  children: PropTypes.node,
};
