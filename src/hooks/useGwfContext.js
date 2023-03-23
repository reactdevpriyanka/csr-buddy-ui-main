import { GwfContext } from '@/components/Workflow/GwfContext';
import { useContext } from 'react';

export default function useGwfContext() {
  return useContext(GwfContext) || {};
}
