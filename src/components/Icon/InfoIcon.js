import PropTypes from 'prop-types';
import InfoOutlineIcon from '@mui/icons-material/InfoRounded';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((props) => {
  return {
    root: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '50%',
      padding: '4px',
      background: (props) => props.color,
      height: (props) => `${props.size} !important`,
      width: (props) => `${props.size} !important`,
    },
    icon: {
      borderRadius: '50%',
      marginLeft: '-1px',
      width: (props) => `${props.innerSize} !important`,
      height: (props) => `${props.innerSize} !important`,
      backgroundColor: (props) => `${props.backgroundColor}`,
      color: (props) => props.color,
    },
  };
});

const InfoIcon = ({
  className = '',
  color = '#1C49C2',
  backgroundColor = 'white',
  innerSize = '15px',
  size = '25px',
  ...props
}) => {
  const classes = useStyles({ className, color, backgroundColor, innerSize, size });

  return (
    <div className={classes.root}>
      <InfoOutlineIcon className={classes.icon} data-testid={props['data-testid'] || `InfoIcon`} />
    </div>
  );
};

InfoIcon.propTypes = {
  className: PropTypes.any,
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
  size: PropTypes.string,
  innerSize: PropTypes.string,
  'data-testid': PropTypes.string,
};

export default InfoIcon;
