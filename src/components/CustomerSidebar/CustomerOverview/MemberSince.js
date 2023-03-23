import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  customerSince: {
    ...theme.fonts.textSmall,
    color: theme.palette.gray.light,
    padding: '0',
    margin: '0',
    fontSize: '0.875rem',
    fontWeight: '500',
    lineHeight: '1rem',
  },
}));

const memberSinceDate = (date) => {
  if (!date) return 'Unknown';
  return new Date(date.replace(/\s/, 'T')).getFullYear();
};

const MemberSince = ({ children }) => {
  const classes = useStyles();
  if (!children) return null;

  return (
    <p
      className={classes.customerSince}
      data-testid="customer=-sidebar:member-since"
    >{`Customer Since ${memberSinceDate(children)}`}</p>
  );
};

MemberSince.propTypes = {
  children: PropTypes.node,
};

export default MemberSince;
