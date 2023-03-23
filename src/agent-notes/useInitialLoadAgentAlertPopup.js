import { useEffect, useCallback, useContext } from 'react';
import { useSnackbar } from 'notistack';
import { useFeature } from '@/features';
import ModalContext, { MODAL } from '@components/ModalContext';
import { getDayDateYearTimeTimezone } from '@utils/dates';
import { SNACKVARIANTS } from '@/components/SnackMessage/SnackMessage';
import useAthena from '@/hooks/useAthena';
import useGetAgentAlert from './useGetAgentAlert';

const ALERT_SNACKBAR_FEATURE_FLAG = 'feature.explorer.alertSnackBarEnabled';

export default function useInitialLoadAgentAlertPopup() {
  // const initialLoad = useRef(true);
  const { enqueueSnackbar } = useSnackbar();
  const { setModal, modal, initialLoad, setInitialLoad } = useContext(ModalContext);
  const isCommentShown = modal === MODAL.ARCHIVECONTAINER;
  const alertSnackBarEnabled = useFeature(ALERT_SNACKBAR_FEATURE_FLAG);

  const { data: agentAlerts } = useGetAgentAlert();
  const { getLang } = useAthena();

  const handleClickOpenComments = useCallback(() => {
    setModal(isCommentShown ? null : MODAL.ARCHIVECONTAINER);
  }, [isCommentShown, setModal]);

  useEffect(() => {
    //show alerts
    const unacknowledgedAlerts = agentAlerts?.filter(
      (agentAlert) => agentAlert?.details?.acknowledged === 'false',
    );
    const firstAlert = unacknowledgedAlerts?.[0];
    if (initialLoad && firstAlert && alertSnackBarEnabled) {
      enqueueSnackbar(
        {
          variant: SNACKVARIANTS.WARNING,
          messageHeader: `Alert - ${firstAlert?.details?.issueType}`,
          messageSubheader: (
            <div>
              Most Recent Agent Alert left on{' '}
              <b>{getDayDateYearTimeTimezone(firstAlert?.createdDate)}</b> |{' '}
              {firstAlert?.details?.agentName || ''}
            </div>
          ),
          link: {
            label: getLang('agentViewAlertText', { fallback: 'View Alert' }),
            onClick: handleClickOpenComments,
          },
        },
        {
          key: firstAlert.id,
          persist: true,
          preventDuplicate: true,
        },
      );
      setInitialLoad(false);
    }
  }, [agentAlerts, alertSnackBarEnabled]);
}
