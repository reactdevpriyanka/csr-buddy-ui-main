import { AllowableActionTypes } from '@/components/Order/OrderDetailsView/utils';
import axios from 'axios';
import useSWR from 'swr';

export default function useAllowableReturnActions(returnId) {
  //Return allowed actions
  const { data: allowableActions, error } = useSWR(
    returnId ? `/api/v1/returns/${returnId}/return-actions` : null,
    async (url) => axios.get(url).then(({ data }) => data),
  );

  /**
   * @actionType      {string}   Represents what type of action you are looking to check for
   * @actionName      {string}   Represents the action you are checking for
   * @releaseActionID {string}   If the type is 'Release_Action' then you must also have the releaseId of the actions you are checking on
   */
  const isActionAllowed = ({
    actionType = AllowableActionTypes.RETURN_ACTIONS,
    actionName = '',
  }) => {
    if (!allowableActions) {
      return false;
    }

    const result = allowableActions[actionType]?.includes(actionName);

    return result;
  };

  return {
    allowableActions,
    error,
    isActionAllowed,
  };
}
