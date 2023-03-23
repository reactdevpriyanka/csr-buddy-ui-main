import { useContext } from 'react';
import { EnvContext } from '@/components/EnvContext';

export default function useEnv() {
  return useContext(EnvContext);
}
