import { makeStyles } from '@material-ui/core/styles';
import { MenuItem, Select } from '@material-ui/core';
import { FeatureFlag } from '@/features';
import TooltipPrimary from '@/components/TooltipPrimary';
import useAthena from '@/hooks/useAthena';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: theme.utils.fromPx(180),
    marginLeft: theme.utils.fromPx(12),
  },
  tooltip: {
    fontSize: '14px',
  },
  select: {
    padding: theme.utils.fromPx(9),
    paddingBottom: theme.utils.fromPx(8),
  },
}));

export default function ActivitySortByFilter() {
  const classes = useStyles();

  const { getLang } = useAthena();

  return (
    <FeatureFlag flag="feature.explorer.activityFeedSortByEnabled">
      <TooltipPrimary
        title={getLang('comingSoonText', { fallback: 'Coming Soon!' })}
        className={classes.tooltip}
      >
        <div className={classes.root} data-testid="activity-feed:sort-container">
          <div>{getLang('sortByDisplayText', { fallback: 'Sort By' })}</div>
          <Select
            disabled
            fullWidth
            classes={{ select: classes.select }}
            variant="outlined"
            label={getLang('sortByDisplayText', { fallback: 'Sort By' })}
            value={getLang('mostRecentText', { fallback: 'Most Recent' })}
            onChange={() => {}}
          >
            <MenuItem
              key="Most Recent"
              value={getLang('mostRecentText', { fallback: 'Most Recent' })}
            >
              {getLang('mostRecentText', { fallback: 'Most Recent' })}
            </MenuItem>
          </Select>
        </div>
      </TooltipPrimary>
    </FeatureFlag>
  );
}
