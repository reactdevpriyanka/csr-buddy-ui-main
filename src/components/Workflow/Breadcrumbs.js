/* eslint-disable jsx-a11y/anchor-is-valid */
import Link from 'next/link';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getSessionStorage } from '@/utils/sessionStorage';
import useAthena from '@/hooks/useAthena';
import ATHENA_KEYS from '@/constants/athena';
import useNavigationContext from '@/hooks/useNavigationContext';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.utils.fromPx(20),
    padding: `0 ${theme.utils.fromPx(10)}`,
  },
  active: {
    color: '#666',
    fontSize: theme.utils.fromPx(11),
    textTransform: 'uppercase',
  },
  inactive: {
    color: '#031657',
    fontSize: theme.utils.fromPx(11),
    letterSpacing: theme.utils.fromPx(0.25),
    textDecoration: 'none',
    textTransform: 'uppercase',
  },
  slash: {
    color: '#666',
    display: 'inline-block',
    marginLeft: theme.utils.fromPx(8),
    marginRight: theme.utils.fromPx(8),
  },
}));

const flows = {
  START: 'fixIssue-start',
  QUESTIONS: 'returns-ChooseItem',
  SUMMARY: 'returns-continueToSummary',
};

const Breadcrumbs = () => {
  const classes = useStyles();
  const { getLang, lang } = useAthena();

  const router = useRouter();
  const { prevRoute, resetPrevRoute } = useNavigationContext();

  const [breadcrumbs, setBreadcrumbs] = useState([]);

  const gwfVersion = getLang(ATHENA_KEYS.GWF_VERSION, { fallback: '1' });
  const isMultiItem = gwfVersion === '2';

  const { id: customerId } = router.query;

  const checkHistory = useCallback(() => {
    const sessionStorage = getSessionStorage('gwf:history') || {};
    const { activityId, flowName } = router.query;
    const crumbs = [];

    if (sessionStorage[`${flows.START}-${activityId}`] || flowName === flows.START) {
      if (isMultiItem) {
        crumbs.push({
          label: 'Questions',
          href: `/customers/${customerId}/workflows/${flows.START}/${activityId}`,
          active: flowName === flows.START,
        });
      } else {
        crumbs.push({
          label: 'Issues',
          href: `/customers/${customerId}/workflows/${flows.START}/${activityId}`,
          active: flowName === flows.START,
        });
      }
    }

    if (sessionStorage[`${flows.QUESTIONS}-${activityId}`] || flowName === flows.QUESTIONS) {
      crumbs.push({
        label: 'Questions',
        href: `/customers/${customerId}/workflows/${flows.QUESTIONS}/${activityId}`,
        active: flowName === flows.QUESTIONS,
      });
    }

    if (sessionStorage[`${flows.SUMMARY}-${activityId}`] || flowName === flows.SUMMARY) {
      crumbs.push({
        label: 'Summary',
        href: `/customers/${customerId}/workflows/${flows.SUMMARY}/${activityId}`,
        active: flowName === flows.SUMMARY,
      });
    }
    setBreadcrumbs(crumbs);
  }, [customerId, router.query, lang]);

  useEffect(() => {
    if (lang) {
      checkHistory();
    }
  }, [router.query, checkHistory, lang]);

  useEffect(() => {
    window.addEventListener('gwf:breadcrumbs:refresh', checkHistory);
    checkHistory();

    return () => {
      window.removeEventListener('gwf:breadcrumbs:refresh', checkHistory);
    };
  }, [checkHistory]);

  const handleClick = () => {
    window.dispatchEvent(new Event('gwf:breadcrumbs:navigate'));
  };

  const handleLinkClick = () => {
    resetPrevRoute();
  };

  const activityFeedHref = useMemo(
    () => (prevRoute ? prevRoute : `/customers/${customerId}/activity`),
    [prevRoute, customerId],
  );

  return (
    <div className={classes.root}>
      <Link href={activityFeedHref} onClick={handleLinkClick}>
        <a className={classes.inactive}>{'Home'}</a>
      </Link>
      {breadcrumbs.map((crumb) => (
        <span key={crumb.label}>
          <span className={classes.slash}>{'/'}</span>
          {crumb.active ? (
            <span className={classes.active}>{crumb.label}</span>
          ) : (
            <Link href={crumb.href}>
              {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
              <a onClick={handleClick} className={classes.inactive}>
                {crumb.label}
              </a>
            </Link>
          )}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumbs;
