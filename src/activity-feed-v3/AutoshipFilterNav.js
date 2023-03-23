import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import { MenuItem, Select, Typography } from '@material-ui/core';
import useAthena from '@/hooks/useAthena';
import { getMonth } from '@/utils';
import { FeatureFlag } from '@/features';
import { AUTOSHIP_FILTERS } from '@/components/Autoship/autoshipFilters';
import useFeature from '@/features/useFeature';


const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '8px',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  selectAutoshipContainer: {
    minWidth: '180px',
    marginLeft: '12px',
  },
  select: {
    paddingTop: '9px',
    paddingRight: '9px',
    paddingBottom: '8px',
    paddingLeft: '9px',
  },
  currentAutoshipMonth: {
    flexGrow: 1,
    justifySelf: 'self-start',
    alignSelf: 'center',
    fontWeight: 400,
  },
}));

const AutoshipFilterNav = () => {
  const classes = useStyles();

  const router = useRouter();

  const { getLang } = useAthena();

  const AUTOSHIP_FILTERS_ENABLED_FEATURE_FLAG = 'feature.explorer.autoshipFiltersEnabled';

  const enableAutoshipFilter = useFeature(AUTOSHIP_FILTERS_ENABLED_FEATURE_FLAG);

  const handleFilterChange = useCallback(
    (event) => {
      const { pathname, query } = router;     
      query.byAutoshipAttribute = event.target.value;
      const urlObj = {
        pathname,
        query,
      };

      router.push(urlObj, undefined, { shallow: true });
    },
    [router],
  );

  useEffect(() => {
    const { pathname, query } = router;
    if(!query.byAutoshipAttribute && enableAutoshipFilter) {
      delete query.byAttribute;
      query.byAutoshipAttribute = "Active"
      const urlObj = {
        pathname,
        query,
      };
      router.push(urlObj, undefined, { shallow: true });
    }
  }, [enableAutoshipFilter])

  const { byAutoshipAttribute = "Active" } = router.query;

  return (
    <div className={classes.root} data-testid="autoship-filters">
      <Typography variant="h6" className={classes.currentAutoshipMonth}>
        {`${getMonth(new Date())} ${new Date().getFullYear()}`}
      </Typography>
      <FeatureFlag flag="feature.explorer.autoshipFiltersEnabled">
        <div className={classes.selectAutoshipContainer}>
          <div>{getLang('filterByText', { fallback: 'Filter By' })}</div>
          <Select
            data-testid="autoship:filter-menu"
            fullWidth
            classes={{ select: classes.select }}
            variant="outlined"
            label={getLang('filterByText', { fallback: 'Filter By' })}
            value={byAutoshipAttribute}
            onChange={handleFilterChange}
          >
            {Object.keys(AUTOSHIP_FILTERS).map((filter) => (
              <MenuItem
                value={filter}
                key={filter}
                data-testid={`autoship:filter-item:${filter}`}
                data-dd-action-name={`${getLang(filter, { fallback: filter })} filter`}
              >
                {getLang(filter, { fallback: filter })}
              </MenuItem>
            ))}
          </Select>
        </div>
      </FeatureFlag>
    </div>
  );
};

export default AutoshipFilterNav;