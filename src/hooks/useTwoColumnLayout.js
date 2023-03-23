import { useContext } from 'react';
import { TwoColumnLayoutContext } from '@/components/Layout/TwoColumnLayout';

export default function useTwoColumnLayout() {
  return useContext(TwoColumnLayoutContext) || {};
}