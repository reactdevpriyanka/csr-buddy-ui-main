import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import cn from 'classnames';
import Link from 'next/link';
import { ReactComponent as Logo } from '@icons/chewy-full.svg';
import { ReactComponent as CustomerIcon } from '@icons/user-circle.svg';
import { ReactComponent as OrderIcon } from '@icons/receipt.svg';
import { ReactComponent as AutoshipIcon } from '@icons/autoship-mono.svg';
import { ReactComponent as ReturnIcon } from '@icons/return.svg';
import { ReactComponent as ShelterRescueIcon } from '@icons/shelter.svg';
import { ReactComponent as TicklerIcon } from '@icons/tickler.svg';
import { ReactComponent as KbIcon } from '@icons/book.svg';
import { ReactComponent as SettingsIcon } from '@icons/settings.svg';
import { ReactComponent as TWebberIcon } from '@icons/agent.svg';

const NavigationSidebar = ({ className, classes }) => {
  const links = [
    [
      {
        title: 'Customers',
        icon: CustomerIcon,
        route: '/',
      },
      {
        title: 'Orders',
        icon: OrderIcon,
        route: '/orders',
      },
      {
        title: 'Autoship',
        icon: AutoshipIcon,
        route: '/autoship',
      },
      {
        title: 'Returns',
        icon: ReturnIcon,
        route: '/returns',
      },
      {
        title: 'Shelters and Rescues',
        icon: ShelterRescueIcon,
        route: '/shelters-rescues',
      },
      {
        title: 'Ticklers',
        icon: TicklerIcon,
        route: '/ticklers',
      },
    ],
    [
      {
        title: 'Kb',
        icon: KbIcon,
        route: '/knowledge-base',
      },
      {
        title: 'Settings',
        icon: SettingsIcon,
        route: '/settings',
      },
      {
        title: 'TWebber',
        icon: TWebberIcon,
        route: '/account',
      },
    ],
  ];

  return (
    <div data-testid="sidebar-navigation" className={cn(className, classes.root)}>
      <nav
        className={classes.nav}
        aria-label="Application navigation"
        title="Application navigation"
      >
        <h1 data-testid="logo" className={classes.logo} aria-label="Application logo">
          <figure className={classes.figure}>
            <Logo fill="#128CED" className={classes.icon} />
          </figure>
        </h1>
        <div className={classes.menu}>
          {links.map((linkGroup, index) => {
            return (
              <ul key={index} className={classes.list}>
                {linkGroup.map((link) => {
                  return (
                    <li key={link.title}>
                      <Link
                        data-testid={
                          link.route.slice(1) !== ''
                            ? link.route.slice(1) + '-link'
                            : 'customers-link'
                        }
                        href={link.route}
                        className={cn(classes.link)}
                        aria-label={link.title}
                      >
                        <figure className={classes.figure}>
                          <link.icon fill="#FFF" className={classes.icon} />
                          <figcaption className={classes.title}>{link.title}</figcaption>
                        </figure>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

NavigationSidebar.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
};

const styles = {
  root: {
    display: 'relative',
  },
  nav: {
    height: '100%',
    maxHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#163977',
    position: 'fixed',
    width: '4rem' /** @TODO : Can we make this dynamic based off parent's (grid) width? */,
  },
  menu: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: '1',
    justifyContent: 'space-between',
  },
  list: {
    listStyle: 'none',
    padding: '0',
    margin: '0',
  },
  logo: {
    display: 'block',
    margin: '0 auto',
    width: '100%',
    padding: '24px 0 24px 0',
  },
  link: {
    display: 'block',
    margin: '0 auto',
    width: '100%',
    color: 'white',
    textDecoration: 'none',
    padding: '6px 0 6px 0',
  },
  activeLink: {
    background: 'white',
    color: '#163977',
  },
  figure: {
    width: '60%',
    margin: '0 auto',
    height: 'auto',
  },
  icon: {
    width: '100%',
    height: 'auto',
  },
  title: {
    fontSize: '8px',
    textTransform: 'uppercase',
    margin: '2px auto',
    textAlign: 'center',
    fontWeight: 'bold',
  },
};

export default withStyles(styles)(NavigationSidebar);
