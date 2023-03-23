import OrderDetailsContext from '@/components/Order/OrderDetailsView/OrderDetailsContext';
import { useContext } from 'react';

export default function useOrderDetailsContext() {
  return useContext(OrderDetailsContext) || {};
}
