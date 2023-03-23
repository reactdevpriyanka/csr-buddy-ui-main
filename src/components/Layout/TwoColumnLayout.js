import { createContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import Drawer from '@material-ui/core/Drawer';
import { makeStyles } from '@material-ui/core/styles';
import EnvironmentIcon from '@/components/EnvironmentIcon';
import FeatureFlag from '@/features/FeatureFlag';
import { useRouter } from 'next/router';
import useScrollLock from '@/hooks/useScrollLock';
import ToggleSidebarButton from './ToggleSidebarButton';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    flexShrink: 0,
    width: 0,
    '& .MuiDrawer-paper': {
      boxSizing: 'border-box',
      width: 0,
    },
    '&.sidebarOpen': {
      width: theme.utils.constants.customerContentWidth,
      '& .MuiDrawer-paper': {
        width: theme.utils.constants.customerContentWidth,
      },
    },
  },
  main: {
    flexGrow: 1,
    height: '100%',
  },
  customerSidebar: {
    '&.sidebarOpen': {
      height: '100vh',
    },
  },
  primarySection: {
    minHeight: '100vh',
  },
  orderDetailsPageBackground: {
    backgroundColor: '#F5F5F5',
  },
  rightModal: {
    position: 'fixed',
    bottom: '0',
    right: `-${theme.utils.constants.sideContentWidth}`,
    maxWidth: theme.utils.constants.sideContentWidth,
    zIndex: 15,
    width: '100%',
    height: '100vh',
  },
  rightModalClosing: {
    animation: `$myEffectExit 200ms ease-in-out`,
    transform: 'translateX(200%)',
  },
  rightModalIsOpen: {
    right: 0,
    animation: `$myEffect 300ms ease-in-out`,
  },
  overFlowXAuto: {
    overflowX: 'auto',
  },
  shadow: {
    ...theme.utils.heavyShadow,
  },
  ...theme.animations.sidebar,
}));
export const TwoColumnLayoutContext = createContext({});
/**
 * TODO:
 *
 * 1) This probably needs a rename
 * 2) The other 'layouts' probably need to be revisited also
 * 3) More tests... always more tests
 */
const TwoColumnLayout = ({ children, content, sidebar, modal = null }) => {
  const classes = useStyles();
  const [modalState, setModalState] = useState(null);
  const [rightModalClosing, setRightModalClosing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { lockScroll, unlockScroll } = useScrollLock();
  const router = useRouter();

  const isOrderDetailsPage = useMemo(() => {
    return router.asPath.includes('orders');
  }, [router]);

  useEffect(() => {
    if (!!modal) {
      setRightModalClosing(false);
      setModalState(modal);
    } else {
      setRightModalClosing(true);
      setTimeout(() => {
        setModalState(modal);
        unlockScroll();
      }, 200);
    }
  }, [modal]);

  useEffect(() => {
    if (!sidebarOpen) {
      unlockScroll();
    }
  }, [sidebarOpen]);

  return (
    <div className={classes.root}>
    <TwoColumnLayoutContext.Provider value={{sidebarOpen,setSidebarOpen}}>
      <Drawer
        anchor="left"
        className={cn(classes.drawer, { sidebarOpen })}
        open={sidebarOpen}
        variant="persistent"
      >
        <section
          className={cn(classes.customerSidebar, { sidebarOpen })}
          data-testid="sidebar-section"
          onMouseEnter={() => lockScroll()}
          onMouseLeave={() => unlockScroll()}
        >
          {sidebar}
        </section>
      </Drawer>
      <main role="main" className={classes.main}>
        <FeatureFlag flag="toggleSidebarEnabled">
          <ToggleSidebarButton
            sidebarOpen={sidebarOpen}
            onClick={() => setSidebarOpen((state) => !state)}
          />
        </FeatureFlag>
        <section
          className={cn(
            classes.primarySection,
            isOrderDetailsPage && classes.orderDetailsPageBackground,
          )}
          data-testid="primary-section"
        >
          <EnvironmentIcon />
          {content || children}
        </section>
        <section
          data-testid="modal-section"
          className={cn(classes.rightModal, {
            [classes.rightModalIsOpen]: Boolean(modalState),
          })}
          onMouseEnter={() => lockScroll()}
          onMouseLeave={() => unlockScroll()}
        >
          <div className={cn(classes.shadow, rightModalClosing && classes.rightModalClosing)}>
            <div className={classes.overFlowXAuto}>{modalState}</div>
          </div>
        </section>
      </main>
      </TwoColumnLayoutContext.Provider>
    </div>
  );
};

TwoColumnLayout.propTypes = {
  children: PropTypes.node,
  content: PropTypes.node,
  modal: PropTypes.node,
  sidebar: PropTypes.node,
};

export default TwoColumnLayout;
