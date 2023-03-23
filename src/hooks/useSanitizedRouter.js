import { useRouter } from 'next/router';

export default function useSanitizedRouter() {
  const router = useRouter();

  const {
    activityId,
    id: customerId,
    flowName,
    orderId,
    returnId,
    petId,
    byAttribute,
    byAutoshipAttribute,
  } = router.query;

  const sanitizedFlowName = !/[ !"#$%&'()*+,./:;<=>?@[\\\]^_`{|}~]/.test(flowName)
    ? flowName
    : null;
  const sanitizedActivityId = activityId && /^\d+$/.test(activityId) ? activityId : null;
  const sanitizedCustomerId = customerId && /^\d+$/.test(customerId) ? customerId : null;
  const sanitizedOrderId = orderId && /^\d+$/.test(orderId) ? orderId : null;
  const sanitizedReturnId =
    returnId && !/[ !"#$%&'()*+,./:;<=>?@[\\\]^_`{|}~]/.test(returnId) ? returnId : null;
  const sanitizedPetId = petId && /^\d+$/.test(petId) ? petId : null;

  return {
    activityId: sanitizedActivityId,
    id: sanitizedCustomerId,
    flowName: sanitizedFlowName,
    orderId: sanitizedOrderId,
    returnId: sanitizedReturnId,
    petId: sanitizedPetId,
    byAttribute,
    byAutoshipAttribute
  };
}
