import { useEffect, useMemo } from 'react';
import _ from 'lodash';
import { useRouter } from 'next/router';
import Progress from '@material-ui/core/CircularProgress';
import { useSnackbar } from 'notistack';
import { WorkflowLayout } from '@components/Layout';
import Workflow from '@components/Workflow';
import useWorkflowStart from '@/hooks/useWorkflowStart';
import { getSessionStorage } from '@/utils/sessionStorage';
import useEnv from '@/hooks/useEnv';
import useSuzzieTab from '@/hooks/useSuzzieTab';
import { SNACKVARIANTS } from '@components/SnackMessage/SnackMessage';
import { useOracle } from '@/hooks';
import axios from 'axios';
import useNavigationContext from '@/hooks/useNavigationContext';

export default function WorkflowPage() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { chewyEnv } = useEnv();
  const openInSuzzie = useSuzzieTab();
  const oracle = useOracle();

  const { id: customerId, activityId, flowName} = router.query;

  const sessionStorage = getSessionStorage('gwf:history') || {};
  const gwfHistory = sessionStorage[`${flowName}-${activityId}`];

  const { error, data = gwfHistory } = useWorkflowStart({ shouldFetch: !gwfHistory });
  const { prevRoute, resetPrevRoute } = useNavigationContext();

  const nodes = useMemo(() => Object.values(data?.nodeMap || {}), [data?.nodeMap]);
  const isSummaryPage = useMemo(() => nodes.some((node) => node.Component === 'TerminalNode'), [
    nodes,
  ]);

  useEffect(() => {
    if (data && isSummaryPage) {
      const { context } = data;
      const { orderId, returnResponse = false } = context;
      const returnId = returnResponse?.concessionReturnIds || returnResponse?.refundReturnIds || returnResponse?.replacementReturnIds
      if (returnResponse) {
        const {
          status = 'FAILURE',
          consolidatedReturnIds = 'No successful returns',
        } = returnResponse;
        const messageHeader = status === 'SUCCESS' ? 'Success' : 'An error has occurred';
        const linkOnClick = (event) => {
          router.push(
            `/customers/${customerId}/orders/${activityId}/order-returns-details/${returnId}`, //return link
          );
        };

        enqueueSnackbar(
          {
            key: activityId,
            variant: status === 'FAILURE' ? SNACKVARIANTS.ERROR : SNACKVARIANTS.SUCCESS,
            messageHeader,
            listItems: [`Return Status: ${status}`, `ReturnId: ${consolidatedReturnIds}`],
            link: { label: 'View Summary', onClick: linkOnClick },
          },
          { persist: false },
        );

        const startData = oracle?.getIncidentStartData();
        // eslint-disable-next-line no-console
        console.log('startData', startData);

        if (startData?.interactionId === null || startData?.interactionId === undefined) {
          // eslint-disable-next-line no-console
          console.log('Interaction ID is not defined in the payload from Oracle.');
        }

        const interactionData = {
          interactionId: startData.interactionId || null,
          customerId: customerId,
          type: 'GWF_FIX_ISSUE',
          details: {
            subjectId: orderId,
            action: 'CREATE',
            currentVal: context,
            prevVal: null,
          },
        };

        // Post interaction data to interaction SNS topic.
        //
        // If Oracle has given us an empty interactionId, then we pass it as `null` in the
        // payload and "UNKNOWN" in the URL, so the BE can still track all interactions.
        axios
          .post(`/api/v1/interaction/${startData.interactionId || 'UNKNOWN'}`, interactionData)
          .catch((error) => {
            enqueueSnackbar(
              {
                variant: SNACKVARIANTS.WARNING,
                message:
                  'An error has occured posting this interaction to the interaction queue. The guided workflow has still been submitted.',
              },
              {
                preventDuplicate: true,
                key: `${startData.interactionId}-err`,
              },
            );
          });
      } else {
        enqueueSnackbar(
          {
            key: activityId,
            variant: SNACKVARIANTS.SUCCESS,
            messageHeader: 'Success',
            messageSubheader: 'Guided workflow complete',
          },
          { persist: true },
        );
      }

      window.dispatchEvent(
        new CustomEvent('gwf:process', {
          detail: {
            activityId,
            currentContext: context,
          },
        }),
      );

      prevRoute ? router.push(prevRoute) : router.push(`/customers/${customerId}/activity`);    
      resetPrevRoute();
    }
  }, [
    data,
    chewyEnv,
    isSummaryPage,
    activityId,
    customerId,
    enqueueSnackbar,
    openInSuzzie,
    router,
    oracle,
  ]);

  const errorResponseStatus = error?.response?.status;
  useEffect(() => {
    if (errorResponseStatus) {
      let messageHeader =
        'An error has occurred while attempting to load this page. Please try again.';
      let messageSubheader;

      const { response } = error;
      switch (response?.status) {
        case 400:
          messageSubheader = 'This order is in a status that is not allowed for this issue.';
          try {
            const statusText = response?.data?.slice(
              response.data.indexOf('"') + 1,
              response.data.lastIndexOf('"'),
            );
            messageHeader = `${_.capitalize(statusText)}.`;
          } catch {
            messageHeader = 'There was a problem.';
          }
          break;
        case 404:
          messageHeader = "We couldn't find this order in the system. Please try again.";
          break;
        default:
          break;
      }

      enqueueSnackbar(
        {
          variant: SNACKVARIANTS.ERROR,
          messageHeader,
          messageSubheader,
        },
        {
          preventDuplicate: true,
          key: `${activityId}-err`,
        },
      );
    }
  }, [errorResponseStatus]);

  if (error) {
    return <div>{'There was a problem'}</div>;
  } else if (!data) {
    return (
      <div data-testid="gwf:loading">
        <Progress />
      </div>
    );
  }

  return isSummaryPage ? null : (
    <Workflow workflow={data} activityId={activityId} fromHistory={!!gwfHistory} />
  );
}

WorkflowPage.propTypes = {};

WorkflowPage.getLayout = () => WorkflowLayout;
