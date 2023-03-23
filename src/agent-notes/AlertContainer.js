import { useState, useCallback, useMemo } from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import Box from '@mui/material/Box';
import { useFeature } from '@/features';
import useAthena from '@/hooks/useAthena';
import { useAlertSummary } from '@/hooks/useAlertSummary';
import ConnectedSideNavCards from '@/components/Base/ConnectedSideNavCards/ConnectedSideNavCards';
import CreateAlertButton from './CreateAlertButton';
import useGetAgentAlert from './useGetAgentAlert';
import CreateAlertForm from './CreateAlertForm';
import MarkAsRead from './MarkAsRead';

const useStyles = makeStyles((theme) => ({
  scrollContainer: {
    padding: theme.utils.fromPx(24),
    height: '100%',
    overflowY: 'auto',
  },
  noAlerts: {
    marginTop: theme.utils.fromPx(10),
    marginBotton: theme.utils.fromPx(24),
    textAlign: 'center',
  },
  alerts: {
    margin: `${theme.utils.fromPx(10)} 0px ${theme.utils.fromPx(24)} 0px`,
    textAlign: 'center',
    color: '#602B00',
  },
}));

const AlertContainer = () => {
  const classes = useStyles();
  const { getLang } = useAthena();
  const createAgentAlertBtnEnabled = useFeature('feature.explorer.createAgentAlertBtnEnabled');
  const [showCreateAlertForm, setShowCreateAlertForm] = useState(false);

  const { data: agentAlerts = [], mutate: mutateGetAgentAlert } = useGetAgentAlert();
  const alertDataValues = useMemo(() => Object.values(agentAlerts));
  const { mutate: mutateAlertSummary } = useAlertSummary();

  const onAfterCreateAlert = useCallback(() => {
    setShowCreateAlertForm(false);
    mutateGetAgentAlert();
    mutateAlertSummary();
  }, [mutateAlertSummary, mutateGetAgentAlert, setShowCreateAlertForm]);

  const handleMarkAsRead = useCallback(() => {
    mutateGetAgentAlert();
    mutateAlertSummary();
  }, [mutateAlertSummary, mutateGetAgentAlert]);

  return (
    <div className={classes.scrollContainer}>
      <Grid>
        {showCreateAlertForm ? (
          <CreateAlertForm
            onAfterSubmit={onAfterCreateAlert}
            onClose={() => setShowCreateAlertForm(false)}
          />
        ) : (
          <>
            {createAgentAlertBtnEnabled && (
              <form>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <CreateAlertButton onClick={() => setShowCreateAlertForm(true)} />
                </Box>
                <p className={classes.alerts} data-testid="alert:agent alert maximum">
                  {getLang('maximumAgentAlertText', { fallback: '2 alerts per agent maximum' })}
                </p>
              </form>
            )}
            {alertDataValues?.length > 0 ? (
              <>
                {alertDataValues.map((alert) => (
                  <ConnectedSideNavCards key={alert.id}>
                    <MarkAsRead alertData={alert} onMarkAsRead={handleMarkAsRead} />
                  </ConnectedSideNavCards>
                ))}
                <p className={classes.noAlerts} data-testid="alert:end of alerts">
                  {getLang('endAgentAlertText', { fallback: 'End of Alerts' })}
                </p>
              </>
            ) : (
              <p className={classes.noAlerts} data-testid="alert:no agent alert">
                {getLang('noAgentAlertText', { fallback: 'No Agent Alerts' })}
              </p>
            )}
          </>
        )}
      </Grid>
    </div>
  );
};

export default AlertContainer;
