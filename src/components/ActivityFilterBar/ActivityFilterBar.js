import { makeStyles } from '@material-ui/core/styles';
import { getMonth } from '@/utils';
import { Typography } from '@material-ui/core';
import { OpenCommentsButton } from '@/agent-notes';
import { ActivitySortByFilter, ActivityAttributeFilter } from '@/activity-filters';

const useStyles = makeStyles((theme) => ({
  //copied from src/components/ShipmentTracker/ShipmentTracker.js
  root: {
    marginTop: theme.utils.fromPx(8),
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },

  btnCommentActive: {
    //borderColor: theme.palette.primary.main,
    color: theme.palette.white,
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.white,
      backgroundColor: theme.palette.primary.main,
    },
  },
  tooltip: {
    fontSize: '14px',
  },
  currentMonth: {
    flexGrow: 1,
    justifySelf: 'self-start',
    alignSelf: 'center',
    fontWeight: 400,
  },
}));

const ActivityFilterBar = () => {
  const classes = useStyles();

  return (
    <div className={classes.root} data-testid="activity-filters">
      <Typography variant="h6" className={classes.currentMonth}>
        {`${getMonth(new Date())} ${new Date().getFullYear()}`}
      </Typography>
      <ActivityAttributeFilter />
      <ActivitySortByFilter />
      <OpenCommentsButton />
    </div>
  );
};

export default ActivityFilterBar;
