import { getDayDateTimeTimezone } from '@/utils';
import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@mui/material';
import classnames from 'classnames';
import { isValid } from 'date-fns';
import { useMemo, useState } from 'react';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PopoverReport from '@components/InteractionSummary/SummaryPopperButton/PopoverReport';
import PropTypes from 'prop-types';
import { abbreviateLastName } from '@/utils/string';
import LegacyInteractionHistory from '@components/InteractionHistory/LegacyInteractionHistory';
import useAthena from '@/hooks/useAthena';
import AgentInteractionAppeasementData from '@components/InteractionSummary/AgentInteractionAppeasementData';
import PopoverComment from '../InteractionSummary/SummaryPopperButton/PopoverComment';
import SummaryPopperButton from '../InteractionSummary/SummaryPopperButton';
import TooltipPrimary from '../TooltipPrimary';
import { useShippingAppeasements } from '../InteractionSummary/utils';
import useFeature from '../../features/useFeature';

const useStyles = makeStyles((theme) => ({
  root: {
    ...theme.utils.lightShadow,
    borderRadius: theme.utils.fromPx(4),
    border: '2px solid #FFFFFF',
    transition: 'all 0.2s',
    backgroundColor: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#DDF0FF80',
      boxShadow: '0px 0px 4px 2px rgb(28, 73, 194, 0.6)',
    },
    '&:last-child': {
      marginBottom: theme.utils.fromPx(24),
    },
  },
  noWrap: {
    whiteSpace: 'nowrap',
  },
  rootIcon: {
    height: theme.utils.fromPx(26),
    width: theme.utils.fromPx(26),
    '& .MuiSvgIcon-root': {
      width: theme.utils.fromPx(17),
    },
  },
  leftGridItem: {
    width: '100%',
    paddingRight: theme.utils.fromPx(24),
  },
  rightColumn: {
    maxWidth: 'fit-content',
    '& .MuiGrid-item': {
      paddingBottom: theme.utils.fromPx(16),
    },
    '& .MuiGrid-item:last-child': {
      paddingBottom: theme.utils.fromPx(0),
    },
  },
  body: {
    padding: `${theme.utils.fromPx(16)} ${theme.utils.fromPx(16)}`,
  },
  border: {
    border: '2px solid #1C49C2',
    borderRadius: theme.utils.fromPx(10),
  },
  focusedInteractionIcon: {
    color: theme.palette.white,
    backgroundColor: '#1C49C2',
    cursor: 'auto',
    transition: 'all 0.3s',
    '&:hover': {
      color: theme.palette.white,
      backgroundColor: '#1C49C2',
    },
  },
  interactionIcon: {
    color: '#031657',
    backgroundColor: '#DBEBF9',
  },
  interactionDate: {
    fontSize: theme.utils.fromPx(12),
    fontWeight: 700,
    color: '#666666',
    display: 'inline-flex',
    whiteSpace: 'nowrap',
  },
  interactionDateHover: {
    color: '#555555',
  },
  agentContact: {
    fontWeight: 400,
    paddingLeft: theme.utils.fromPx(3),
  },
  orderNumber: {
    fontSize: theme.utils.fromPx(12),
    marginTop: theme.utils.fromPx(6),
    '&:not(:first-child)': {
      marginTop: theme.utils.fromPx(16),
    },
  },
  title: {
    fontSize: theme.utils.fromPx(12),
    marginTop: theme.utils.fromPx(6),
  },
  elipsisContainer: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  extraTopPadding: {
    marginTop: theme.utils.fromPx(16),
  },
}));

