import { useMemo } from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@/components/Button';
import useAthena from '@/hooks/useAthena';
import useCSRInfo from '@/hooks/useCSRInfo';
import useOracle from '@/hooks/useOracle';
import useGetAgentAlert from './useGetAgentAlert';

const useStyles = makeStyles((theme) => ({
  button: {
    width: '80%',
    height: '42px',

    /**
     * @see {https://chewyinc.atlassian.net/browse/CSRBT-2179}
     * @see {https://www.figma.com/file/y3Xyap6kqFgkHYCtI9EN0m/Dev-Ready?node-id=10159%3A49743}
     */
    fontWeight: 700,
    border: `${theme.utils.fromPx(2)} solid ${theme.palette.primary.alternate}`,
    color: theme.palette.white,
    '&.solid': {
      background: theme.palette.primary.alternate,
      '&:hover': {
        background: theme.palette.primary.main,
      },
    },
  },
}));

export default function CreateAlertButton({ onClick = () => {} }) {
  const classes = useStyles();
  const { getLang } = useAthena();

  const { data: agentAlerts = [] } = useGetAgentAlert();
  const { data: csr } = useCSRInfo();
  const agentId = csr?.logonId;

  const oracle = useOracle();
  const interactionId = oracle?.getIncidentStartData()?.interactionId;

  const isButtonEnabled = useMemo(() => {
    const alertsByCurrentAgent = agentAlerts.filter(
      (alert) =>
        interactionId === alert?.details?.interactionId && agentId === alert?.details?.agentId,
    );

    return alertsByCurrentAgent.length < 2;
  }, [agentId, agentAlerts, interactionId]);

  const buttonLabel = isButtonEnabled
    ? getLang('createAgentAlertBtnText', { fallback: 'Create Agent Alert' })
    : getLang('alertLimitReachedBtnText', { fallback: 'Alert Limit Reached' });

  return (
    <Button
      aria-label={buttonLabel}
      className={classes.button}
      data-testid={isButtonEnabled ? 'alert:create agent alert' : 'alert:alert limit reached'}
      disabled={!isButtonEnabled}
      onClick={onClick}
      solid={isButtonEnabled /* prevent .solid styles from overriding .disabled ones */}
      type="submit"
    >
      {buttonLabel}
    </Button>
  );
}

CreateAlertButton.propTypes = {
  onClick: PropTypes.func,
};
