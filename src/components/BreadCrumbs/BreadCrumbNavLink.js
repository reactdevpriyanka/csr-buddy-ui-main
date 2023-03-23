/* eslint-disable jsx-a11y/anchor-is-valid */
import { makeStyles } from '@material-ui/core/styles';
import cn from 'classnames';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme) => ({
  navLink: {
    fontFamily: 'Roboto',
    fontWeight: '600',
    fontStyle: 'Regular',
    fontSize: '11px',
    lineHeight: '16px',
    letterSpacing: '0.25px',
    color: '#031657',
    display: 'block',
    textDecoration: 'none',
    textTransform: 'uppercase',

    '&:focus, &:hover': {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  },
  disabled: {
    pointerEvents: 'none !important',
    cursor: 'default !important',
    color: 'black',
    fontWeight: '500',
  },
}));

const BreadCrumbNavLink = ({ id = '', title = '', link, disabled = false }) => {
  const classes = useStyles();
  const router = useRouter();

  return (
    <div className={classes.navBarLink} data-testid="bread-crumb-nav-bar">
      <Link
        href={{
          pathname: link,
          query: router.query,
        }}
      >
        <a
          className={cn(classes.navLink, disabled && classes.disabled)}
          data-testid={`navLink_${id}`}
          disabled={disabled}
          key={id}
        >
          {title}
        </a>
      </Link>
    </div>
  );
};

BreadCrumbNavLink.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

export default BreadCrumbNavLink;
