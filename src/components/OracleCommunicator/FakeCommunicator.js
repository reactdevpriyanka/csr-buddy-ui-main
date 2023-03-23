/* eslint-disable no-console */
import axios from 'axios';
import { setAuthenticationHeaders } from '@/hooks/useCSPlatform';
import BaseCommunicator from './BaseCommunicator';
import Events from './Events';

export default class FakeCommunicator extends BaseCommunicator {
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
      emit: (type, data) => {
        console.log('[FAKE ORACLE] captured event', { type, data });
        this.handleOracleEvent(type, data);
      },
    };

    super(Promise.resolve(model));
  }

  handleOracleEvent(type, data) {
    switch (type) {
      case 'initialized':
        console.log('[FAKE ORACLE] logging into BackOffice');
        axios
          .post('/app/api/login')
          .then(({ data }) => {
            console.log('[FAKE ORACLE] setting BackOffice authentication');
            console.log(this.getModel());
            this.getModel().then((parent) => parent.setBackofficeAuthentication({ ...data }));
          })
          .catch(console.log);

        console.log('[FAKE ORACLE] sending incident start data');
        this.getModel().then((parent) => parent.sendIncidentStartData({}));

        console.log('[FAKE ORACLE] to wrap use the following snippet:');
        console.log('window.__ORACLE__.wrap({ /* test data */ });');
        break;
      case 'osvc:openmodalwrapscreen':
        window.dispatchEvent(new CustomEvent(type, { detail: { reqJson: data } }));
        break;
      case 'fetchAuthenticationTokens':
        console.log('[FAKE ORACLE] refreshing auth token');
        axios
          .post('/app/api/login')
          .then(({ data }) => {
            console.log('[FAKE ORACLE] setting BackOffice authentication');
            console.log(this.getModel());
            this.getModel().then((parent) => parent.setBackofficeAuthentication({ ...data }));
          })
          .catch(console.log);
        break;
      default:
        console.log('[FAKE ORACLE] no fake path for event of type', type, data);
        break;
    }
  }
}
