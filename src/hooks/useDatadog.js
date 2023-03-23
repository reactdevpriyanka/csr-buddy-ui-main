import { datadogLogs } from '@datadog/browser-logs';

export default function useDatadog() {
  return datadogLogs?.logger;
}
