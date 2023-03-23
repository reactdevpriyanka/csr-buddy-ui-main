import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import EventTitle from './EventTitle';
import EventDate from './EventDate';

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const PetEvent = ({ title, date, daysUntil }) => {
  const classes = useStyles();

  return (
    <li className={classes.root}>
      <EventDate date={date} daysUntil={daysUntil} />
      <EventTitle>{title}</EventTitle>
    </li>
  );
};

PetEvent.propTypes = {
  date: PropTypes.string.isRequired,
  daysUntil: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
};

export default PetEvent;
