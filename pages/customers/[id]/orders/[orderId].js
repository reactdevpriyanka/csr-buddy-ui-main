/* eslint-disable react/jsx-props-no-spreading */
import { useMemo } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import Progress from '@material-ui/core/CircularProgress';
import OrderDetailsView from '@/components/Order/OrderDetailsView';
import { generateItemMap } from '@/utils/items';
import useSanitizedRouter from '@/hooks/useSanitizedRouter';
import useAthena from '@/hooks/useAthena';
import ATHENA_KEYS from '@/constants/athena';
import OrderNotFound from '@/components/Order/OrderDetailsView/OrderNotFound/OrderNotFound';

export default function OrderDetailPage() {
  const { getLang } = useAthena();
  const { orderId } = useSanitizedRouter();

  const isContext = getLang(ATHENA_KEYS.TRACKING_PACKAGE_CONTEXT_MESSAGING_ENABLED, {
    fallback: false,
  });

  const versionStr = isContext ? 'v4' : 'v3';

  const { data: orderDetails, error, mutate: revalidateOrderDetails } = useSWR(
    orderId && `/api/${versionStr}/order-activities/${orderId}`,
    async (url) => axios.get(url).then(({ data }) => data),
    {
      revalidateOnFocus: false, // prefer manual revalidation
    },
  );

  const itemMap = useMemo(() => generateItemMap(orderDetails?.lineItems || []), [orderDetails]);

  if (error) {
    return <OrderNotFound />;
  }

  if (!orderDetails) {
    return <Progress />;
  }

  return (
    <div>
      <OrderDetailsView
        orderNumber={orderDetails.id}
        itemMap={itemMap}
        orderDate={orderDetails.timePlaced}
        orderDetails={orderDetails}
        revalidateOrderDetails={revalidateOrderDetails}
        {...orderDetails}
      />
    </div>
  );
}
