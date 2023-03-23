import { useState } from 'react';
import PropTypes from 'prop-types';
import ModalContext, { MODAL } from '@components/ModalContext';

const RightModalProvider = ({ children }) => {
  const [modal, setModal] = useState(null);
  const [modalProps, setModalProps] = useState({});
  const [initialLoad, setInitialLoad] = useState({});

  const checkAndSetComponent = (component, { props: propsPending } = {}) => {
    if (component === null) {
      setModal(null);
      setModalProps(null);
      return;
    }
    if (!MODAL.hasOwnProperty(component)) {
      throw new Error(`component ${component} doesn't exist`);
    }
    setModal(component);
    setModalProps(propsPending || {});
  };

  const valueModalContext = {
    modal,
    modalProps,
    setModal: checkAndSetComponent,
    initialLoad,
    setInitialLoad,
  };

  return <ModalContext.Provider value={valueModalContext}>{children}</ModalContext.Provider>;
};

RightModalProvider.propTypes = {
  children: PropTypes.node,
};

export default RightModalProvider;
