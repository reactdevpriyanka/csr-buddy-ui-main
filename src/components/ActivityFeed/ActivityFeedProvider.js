import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import useEnv from '@/hooks/useEnv';
import { processActivities } from '@/utils/activities';
import {
  MENUITEM_ALL,
  ACTIVITYFEED_FILTERS,
  MENUITEM_AUTOSHIP,
} from '@components/ActivityFeed/activityFilters';
import useParentSubscriptions from '@/hooks/useParentSubscriptions';
import useAthena from '@/hooks/useAthena';

const MAX_PAGES = 3;
export const FETCH_ALL = 'FETCH_ALL';

export const FILTER_OPTIONS = {
  ACTIVITYFEED: 'Activity Feed',
  AUTOSHIP: 'Autoship',
};

/* Start with todays date + 1 day just to be sure we get all of today's activities */
const today = new Date();
today.setDate(today.getDate() + 1);
const startDateStr = format(today, 'yyyy-MM-dd');

const getActivitiesUrl = (page = 0, customerId, paginationSize) => {
  const range = page >= MAX_PAGES ? 99999 : paginationSize * (page + 1);
  return `/api/v1/activities/date?customerId=${customerId}&date=${startDateStr}&range=${range}`;
};

const statusReducer = (state, action) => {
  switch (action.type) {
    case 'NEXT_PAGE':
      return { ...state, page: state.page + 1 };
    case FETCH_ALL:
      return { ...state, page: MAX_PAGES };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};

export const ActivityFeedContext = createContext({});

const ActivityFeedProvider = ({ children }) => {
  const router = useRouter();
  const { id: customerId } = router.query;
  const { chewyEnv } = useEnv();
  const { getLang } = useAthena();
  const paginationSize = getLang('paginationSize');

  /* Needs to be a ref because updates to `status.isLoading`
  are often batched with other state changes, which
  make it an unreliable "should we fetch?" check */
  const isFetching = useRef(false);

  const [autoshipTabFilter, setAutoshipTabFilter] = useState(FILTER_OPTIONS.ACTIVITYFEED);
  const [activities, setActivities] = useState(null);
  const [status, dispatch] = useReducer(statusReducer, {
    page: 0,
    isLoading: false,
    error: null,
  });

  const [actFeedFilter, setActFeedFilter] = useState(MENUITEM_ALL);

  const { data: parentSubscriptions } = useParentSubscriptions(customerId);

  const fetchActivities = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await axios.get(getActivitiesUrl(status.page, customerId, paginationSize));
      setActivities(processActivities(chewyEnv, res?.data));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error });
    } finally {
      isFetching.current = false;
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  useEffect(() => {
    if (paginationSize) {
      fetchActivities();
    }
  }, [status.page, paginationSize]);

  const fetchNextActivities = () => {
    if (status.page < MAX_PAGES && !isFetching.current) {
      isFetching.current = true;
      dispatch({ type: 'NEXT_PAGE' });
    }
  };

  useEffect(() => {
    if (actFeedFilter !== MENUITEM_ALL) {
      dispatch({ type: FETCH_ALL });
    }
  }, [actFeedFilter]);

  const appeasements = useMemo(() => {
    let appeasements = {};
    for (const activity of activities || []) {
      const appArr = activity?.data?.incident?.appeasements || [];
      for (const appeasement of appArr) {
        appeasements[appeasement.appeasementId] = [
          ...(appeasements[appeasement.appeasementId] || []),
          appeasement,
        ];
      }
    }
    return appeasements;
  }, [activities]);

  const activitiesAfFiltered = useMemo(() => {
    //run the pages keeping data for both states
    //appeasements are required for returns filter
    const activitiesAfFiltered = [];
    if (actFeedFilter === MENUITEM_AUTOSHIP) {
      return parentSubscriptions;
    }
    for (const act of activities || []) {
      if (ACTIVITYFEED_FILTERS[actFeedFilter](act, { appeasements })) {
        activitiesAfFiltered.push(act);
      }
    }
    return activitiesAfFiltered;
  }, [activities, actFeedFilter]);

  /* Update an activity */
  const mutate = useCallback(
    async (cb) => {
      /* Callback to update in-place. No fetch required */
      if (typeof cb === 'function') {
        const updated = cb(activities);
        if (Array.isArray(updated)) {
          setActivities(updated);
        } else {
          throw new TypeError('Mutate must return an array of activities');
        }
      } else {
        fetchActivities();
      }
    },
    [activities],
  );

  return (
    <ActivityFeedContext.Provider
      value={{
        activities,
        activitiesAfFiltered,
        parentSubscriptions,
        mutate,
        fetchNextActivities,
        isComplete: status.page === MAX_PAGES,
        ...status,
        actFeedFilter,
        setActFeedFilter,
        autoshipTabFilter,
        setAutoshipTabFilter,
      }}
    >
      {children}
    </ActivityFeedContext.Provider>
  );
};

ActivityFeedProvider.propTypes = {
  children: PropTypes.node,
};

export default ActivityFeedProvider;
