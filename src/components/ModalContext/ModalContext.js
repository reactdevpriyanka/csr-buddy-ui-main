import { createContext } from 'react';
import ArchiveContainer from '@/components/ArchiveContainer';
import ConnectedShipmentTracker from '@components/ShipmentTracker';
import { InteractionHistoryContainer } from '@/components/InteractionHistory';
import { AutoshipContainer } from '@/components/Autoship/AutoshipContainer';

export const MODAL = {
  SHIPMENTTRACKER: 'SHIPMENTTRACKER',
  ARCHIVECONTAINER: 'ARCHIVECONTAINER',
  INTERACTIONHISTORYCONTAINER: 'INTERACTIONHISTORYCONTAINER',
  AUTOSHIPCONTAINER: 'AUTOSHIPCONTAINER',
  CREATEAGENTALERTCONTAINER: 'CREATEAGENTALERTCONTAINER',
};

export const MODALCOMPONENT = {
  SHIPMENTTRACKER: <ConnectedShipmentTracker />,
  ARCHIVECONTAINER: <ArchiveContainer />,
  INTERACTIONHISTORYCONTAINER: <InteractionHistoryContainer />,
  AUTOSHIPCONTAINER: <AutoshipContainer />,
};

const ModalContext = createContext({
  //default values
  modal: null,
  displayed: null,
  setModal: () => {},
  initialLoad: true,
  setInitialLoad: () => {},
});

export default ModalContext;
