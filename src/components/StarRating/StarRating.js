import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Star from './Star';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, auto)',
    justifyContent: 'start',
    alignItems: 'center',
  },
  label: {
    ...theme.fonts.body.normal,
    color: theme.palette.gray.light,
    fontSize: theme.utils.fromPx(10),
    lineHeight: theme.utils.fromPx(16),
    padding: `0 0 ${theme.utils.fromPx(1)}`,
  },
}));

const StarRating = ({ percentage = 0, label = null }) => {
  const classes = useStyles();

  const starPercentages = [];
  // Fill out the full stars
  for (let i = 0; i < Math.floor(percentage / 20); i += 1) {
    starPercentages.push(100);
  }
  // Fill out the one star that is partially filled
  if (percentage % 20 > 0) {
    starPercentages.push(((percentage % 20) / 20) * 100);
  }
  // Fill out the zero stars
  if (starPercentages.length < 5) {
    for (let i = 0; i < 5 - starPercentages.length; i += 1) starPercentages.push(0);
  }
  return (
    <div title={`Star rating: ${percentage}%`} className={classes.root}>
      {starPercentages.map((perc, id) => (
        <Star key={id} percentage={perc} />
      ))}
      {label && <p className={classes.label}>{label}</p>}
    </div>
  );
};

StarRating.propTypes = {
  percentage: PropTypes.number,
  label: PropTypes.node,
};

export default StarRating;
