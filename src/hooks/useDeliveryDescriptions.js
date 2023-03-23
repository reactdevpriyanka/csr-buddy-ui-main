import useAthena from '@/hooks/useAthena';

export default function useDeliveryDescriptions() {
  const { getLang } = useAthena();

  const estimatedArrivalBy = getLang('estimatedArrivalByText', {
    fallback: 'Estimated Arrival by',
  });

  const newEstimatedDeliveryOn = getLang('newEstimatedDeliveryOnText', {
    fallback: 'New estimated delivery on',
  });

  const deliveredOn = getLang('deliveredOnText', {
    fallback: 'Delivered on',
  });

  return {
    NONE: estimatedArrivalBy,
    ON_TIME: estimatedArrivalBy,
    DELAYED: newEstimatedDeliveryOn,
    LATE: estimatedArrivalBy,
    ORDER_PLACED: deliveredOn,
    VERY_LATE: newEstimatedDeliveryOn,
    [null]: estimatedArrivalBy,
    [undefined]: estimatedArrivalBy,
  };
}
