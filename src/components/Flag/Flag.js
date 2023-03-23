import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Pill from '@components/Pill';
import AUTOSHIP from '@icons/autoship.svg';
import RX from '@icons/rx.svg';

const useStyles = makeStyles((theme) => ({
  img: {
    width: '0.75rem',
    height: '0.75rem',
    display: 'inline-block',
    verticalAlign: 'middle',
    marginRight: '0.25rem',
  },
  pill: {
    background: '#DBEBF9',
  },
}));

const PILL_TYPES = {
  AUTOSHIP: 'info',
  RX: 'warning',
  GENERIC: 'default',
};

const ICONS = {
  AUTOSHIP,
  RX,
  GENERIC: () => null,
};

const pillType = (str) => PILL_TYPES[str];

const iconType = (str) => ICONS[str];

const Flag = ({ type, children }) => {
  const classes = useStyles();
  const Icon = iconType(type);
  return (
    <Pill className={classes.pill} type={pillType(type)}>
      <Icon className={classes.img} /> {children}
    </Pill>
  );
};

Flag.propTypes = {
  children: PropTypes.node,
  type: PropTypes.oneOf(['AUTOSHIP', 'RX', 'GENERIC']),
};

export default Flag;
