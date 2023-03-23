import { useEffect, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useFeature } from '@/features';
import ModalContext, { MODAL } from '@components/ModalContext';
import { getDayDateYearTimeTimezone } from '@utils/dates';
import { SNACKVARIANTS } from '@/components/SnackMessage/SnackMessage';

const ALERT_SNACKBAR_FEATURE_FLAG = 'feature.explorer.alertSnackBarEnabled';

export default function AgentAlertPopup({ children = null, agentAlerts }) {
  const { enqueueSnackbar } = useSnackbar();

  const alertSnackBarEnabled = useFeature(ALERT_SNACKBAR_FEATURE_FLAG);

  const { setModal, modal } = useContext(ModalContext);

  const isCommentShown = modal === MODAL.ARCHIVECONTAINER;

  const handleClickOpenComments = useCallback(() => {
    setModal(isCommentShown ? null : MODAL.ARCHIVECONTAINER);
  }, [isCommentShown, setModal]);

  useEffect(() => {
    const unacknowledgedAlerts = agentAlerts?.filter(
      (agentAlert) => agentAlert?.details?.acknowledged === 'false',
    );
    const first = unacknowledgedAlerts?.[0];
    if (first && alertSnackBarEnabled) {
      enqueueSnackbar(
        {
          key: alert.id,
          variant: SNACKVARIANTS.WARNING,
          messageHeader: `Alert - ${first?.details?.issueType}`,
          messageSubheader: (
            <div>
              Most Recent Agent Alert left on{' '}
              <b>{getDayDateYearTimeTimezone(first?.createdDate)}</b> |{' '}
              {first?.details?.agentName || ''}
            </div>
          ),
          link: { label: 'View Alert', onClick: handleClickOpenComments },
        },
        { persist: true },
      );
    }
  }, []);

  return null;
}

AgentAlertPopup.propTypes = {
  children: PropTypes.node,
};
