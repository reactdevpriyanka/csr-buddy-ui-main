import { makeStyles } from '@material-ui/core/styles';
import address from './shapes/address';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.utils.fromPx(12),
    marginLeft: theme.utils.fromPx(12),
    borderLeft: `${theme.utils.fromPx(1)} solid #ccc`,
  },
  header: {
    display: 'block',
    marginBottom: theme.utils.fromPx(15),
  },
  name: {
    ...theme.fonts.body.medium,
    color: '#121212',
    display: 'block',
    fontSize: theme.utils.fromPx(11),
    lineHeight: theme.utils.fromPx(13),
    marginBottom: theme.utils.fromPx(4),
  },
  block: {
    ...theme.fonts.body.normal,
    color: '#121212',
    display: 'block',
    fontSize: theme.utils.fromPx(11),
    lineHeight: theme.utils.fromPx(14),
  },
}));

const TrackerAddress = ({
  city = '',
  country = '',
  fullName = '',
  postcode = '',
  phone = '',
  state = '',
  addressLine1 = '',
  addressLine2 = '',
}) => {
  const classes = useStyles();

  const hasCityStateAndZip = city && state && postcode;

  return (
    <div className={classes.root} data-testid="tracker:address">
      <strong className={classes.header}>{'Shipping Address'}</strong>
      {fullName && (
        <span className={classes.name} data-testid="tracker:fullName">
          {fullName}
        </span>
      )}
      {addressLine1 && (
        <span className={classes.block} data-testid="tracker:addressLine1">
          {addressLine1}
        </span>
      )}
      {addressLine2 && (
        <span className={classes.block} data-testid="tracker:addressLine2">
          {addressLine2}
        </span>
      )}
      {hasCityStateAndZip && (
        <span className={classes.block} data-testid="tracker:city-state-zip">
          {`${city}, ${state} ${postcode}`}
        </span>
      )}
      {country && <span className={classes.block}>{country}</span>}
      {phone && <span className={classes.block}>{phone}</span>}
    </div>
  );
};

TrackerAddress.propTypes = address;

export default TrackerAddress;
