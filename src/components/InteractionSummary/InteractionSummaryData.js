import PropTypes from 'prop-types';
import LegacyOrderInteractionSummaryData from '@components/InteractionSummary/LegacyOrderInteractionSummaryData';
import AgentInteractionAppeasementData from '@components/InteractionSummary/AgentInteractionAppeasementData';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import useFeature from '../../features/useFeature';

const useStyles = makeStyles((theme) => ({
  contactReason: {
    lineHeight: '1.35rem',
    fontWeight: '400',
    letterSpacing: '0.25px',
    marginTop: '10px',
    marginBottom: '6px',
  },
}));

const InteractionSummaryData = ({
  id,
  contactReason,
  appeasements,
  agentInteractionTypes,
  switchToUser,
}) => {
  const classes = useStyles();

  const viewAgentInteraction = useFeature('feature.explorer.viewAgentInteraction');
  const legacyAppeasements = appeasements?.filter(
    (appeasement) => !agentInteractionTypes.has(appeasement?.type),
  );
  const directAppeasements = appeasements?.filter((appeasement) =>
    agentInteractionTypes.has(appeasement?.type),
  );

  const switchToCustomerAppeasement = {
    appeasementId: 'SWITCH_TO_USER',
    type: 'SWITCH_TO_USER',
    description: 'message.interactionSummary.switchToUser.modified',
  };

  const agentAppeasements = switchToUser
    ? directAppeasements && directAppeasements.length > 0
      ? [...directAppeasements, switchToCustomerAppeasement]
      : [switchToCustomerAppeasement]
    : directAppeasements;

  const hasAppeasements = viewAgentInteraction
    ? appeasements.length > 0 || switchToUser
    : legacyAppeasements.length > 0;

  return (
    <div>
      {!hasAppeasements && contactReason && (
        <Typography
          data-testid={`contact-reason:${contactReason}`}
          variant="h6"
          className={classes.contactReason}
        >
          {contactReason}
        </Typography>
      )}
      {viewAgentInteraction && agentAppeasements && agentAppeasements.length > 0 && (
        <AgentInteractionAppeasementData id={id} appeasements={agentAppeasements} />
      )}
      {legacyAppeasements && legacyAppeasements.length > 0 && (
        <LegacyOrderInteractionSummaryData appeasements={legacyAppeasements} />
      )}
    </div>
  );
};

InteractionSummaryData.propTypes = {
  id: PropTypes.string,
  contactReason: PropTypes.string,
  appeasements: PropTypes.array,
  agentInteractionTypes: PropTypes.object.isRequired,
  switchToUser: PropTypes.bool,
};

export default InteractionSummaryData;
