import { useContext, cloneElement, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import CustomerSidebar from '@components/CustomerSidebar';
import ModalContext, { MODALCOMPONENT } from '@components/ModalContext';
import ResponsiveDebug from '@components/ResponsiveDebug';
import useEnv from '@/hooks/useEnv';
import * as blueTriangle from '@utils/blueTriangle';
import ResetPasswordModal from '@components/ResetPasswordModal';
import CallWrapupDialog from '@components/CallWrapupDialog';
import { TransactionsNav } from '@/core';
import useInitialLoadAgentAlertPopup from '@/agent-notes/useInitialLoadAgentAlertPopup';
import TwoColumnLayout from './TwoColumnLayout';

const useStyles = makeStyles(() => ({
  section: {
    height: '100%',
    padding: '0rem 1.5rem',
  },
}));

const CustomerSidebarLayout = ({ children, ...props }) => {
  const classes = useStyles();
  const { modal, modalProps } = useContext(ModalContext);

  const [componentInitialized, setComponentInitialized] = useState(false);
  const pageName = 'Customer Info Bar - VT';

  useEffect(() => {
    // do component load work
    setComponentInitialized(true);
    blueTriangle.start(pageName);
  }, []);

  useEffect(() => {
    if (componentInitialized) {
      // do component unload
      blueTriangle.end(pageName);
    }
  }, [componentInitialized]);

  const sidebar = <CustomerSidebar />;

  let modalComponent = null;
  if (MODALCOMPONENT.hasOwnProperty(modal)) {
    modalComponent = MODALCOMPONENT[modal];
  }

  const proppedModal = modalComponent ? cloneElement(modalComponent, modalProps) : null;

  const { responsiveDebug } = useEnv();

  useInitialLoadAgentAlertPopup(); //initial alert pop up on page load

  return (
    <>
      {responsiveDebug && <ResponsiveDebug />}
      <TwoColumnLayout sidebar={sidebar} modal={proppedModal}>
        <TransactionsNav />
        <section data-testid={props['data-testid']} className={classes.section}>
          {children}
        </section>
      </TwoColumnLayout>
      <CallWrapupDialog />
      <ResetPasswordModal />
    </>
  );
};

CustomerSidebarLayout.propTypes = {
  children: PropTypes.node,
  sidebar: PropTypes.node,
  customerId: PropTypes.string,
  'data-testid': PropTypes.string,
};

export default CustomerSidebarLayout;
