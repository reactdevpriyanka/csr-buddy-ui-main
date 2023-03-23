/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'inline-block',
    textTransform: 'uppercase',
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: '1.25rem',
    letterSpacing: '0.025em',
    color: '#666666',
    align: 'center',
  },
}));

const PetBreed = ({ children }) => {
  const breed = children;
  const classes = useStyles();

  const Component =
    breed === null || breed === undefined || breed.toLowerCase() === 'unknown' ? 'span' : 'a';
  const props = {};

  return (
    <Component className={classes.root} data-testid="pet-profile:breed" {...props}>
      {children || 'Unknown'}
    </Component>
  );
};

PetBreed.propTypes = {
  children: PropTypes.string,
};

export default PetBreed;
