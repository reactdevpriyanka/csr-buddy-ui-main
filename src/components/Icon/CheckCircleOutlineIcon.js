import PropTypes from 'prop-types';
import CheckCircle from '@icons/circle-check.svg';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((props) => {
  return {
    root: {
      width: (props) => props.size,
      height: (props) => props.size,
      opacity: (props) => props.opacity,
      '& circle': {
        fill: (props) => (props.backgroundColor ? props.backgroundColor : '#006B2B'),
        stroke: (props) => (props.borderColor ? props.borderColor : '#006B2B'),
        strokeWidth: '1',
      },

      '& path': {
        fill: (props) => (props.color ? props.color : 'white'),
      },
    },
  };
});

const CheckCircleOutlineIcon = ({
  className = '',
  color,
  backgroundColor,
  borderColor,
  size = '25px',
  opacity = '1',
  ...props
}) => {
  const classes = useStyles({ className, color, backgroundColor, borderColor, size, opacity });

  return (
    <CheckCircle
      className={classes.root}
      data-testid={props['data-testid'] || `CheckCircleOutlineIcon`}
    />
  );
};

CheckCircleOutlineIcon.propTypes = {
  className: PropTypes.any,
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
  borderColor: PropTypes.string,
  size: PropTypes.string,
  'data-testid': PropTypes.string,
  opacity: PropTypes.string,
};

export default CheckCircleOutlineIcon;
