import { AllowableActionTypes } from '@/components/Order/OrderDetailsView/utils';
import axios from 'axios';
import useSWR from 'swr';

export default function useAllowableActions(orderNumber) {
  const { data: allowableActions, error } = useSWR(
    orderNumber ? `/api/v1/orders/${orderNumber}/allowable-actions` : null,
    async (url) => axios.get(url).then(({ data }) => data),
    {
      revalidateOnFocus: false,
    },
  );

  /**
   * @actionType      {string}   Represents what type of action you are looking to check for
   * @actionName      {string}   Represents the action you are checking for
   * @releaseActionID {string}   If the type is 'Release_Action' then you must also have the releaseId of the actions you are checking on
   */
  const isActionAllowed = ({
    actionType = AllowableActionTypes.ORDER_ACTIONS,
    actionName = '',
    releaseActionID,
  }) => {
    if (!allowableActions) {
      return false;
    }

    const result = releaseActionID
      ? allowableActions[actionType][releaseActionID]?.includes(actionName)
      : allowableActions[actionType]?.includes(actionName);

    return result;
  };

  return {
    allowableActions,
    error,
    isActionAllowed,
  };
}
