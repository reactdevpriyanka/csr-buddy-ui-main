import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    ...theme.fonts.h4,
    color: theme.palette.gray.light,
    marginBottom: theme.spacing(0.4),
    textTransform: 'uppercase',
  },
  date: {
    display: 'inline-block',
    marginRight: theme.spacing(0.4),
  },
  daysUntil: {
    display: 'inline-block',
    '&:before': {
      background: theme.palette.gray.light,
      borderRadius: '100%',
      content: "''",
      display: 'inline-block',
      marginRight: theme.spacing(0.4),
      height: theme.spacing(0.25),
      width: theme.spacing(0.25),
      verticalAlign: 'middle',
    },
  },
}));

const EventDate = ({ date, daysUntil }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <span className={classes.date}>{date}</span>
      <span className={classes.daysUntil}>{`${daysUntil} days`}</span>
    </div>
  );
};

EventDate.propTypes = {
  date: PropTypes.string,
  daysUntil: PropTypes.number,
};

export default EventDate;
