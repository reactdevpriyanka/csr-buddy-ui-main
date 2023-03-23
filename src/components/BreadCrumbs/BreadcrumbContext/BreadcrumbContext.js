import { DefaultBreadcrumbContext } from '@/constants/breadcrumbConst';
import { createContext } from 'react';

const BreadcrumbContext = createContext(DefaultBreadcrumbContext);

export default BreadcrumbContext;
