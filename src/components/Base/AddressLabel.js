import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.utils.fromPx(20),
    maxWidth: theme.utils.fromPx(338),
  },
  address: {
    fontStyle: 'normal',
  },
  title: {
    ...theme.utils.title,
  },
  label: {
    ...theme.utils.label,
  },
  subLabel: {
    ...theme.utils.subLabel,
  },
}));

const AddressLabel = ({
  title = '',
  label = '',
  subLabel = '',
  value: {
    addressLine1 = '',
    addressLine2 = '',
    city = '',
    country = '',
    firstName = '',
    fullName = '',
    lastName = '',
    phone = '',
    postcode = '',
    primaryAddressLabel = '',
    state = '',
    street1 = '',
    email1 = '',
  } = {},
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {title && <div className={classes.title}>{title}</div>}
      {label && <div className={classes.label}>{label}</div>}
      {subLabel && <div className={classes.subLabel}>{subLabel}</div>}
      <address className={classes.address}>
        {fullName && (
          <>
            <span>{fullName}</span>
            <br />
          </>
        )}
        {firstName && lastName && (
          <>
            <span>{`${firstName} ${lastName}`}</span>
            <br />
          </>
        )}
        {street1 && (
          <>
            <span>{street1}</span>
            <br />
          </>
        )}
        {addressLine1 && (
          <>
            <span>{addressLine1}</span>
            <br />
          </>
        )}
        {addressLine2 && (
          <>
            <span>{addressLine2}</span>
            <br />
          </>
        )}
        {city && state && postcode && (
          <>
            <span>{`${city}, ${state} ${postcode}`}</span>
            <br />
          </>
        )}
        {country && (
          <>
            <span>{country}</span>
            <br />
          </>
        )}
        {email1 && (
          <>
            <span>{email1}</span>
            <br />
          </>
        )}
      </address>
    </div>
  );
};

AddressLabel.propTypes = {
  title: PropTypes.string,
  label: PropTypes.string,
  subLabel: PropTypes.string,
  value: PropTypes.shape({
    addressLine1: PropTypes.string,
    addressLine2: PropTypes.string,
    city: PropTypes.string,
    country: PropTypes.string,
    firstName: PropTypes.string,
    fullName: PropTypes.string,
    lastName: PropTypes.string,
    phone: PropTypes.string,
    postcode: PropTypes.string,
    primaryAddressLabel: PropTypes.string,
    state: PropTypes.string,
    street1: PropTypes.string,
    email1: PropTypes.string,
  }),
};

export default AddressLabel;
