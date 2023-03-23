import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import NavigationSidebar from '@components/NavigationSidebar';

const ThreeColumnLayout = ({ classes, children, content = null, sidebar = null }) => {
  return (
    <main role="main" className={classes.root}>
      <section data-testid="nav-section">
        <NavigationSidebar className={classes.nav} />
      </section>
      <section className={classes.section} data-testid="sidebar-section">
        {sidebar}
      </section>
      <section className={classes.section} data-testid="primary-section">
        {children || content}
      </section>
    </main>
  );
};

ThreeColumnLayout.propTypes = {
  classes: PropTypes.object.isRequired,
  sidebar: PropTypes.node,
  children: PropTypes.node,
  content: PropTypes.node,
};

/** TODO: Fix me for mobile, jpemberton1! **/
const styles = {
  root: {
    display: 'grid',
    gridTemplateColumns: '4rem 22.5rem 1fr',
    height: '100%',
    minHeight: '1vh',
  },
  /** TODO: Remove me **/
  nav: {
    background: '#163977',
    width: '4rem',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    background: '#f6f7f8',
  },
};

export default withStyles(styles)(ThreeColumnLayout);