const InteractionHistoryCard = ({ interaction, contactChannelIcon }) => {
  const classes = useStyles();

  const [isFocused, setIsFocused] = useState(false);

  const { getKeys } = useAthena();
  const agentInteractionTypes = new Set(getKeys('feature.explorer.agentInteractionTypes'));

  const {
    createdAt,
    agentName,
    contactReason,
    specialNote,
    incidentId,
    disposition,
    switchToUser,
  } = interaction;

  let { appeasements } = interaction;

  appeasements = useShippingAppeasements(appeasements || []);

  const orderIds = useMemo(() => {
    return appeasements
      ?.filter((appeasement) => !agentInteractionTypes.has(appeasement?.type))
      ?.filter((appeasement) => appeasement?.appeasementId)
      ?.map((a) => a.appeasementId)
      ?.filter((value, index, self) => self.indexOf(value) === index);
  }, [appeasements]);

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
    <div
      data-testid="interaction-history-card"
      className={classnames(classes.root, classes.body, classes.border)}
      onMouseOver={() => setIsFocused(true)}
      onFocus={() => setIsFocused(true)}
      onMouseOut={() => setIsFocused(false)}
      onBlur={() => setIsFocused(false)}
    >
      <Grid container wrap="nowrap" justifyContent="flex-start">
        <Grid item className={classes.leftGridItem}>
          {isValid(new Date(createdAt)) && (
            <div
              data-testid="interaction-date:history-card"
              className={classnames(
                classes.interactionDate,
                isFocused ? classes.interactionDateHover : '',
              )}
            >
              <div>{getDayDateTimeTimezone(createdAt)} |</div>
              <TooltipPrimary title={agentName}>
                <div
                  className={classnames(classes.agentContact, classes.elipsisContainer)}
                  data-testid="agent-name:history-card"
                >
                  {abbreviateLastName(agentName)}
                </div>
              </TooltipPrimary>
            </div>
          )}
          {!hasAppeasements && contactReason && (
            <div className={classes.title}>Initial Contact Reason: {contactReason}</div>
          )}
          {viewAgentInteraction && agentAppeasements && agentAppeasements.length > 0 && (
            <AgentInteractionAppeasementData
              id={incidentId}
              isSummary={false}
              appeasements={agentAppeasements}
              agentInteractionTypes={agentInteractionTypes}
            />
          )}
          {legacyAppeasements && legacyAppeasements.length > 0 && (
            <LegacyInteractionHistory
              contactReason={contactReason}
              appeasements={legacyAppeasements}
              agentInteractionTypes={agentInteractionTypes}
            />
          )}
        </Grid>
        <Grid container direction="column" alignItems="end" className={classes.rightColumn}>
          <Grid item>
            <IconButton
              disableRipple
              aria-label="close"
              className={classnames(
                classes.rootIcon,
                isFocused ? classes.focusedInteractionIcon : classes.interactionIcon,
                {
                  iconButtonIsFocused: isFocused,
                },
              )}
            >
              {' '}
              {contactChannelIcon}
            </IconButton>
          </Grid>
          <Grid item>
            <SummaryPopperButton
              data-testid="contact-details:history-card"
              icon={<ContentPasteIcon />}
              classes={{ iconButton: classes.rootIcon }}
            >
              <PopoverComment
                specialNote={specialNote}
                disposition={disposition}
                incidentNumber={incidentId}
                initialContactReason={contactReason}
                appeasements={appeasements}
                orderIds={orderIds}
              />
            </SummaryPopperButton>
          </Grid>
          <Grid item>
            <SummaryPopperButton
              tempDisabled={false}
              icon={<InfoOutlinedIcon />}
              classes={{ iconButton: classes.rootIcon }}
            >
              <PopoverReport
                data-testid="concession-refund-popover:history-card"
                appeasements={appeasements}
              />
            </SummaryPopperButton>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

InteractionHistoryCard.propTypes = {
  interaction: PropTypes.shape({
    agentName: PropTypes.string,
    appeasements: PropTypes.array,
    contactChannel: PropTypes.string,
    contactReason: PropTypes.string,
    createdAt: PropTypes.string,
    disposition: PropTypes.string,
    incidentId: PropTypes.string,
    specialNote: PropTypes.string,
    switchToUser: PropTypes.bool,
  }),
  contactChannelIcon: PropTypes.object,
};

export default InteractionHistoryCard;
