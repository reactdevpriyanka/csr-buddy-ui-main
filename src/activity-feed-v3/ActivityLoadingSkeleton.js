import { makeStyles } from '@material-ui/core/styles';
import { Skeleton, Stack } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  root: {
    border: `1px solid lightgrey `,
    paddingBottom: theme.utils.fromPx(16),
    padding: theme.utils.fromPx(12),
    marginBottom: theme.utils.fromPx(24),
    borderRadius: theme.utils.fromPx(8),
  },
  topRow: {
    display: 'inline-flex',
  },
}));

const ActivityLoadingSkeleton = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Stack sx={{}}>
        <span className={classes.topRow}>
          <Skeleton variant="circular" width={50} height={50} sx={{ mb: 1 }} />
          <Skeleton
            sx={{ marginLeft: 'auto', borderRadius: '4px' }}
            height={35}
            width={140}
            variant="rectangular"
          />
        </span>
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
      </Stack>
    </div>
  );
};

export default ActivityLoadingSkeleton;
