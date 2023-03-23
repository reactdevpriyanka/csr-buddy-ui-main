import BreadcrumbContext from '@/components/BreadCrumbs/BreadcrumbContext';
import { useContext } from 'react';

export default function useBreadcrumbContext() {
  return useContext(BreadcrumbContext) || {};
}
