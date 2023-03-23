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

const PetBreedType = ({ children }) => {
  const breedType = children;
  const classes = useStyles();

  const Component =
    breedType === null || breedType === undefined || breedType.toLowerCase() === 'unknown'
      ? 'span'
      : 'a';
  const props = {};

  return (
    <Component className={classes.root} data-testid="pet-profile:breedType" {...props}>
      {children || 'Unknown'}
    </Component>
  );
};

PetBreedType.propTypes = {
  children: PropTypes.string,
};

export default PetBreedType;
