import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from './Button';

const useStyles = makeStyles((theme) => ({
  img: {
    display: 'inline-block',
    width: '11.67px',
    height: '10.5px',
    verticalAlign: 'middle',
    marginRight: '5.75px',
    marginLeft: theme.spacing(0.078125), // 1.25px
  },
}));
// eslint-disable-next-line react/jsx-props-no-spreading
const IconButton = ({ onClick = () => {}, icon, children, ...props }) => {
  const classes = useStyles();
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Button onClick={onClick} {...props}>
      <img className={classes.img} src={icon} alt="" />
      {children}
    </Button>
  );
};

IconButton.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
  icon: PropTypes.string.isRequired,
};

export default IconButton;
