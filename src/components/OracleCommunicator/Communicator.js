import Postmate from 'postmate';
import { setAuthenticationHeaders } from '@/hooks/useCSPlatform';
import BaseCommunicator from './BaseCommunicator';
import Events from './Events';

export default class Communicator extends BaseCommunicator {
  constructor() {
    const model = {
      setBackofficeAuthentication({ token, at: authToken }) {
        setAuthenticationHeaders({ authToken, token });
        window.dispatchEvent(new CustomEvent(Events.REFRESH_TOKEN, { detail: { authToken } }));
      },
      openModalWrapupScreen(data) {
        window.dispatchEvent(new CustomEvent(Events.OPEN_WRAP_SCREEN, { detail: data }));
      },
      sendIncidentStartData: (data) => {
        this.incidentStartData = data;
      },
      refreshCsrbPage: () => {
        window.dispatchEvent(new CustomEvent(Events.REFRESH_PAGE));
      },
    };

    super(new Postmate.Model(model));
  }
}
