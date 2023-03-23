import { getSessionStorageItemByKey } from '@/utils/sessionStorage';
import { datadogLogs } from '@datadog/browser-logs';
import { intervalToDuration } from 'date-fns';
import { isNumber } from 'lodash';
import Events from './Events';

export default class BaseCommunicator {
  model = null;

  initialized = false;

  incidentStartData = {};

  constructor(model) {
    this.model = model;
    this.emit(Events.INITIALIZED);

    if (typeof window !== typeof undefined) {
      window.addEventListener('gwf:process', this.processGuidedWorkflow.bind(this));
    }
  }

  getIncidentStartData() {
    return this.incidentStartData;
  }

  getModel() {
    return this.model;
  }

  emit(type, data) {
    const { logger } = datadogLogs;

    const event = { type, data };

    logger?.info('[CSRB -> OSvC] emitting', { event });

    this.model
      .then((parent) => {
        parent.emit(type, data);
        if (type === Events.INITIALIZED) this.initialized = true;
      })
      .catch((error) => {
        logger.error('[CSRB -> OSvC] failed to handle event', { error });
      });

    return this;
  }

  processGuidedWorkflow(event) {
    const {
      detail: { activityId, currentContext },
    } = event;
    const ts = getSessionStorageItemByKey('gwf:history', `gwf:ts:${activityId}`);
    const start = new Date(Number.parseInt(isNumber(ts) ? ts : 0, 10));
    const timeSpent = intervalToDuration({ start, end: new Date() });
    this.emit('guidedWorkflowComplete', { context: currentContext, timeSpent });
  }
}
