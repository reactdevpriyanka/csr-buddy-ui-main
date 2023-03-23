import useEnv from '@/hooks/useEnv';

export default function ConfigPageDemo() {
  const env = useEnv();

  if (env) {
    return <div>{JSON.stringify(env)}</div>;
  }

  return <div>{'Nothing yet'}</div>;
}
