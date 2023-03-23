import PropTypes from 'prop-types';
import { MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > p': {
      margin: 0,
      lineHeight: 1.4,
    },
  },
}));

const AddressOption = ({
  id = '',
  fullName = '',
  firstName = '',
  lastName = '',
  addressLine1 = '',
  addressLine2 = '',
  addressLine3 = '',
  city = '',
  state = '',
  postcode = '',
  country = '',
  phone = '',
}) => {
  const classes = useStyles();

  return (
    <MenuItem className={classes.root} value={id}>
      {firstName && lastName && <p>{`${firstName} ${lastName}`}</p>}
      {fullName && <p>{fullName}</p>}
      {phone && <p>{phone}</p>}
      {addressLine1 && <p>{addressLine1}</p>}
      {addressLine2 && <p>{addressLine2}</p>}
      {addressLine3 && <p>{addressLine3}</p>}
      {city && state && postcode && <p>{`${city}, ${state} ${postcode}`}</p>}
    </MenuItem>
  );
};

AddressOption.propTypes = {
  id: PropTypes.string,
  fullName: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  addressLine1: PropTypes.string,
  addressLine2: PropTypes.string,
  addressLine3: PropTypes.string,
  city: PropTypes.string,
  state: PropTypes.string,
  postcode: PropTypes.string,
  country: PropTypes.string,
  phone: PropTypes.string,
};

export default AddressOption;
