import { useCallback } from 'react';
import { Select, MenuItem } from '@material-ui/core';
import { FeatureFlag } from '@/features';
import useAthena from '@/hooks/useAthena';
import useActivityFeed from '@/hooks/useActivityFeed';
import { makeStyles } from '@material-ui/core/styles';
import { ACTIVITYFEED_FILTERS } from '@/components/ActivityFeed/activityFilters';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: theme.utils.fromPx(180),
    marginLeft: theme.utils.fromPx(12),
  },
  select: {
    padding: theme.utils.fromPx(9),
    paddingBottom: theme.utils.fromPx(8),
  },
}));

export default function ActivityAttributeFilter() {
  const classes = useStyles();

  const { getLang } = useAthena();

  const { actFeedFilter, setActFeedFilter } = useActivityFeed();

  const onChangeFilterActivities = useCallback(
    ({ target: { value } }) => {
      setActFeedFilter(value);
    },
    [setActFeedFilter],
  );

  return (
    <FeatureFlag flag="feature.explorer.activityFeedFiltersEnabled">
      <div className={classes.root}>
        <div>{getLang('filterByText', { fallback: 'Filter By' })}</div>
        <Select
          data-testid="activity-filter-menu"
          fullWidth
          classes={{ select: classes.select }}
          variant="outlined"
          label={getLang('filterByText', { fallback: 'Filter By' })}
          value={actFeedFilter}
          onChange={onChangeFilterActivities}
        >
          {Object.keys(ACTIVITYFEED_FILTERS).map((filter) => (
            <MenuItem
              value={filter}
              key={filter}
              data-testid={`activity-filter-item:${filter}`}
              data-dd-action-name={`${getLang(filter, { fallback: filter })} filter`}
            >
              {getLang(filter, { fallback: filter })}
            </MenuItem>
          ))}
        </Select>
      </div>
    </FeatureFlag>
  );
}
