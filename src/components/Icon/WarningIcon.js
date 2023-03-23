import PropTypes from 'prop-types';
import WarningOutlineIcon from '@mui/icons-material/WarningAmberRounded';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((props) => {
  return {
    root: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '50%',
      padding: '4px',
      background: (props) => props.backgroundColor,
      height: (props) => `${props.size} !important`,
      width: (props) => `${props.size} !important`,
    },
    icon: {
      alignSelf: 'center',
      marginTop: '-2px',
      paddingRight: '1px',
      width: (props) => `${props.innerSize} !important`,
      height: (props) => `${props.innerSize} !important`,
      backgroundColor: 'transparent',
      color: (props) => props.color,
    },
  };
});

const WarningIcon = ({
  className = '',
  color = 'black',
  backgroundColor = '#FFC80C',
  innerSize = '18px',
  size = '25px',
  ...props
}) => {
  const classes = useStyles({ className, color, backgroundColor, size, innerSize });

  return (
    <div className={classes.root}>
      <WarningOutlineIcon
        className={classes.icon}
        data-testid={props['data-testid'] || `WarningIcon`}
      />
    </div>
  );
};

WarningIcon.propTypes = {
  className: PropTypes.any,
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
  size: PropTypes.string,
  innerSize: PropTypes.string,
  'data-testid': PropTypes.string,
};

export default WarningIcon;
