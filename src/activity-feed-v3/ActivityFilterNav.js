import { useCallback, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import CommentIcon from '@material-ui/icons/Comment';
import ModalContext, { MODAL } from '@components/ModalContext';
import Button from '@material-ui/core/Button';
import classnames from 'classnames';
import { MenuItem, Select, Typography } from '@material-ui/core';
import useAthena from '@/hooks/useAthena';
import { getMonth } from '@/utils';
import { FeatureFlag } from '@/features';
import TooltipPrimary from '@/components/TooltipPrimary';
import { ACTIVITYFEED_FILTERS } from '@/components/ActivityFeed/activityFilters';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '8px',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  btnComment: {
    minWidth: 'unset',
    marginLeft: '8px',
    marginTop: '5px',
    padding: '5px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: theme.palette.gray[400],
    color: theme.palette.primary.main,
    backgroundCcolor: theme.palette.white,
    alignSelf: 'end',
    '&:hover': {
      color: theme.palette.primary.main,
      backgroundCcolor: theme.palette.white,
      borderColor: theme.palette.secondary.main,
      borderWidth: '1px',
    },
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
  selectContainer: {
    minWidth: '180px',
    marginLeft: '12px',
  },
  select: {
    paddingTop: '9px',
    paddingRight: '9px',
    paddingBottom: '8px',
    paddingLeft: '9px',
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

  const router = useRouter();

  const { getLang } = useAthena();

  const { setModal, modal } = useContext(ModalContext);

  const isCommentShown = modal === MODAL.ARCHIVECONTAINER;

  const handleClickOpenComments = useCallback(() => {
    setModal(isCommentShown ? null : MODAL.ARCHIVECONTAINER);
  }, [isCommentShown, setModal]);

  useEffect(() => {
    const { pathname, query } = router;
    if(query.byAutoshipAttribute) {
      delete query.byAutoshipAttribute;
      const urlObj = {
        pathname,
        query,
      };
      router.push(urlObj, undefined, { shallow: true });
    }
  }, [])

  const handleFilterChange = useCallback(
    (event) => {
      const { pathname, query } = router;
      if (event.target.value === 'All') {
        delete query.byAttribute;
      } else {
        query.byAttribute = event.target.value;
      }

      const urlObj = {
        pathname,
        query: { ...query },
      };

      router.push(urlObj, undefined, { shallow: true });
    },
    [router],
  );

  return (
    <div className={classes.root} data-testid="activity-filters">
      <Typography variant="h6" className={classes.currentMonth}>
        {`${getMonth(new Date())} ${new Date().getFullYear()}`}
      </Typography>
      <FeatureFlag flag="feature.explorer.activityFeedFiltersEnabled">
        <div className={classes.selectContainer}>
          <div>{getLang('filterByText', { fallback: 'Filter By' })}</div>
          <Select
            data-testid="activity:filter-menu"
            fullWidth
            classes={{ select: classes.select }}
            variant="outlined"
            label={getLang('filterByText', { fallback: 'Filter By' })}
            value={router.query.byAttribute || 'All'}
            onChange={handleFilterChange}
          >
            {Object.keys(ACTIVITYFEED_FILTERS).map((filter) => (
              <MenuItem
                value={filter}
                key={filter}
                data-testid={`activity:filter-item:${filter}`}
                data-dd-action-name={`${getLang(filter, { fallback: filter })} filter`}
              >
                {getLang(filter, { fallback: filter })}
              </MenuItem>
            ))}
          </Select>
        </div>
      </FeatureFlag>
      <FeatureFlag flag="feature.explorer.activityFeedSortByEnabled">
        <TooltipPrimary
          title={getLang('comingSoonText', { fallback: 'Coming Soon!' })}
          className={classes.tooltip}
        >
          <div className={classes.selectContainer} data-testid="activity-feed:sort-container">
            <div>{getLang('sortByDisplayText', { fallback: 'Sort By' })}</div>
            <Select
              disabled
              fullWidth
              data-testid="activity:sort"
              classes={{ select: classes.select }}
              variant="outlined"
              label={getLang('sortByDisplayText', { fallback: 'Sort By' })}
              value={getLang('mostRecentText', { fallback: 'Most Recent' })}
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
      <Button
        variant={isCommentShown ? 'contained' : 'outlined'}
        className={classnames(classes.btnComment, { [classes.btnCommentActive]: isCommentShown })}
        onClick={handleClickOpenComments}
        disableRipple
        aria-label="comments"
        data-testid="comments"
      >
        <CommentIcon />
      </Button>
    </div>
  );
};

export default ActivityFilterBar;
