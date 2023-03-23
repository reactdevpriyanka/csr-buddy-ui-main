/* eslint-disable jsx-a11y/anchor-is-valid */
import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { FeatureFlag } from '@/features';
import useRoles, { ROLES } from '@/hooks/useRoles';

const useStyles = makeStyles((theme) => ({
  root: {
    background: 'white',
    ...theme.m.y(8),
    ...theme.p.x(16),
    ...theme.p.t(24),
    ...theme.p.b(14),
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  link: {
    ...theme.fonts.body.normal,
    color: theme.palette.gray[400],
    fontFamily: 'Roboto',
    fontSize: theme.utils.fromPx(16),
    textDecoration: 'none',
    paddingBottom: theme.utils.fromPx(12),
    borderBottom: `${theme.utils.fromPx(2)} solid transparent`,
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: theme.utils.fromPx(19),
    letterSpacing: 0,
    ...theme.m.r(16),
    '&.active': {
      color: theme.palette.blue.dark,
      borderBottom: `${theme.utils.fromPx(2)} solid ${theme.palette.blue.dark}`,
      fontWeight: 500,
      lineHeight: theme.utils.fromPx(18.75),
    },
  },
}));

const AUTOSHIP_TAB_ENABLED = 'feature.explorer.autoshipTabEnabled';
const RETURNS_TAB_ENABLED = 'feature.explorer.returnsTabEnabled';
const HEALTHCARE_TAB_ENABLED = 'feature.explorer.healthcareTabEnabled';

export default function TransactionsNav() {
  const classes = useStyles();

  const router = useRouter();

  const { userRoles } = useRoles();

  const hasLCSRRole = useMemo(() => {
    return userRoles && userRoles?.includes(ROLES.LCSR);
  }, [userRoles]);

  const isActive = useCallback(
    (path) => {
      return router.pathname.endsWith(path);
    },
    [router],
  );

  return (
    <nav className={classes.root}>
      <Link
        href={{
          pathname: `/customers/${router.query.id}/activity`,
          query: router.query,
        }}
      >
        <a className={cn(classes.link, isActive('/activity') && 'active')}>{'Activity Feed'}</a>
      </Link>
      <FeatureFlag flag={AUTOSHIP_TAB_ENABLED}>
        <Link
          href={{
            pathname: `/customers/${router.query.id}/autoship`,
            query: router.query,
          }}
        >
          <a className={cn(classes.link, isActive('/autoship') && 'active')}>{'Autoship'}</a>
        </Link>
      </FeatureFlag>
      <FeatureFlag flag={RETURNS_TAB_ENABLED}>
        <Link
          href={{
            pathname: `/customers/${router.query.id}/order-returns`,
            query: router.query,
          }}
        >
          <a className={cn(classes.link, isActive('/order-returns') && 'active')}>{'Returns'}</a>
        </Link>
      </FeatureFlag>
      {hasLCSRRole && (
        <FeatureFlag flag={HEALTHCARE_TAB_ENABLED}>
          <Link
            href={{
              pathname: `/customers/${router.query.id}/healthcare`,
              query: router.query,
            }}
          >
            <a className={cn(classes.link, isActive('/healthcare') && 'active')}>{'Healthcare'}</a>
          </Link>
        </FeatureFlag>
      )}
    </nav>
  );
}
