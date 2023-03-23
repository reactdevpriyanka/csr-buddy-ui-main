import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '11.67px',
    height: '10.5px',
    display: 'inline-block',
    margin: '0',
    verticalAlign: 'middle',
  },
}));

const Icon = ({ src, children }) => {
  const classes = useStyles();
  return (
    <figure className={classes.root}>
      {src && <img src={src} alt="" />}
      {children}
    </figure>
  );
};

Icon.propTypes = {
  src: PropTypes.string,
  children: PropTypes.node,
};

export default Icon;
