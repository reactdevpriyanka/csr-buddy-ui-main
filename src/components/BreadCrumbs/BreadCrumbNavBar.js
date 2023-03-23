import useBreadcrumbContext from '@/hooks/useBreadcrumbContext';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import BreadCrumbNavLink from './BreadCrumbNavLink';

const useStyles = makeStyles((theme) => ({
  crumbContainer: {
    display: 'flex',
  },
  navBar: {
    display: 'flex',
    marginBottom: '10px',
  },
  divider: {
    marginLeft: '5px',
    marginRight: '5px',
    fontFamily: 'Roboto',
    fontWeight: '600',
    fontStyle: 'Regular',
    fontSize: '11px',
    lineHeight: '16px',
    letterSpacing: '0.25px',
    color: '#031657',
  },
}));

const BreadCrumbNavBar = ({
  divider = '/',
  breadcrumb = {
    id: '',
    title: '',
    link: '',
    disabled: false,
  },
}) => {
  const classes = useStyles();
  const { breadcrumbs, addBreadcrumb } = useBreadcrumbContext();

  useEffect(() => {
    if (
      breadcrumb &&
      !_.isEmpty(breadcrumb?.id) &&
      !_.isEmpty(breadcrumb?.title) &&
      !_.isEmpty(breadcrumb?.link)
    ) {
      addBreadcrumb(breadcrumb);
    }
  }, [breadcrumb]);

  return (
    <div className={classes.navBar} data-testid="bread-crumb-nav-bar">
      {(breadcrumbs || [])?.length > 1 &&
        (breadcrumbs || []).map(({ id, title, link }, index) => {
          const isLastCrumb = index < breadcrumbs.length - 1;
          return (
            <div key={id} className={classes.crumbContainer}>
              <BreadCrumbNavLink id={id} title={title} link={link} disabled={!isLastCrumb} />
              {isLastCrumb && <span className={classes.divider}>{divider}</span>}
            </div>
          );
        })}
    </div>
  );
};

BreadCrumbNavBar.propTypes = {
  breadcrumb: PropTypes.shape({
    disabled: PropTypes.bool,
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
  }),
  divider: PropTypes.string,
};

export default BreadCrumbNavBar;
