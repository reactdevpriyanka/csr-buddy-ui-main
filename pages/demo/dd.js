import { useCallback } from 'react';
import axios from 'axios';
import useDatadog from '@/hooks/useDatadog';

export default function DatadogDemo() {
  const datadog = useDatadog();

  const onClick = useCallback(() => {
    datadog.logger.info('[CSRB]', { test: 'thing' });
  }, [datadog]);

  const onFailureTrigger = useCallback(() => {
    axios.get('/this/will/fail').catch(() => {});
  }, []);

  return (
    <div>
      <h1>{'Datadog Triggers'}</h1>
      <button onClick={onClick}>Trigger a click</button>
      <button onClick={onFailureTrigger}>Trigger a network failure</button>
    </div>
  );
}
