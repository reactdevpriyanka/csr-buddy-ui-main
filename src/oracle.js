import Communicator from '@components/OracleCommunicator';

if (typeof window !== typeof undefined) {
  const communicator = new Communicator();
  window.__ORACLE__ = communicator;
}
