import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import clamp from '@/utils/clamp';

const useStyles = makeStyles((theme) => ({
  root: {
    background: '#f5f5f5',
    borderRadius: theme.utils.fromPx(4),
    display: 'grid',
    gridTemplateAreas: `
      "left right"
      "bottom bottom"
    `,
    gridTemplateColumns: '1fr 1fr',
    gridRowGap: theme.utils.fromPx(13),
    marginBottom: theme.utils.fromPx(24),
    padding: theme.utils.fromPx(12),
  },
  progress: {
    gridArea: 'bottom',
  },
}));

const useProgressClasses = makeStyles((theme) => ({
  root: {
    background: '#ccc',
    borderRadius: theme.utils.fromPx(8),
    height: theme.utils.fromPx(8),
  },
  bar: {
    background: '#006b2b',
    borderRadius: theme.utils.fromPx(8),
  },
}));

const TrackerHUD = ({ children, progress = 0 }) => {
  const classes = useStyles();

  const progressBarClasses = useProgressClasses();

  return (
    <div className={classes.root}>
      {children}
      <LinearProgress
        classes={progressBarClasses}
        className={classes.progress}
        variant="determinate"
        value={clamp(progress, 0, 100)}
      />
    </div>
  );
};

TrackerHUD.propTypes = {
  children: PropTypes.node,
  progress: PropTypes.number,
};

export default TrackerHUD;
