import PropTypes from 'prop-types';
import { MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CardIcon from '../CardIcon';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
  },
  icon: {
    display: 'flex',
    width: theme.utils.fromPx(24),
    height: 'auto',
    marginLeft: theme.utils.fromPx(4),
    '& > svg': {
      width: '100%',
      height: 'auto',
    },
  },
}));

const CardOption = ({ label = null, children, type = null, disabled = false, ...props }) => {
  const classes = useStyles();

  return (
    /* eslint-disable-next-line react/jsx-props-no-spreading */
    <MenuItem {...props} disabled={disabled}>
      {' '}
      <span className={classes.root}>
        <span className={classes.content}>{label || children}</span>
        <span className={classes.icon}>
          <CardIcon type={type} />
        </span>
      </span>
    </MenuItem>
  );
};

CardOption.propTypes = {
  children: PropTypes.node,
  label: PropTypes.node,
  type: PropTypes.oneOf(['MASTERCARD', 'VISA', 'AMEX', 'DISCOVER', 'GIFTCARD', 'PAYPAL']),
  disabled: PropTypes.bool,
};

export default CardOption;
