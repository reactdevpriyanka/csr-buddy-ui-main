import NavigationContext from '@/components/NavigationContext';
import { useContext } from 'react';

export default function useNavigationContext() {
  return useContext(NavigationContext) || {};
}
