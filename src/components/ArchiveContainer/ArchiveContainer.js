import { useState, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ModalSideHeader from '@components/ModalSideHeader/ModalSideHeader';
import AlertHorizontalBtnNav from '@components/AlertHorizontalBtnNav';
import { coalesce } from '@/utils';
import { useAlertSummary } from '@/hooks/useAlertSummary';
import { useFeature } from '@/features';
import { AlertContainer } from '@/agent-notes';
import AgentAlertsCount from '@components/ArchiveContainer/AgentAlertsCount';
import CommentContainer from '../CommentContainer';
import OldCommentContainer from '../OldCommentContainer';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.white,
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  scrollContainer: {
    overflowY: 'auto',
    marginTop: theme.utils.fromPx(24),
  },
}));

const OLD_COMMENT_CONTAINER_FEATURE_FLAG = 'feature.explorer.oldCommentContainerEnabled';

const ALERT_FEATURE_FLAG = 'feature.explorer.alertTabEnabled';

const ArchiveContainer = () => {
  const classes = useStyles();
  const oldCommentContainerEnabled = useFeature(OLD_COMMENT_CONTAINER_FEATURE_FLAG);
  const alertEnabled = useFeature(ALERT_FEATURE_FLAG); //agent alert feature flag

  const { data } = useAlertSummary();

  const TABS = useMemo(
    () => [
      {
        tab: 'Agent Alerts',
        component: (
          <AgentAlertsCount count={data?.unAcknowledgedAlerts ? data?.unAcknowledgedAlerts : 0} />
        ),
      },
      {
        tab: '1.0 Comments',
        component: '1.0 Comments',
      },
    ],
    [data],
  );

  const tabsList = useMemo(() => coalesce([alertEnabled ? TABS[0] : null, TABS[1]]), [
    alertEnabled,
    data,
  ]);

  const [selectedTab, setSelectedTab] = useState(tabsList[0].tab);

  const onTabSelect = (value) => {
    setSelectedTab(value);
  };

  return oldCommentContainerEnabled ? (
    <OldCommentContainer />
  ) : (
    <div className={classes.root}>
      <ModalSideHeader text="Alerts &amp; Comments Archive" />
      <AlertHorizontalBtnNav activeTab={selectedTab} onChange={onTabSelect} tabs={tabsList} />
      {selectedTab === TABS[0].tab && <AlertContainer />}
      {selectedTab === TABS[1].tab && <CommentContainer />}
    </div>
  );
};

export default ArchiveContainer;
