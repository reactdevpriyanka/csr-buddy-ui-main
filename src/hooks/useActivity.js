import axios from 'axios';
import { useEffect, useState } from 'react';
import useSanitizedRouter from './useSanitizedRouter';

export default function useActivity() {
  const { activityId } = useSanitizedRouter();

  const [activity, setActivity] = useState(null);

  useEffect(() => {
    if (activityId) {
      axios.get(`/api/v2/activities/order/${activityId}`).then((res) => {
        if (res?.data?.length > 0) {
          setActivity(res.data[0]);
        }
      });
    }
  }, [activityId]);

  if (activity) {
    const {
      data: { order },
    } = activity;
    const orderId = order.id;

    return {
      ...order,
      orderId,
    };
  }

  return null;
}
