import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { getPetAge } from '@utils/dates';

const useStyles = makeStyles((theme) => ({
  root: {
    fontSize: theme.fonts.size.xs,
  },
  value: {
    padding: theme.spacing(0.25),
    lineHeight: '1.5rem',
    fontSize: theme.fonts.size.lg,
    fontWeight: 'bold',
  },
}));

const PetAge = ({ children }) => {
  const classes = useStyles();

  if (!children) {
    return null;
  }

  const age = getPetAge(children);

  return (
    <div className={classes.root} data-testid="pet-profile:age">
      <span className={classes.value}>{age ? (age.years > 0 ? age.years : age.months) : '?'}</span>
      {!age || age.years > 0 ? 'YRS' : 'M'}
    </div>
  );
};

PetAge.propTypes = {
  children: PropTypes.string,
};

export default PetAge;
