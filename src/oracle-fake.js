import { FakeCommunicator } from '@components/OracleCommunicator';

if (typeof window !== typeof undefined) {
  const communicator = new FakeCommunicator();
  window.__ORACLE__ = communicator;
}
