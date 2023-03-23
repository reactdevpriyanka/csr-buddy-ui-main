import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import usePetEvents from '@/hooks/usePetEvents';
import PetEvent from './PetEvent';

const useStyles = makeStyles((theme) => ({
  root: {},
  title: {
    ...theme.fonts.h2,
    color: theme.palette.blue.dark,
  },
  list: {
    padding: '0',
    margin: '0',
    listStyle: 'none',
    '& > li': {
      marginBottom: theme.spacing(1),
    },
  },
}));

const PetEvents = ({ children }) => {
  const classes = useStyles();

  const upcomingEvents = usePetEvents();

  return (
    <div className={classes.root}>
      <h3 className={classes.title}>{'Upcoming Events'}</h3>
      <ul className={classes.list}>
        {upcomingEvents.map(({ id, title, date, daysUntil }) => (
          <PetEvent key={id} title={title} date={date} daysUntil={daysUntil} />
        ))}
        {upcomingEvents.length === 0 && <li>{'No upcoming events'}</li>}
      </ul>
    </div>
  );
};

PetEvents.propTypes = {
  children: PropTypes.node,
};

export default PetEvents;
