import { useContext, useState, useMemo } from 'react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HistoryIcon from '@material-ui/icons/History';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import classnames from 'classnames';
import SummaryPopperButton from '@components/InteractionSummary/SummaryPopperButton';
import PopoverComment from '@components/InteractionSummary/SummaryPopperButton/PopoverComment';
import PopoverReport from '@components/InteractionSummary/SummaryPopperButton/PopoverReport';
import { isValid } from 'date-fns';
import { getDayDateTimeTimezone } from '@/utils';
import useInteractionSummary from '@/hooks/useInteractionSummary';
import useFeature from '@/features/useFeature';
import InteractionSummaryData from '@components/InteractionSummary/InteractionSummaryData';
import useAthena from '@/hooks/useAthena';
import { Card as ChewyCard } from '../Card';
import ModalContext, { MODAL } from '../ModalContext';

import { getContactChannelIcon, useShippingAppeasements } from './utils';

const useStyles = makeStyles((theme) => ({
  rootContainer: {
    display: 'flex',
    borderRadius: '4px',
  },
  chewyCard: {
    marginTop: `${theme.utils.fromPx(22)}`,
    position: 'relative',
    border: '2px solid #1C49C2',
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: '#DDF0FF80',
      boxShadow: '0px 0px 4px 2px rgb(28, 73, 194, 0.6)',
    },
  },
  chewyCardIsFocused: {
    backgroundColor: theme.palette.primary.white,
  },
  interactionTypeLeft: {
    alignSelf: 'center',
    marginBottom: 'auto',
  },
  incidentSubjectMiddle: {
    flexGrow: 1,
    marginLeft: '0.5rem',
  },
  incidentNumber: {
    display: 'inline-flex',
    fontSize: theme.fonts.size.sm,
    fontWeight: '500',
  },
  contactReason: {
    lineHeight: '1.35rem',
    fontWeight: '400',
    letterSpacing: '0.25px',
    marginTop: '10px',
    marginBottom: '6px',
  },
  subtitle: {
    color: theme.palette.gray.light,
  },
  incidentRightColumn: {
    minWidth: 'fit-content',
    display: 'flex',
    alignItems: 'flex-start',
  },
  interactionIcon: {
    color: '#031657',
    backgroundColor: '#DBEBF9',
    height: '36px',
    width: '36px',
  },
  focusedInteractionIcon: {
    color: theme.palette.white,
    backgroundColor: '#1C49C2',
    height: '36px',
    width: '36px',
    transition: 'all 0.2s',
    '&:hover': {
      color: theme.palette.white,
      backgroundColor: '#1C49C2',
    },
  },
  incidentDate: {
    color: theme.palette.gray[400],
    marginBottom: theme.spacing(0.25),
  },
  agentContact: {
    color: theme.palette.gray.dark,
    fontWeight: 400,
    marginLeft: '0.25rem',
  },
  chip: {
    color: '#1C49C2', //"Chewy / Brand"
    backgroundColor: theme.palette.gray[100],
    height: '24px',
  },
  chipMargin: {
    marginRight: theme.spacing(0.5),
  },
  buttonContainer: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    right: 0,
  },
  iconButtonSpacing: {
    marginRight: theme.spacing(0.5),
  },
  iconButtonLast: {
    marginRight: theme.spacing(1),
  },
  tooltipPopper: {
    backgroundColor: theme.palette.primary.main,
  },
  actionContainer: {
    marginBottom: '8px',
    '&:last-child': {
      marginBottom: '0px',
    },
  },
  historyIconButton: {
    color: theme.palette.white,
    backgroundColor: theme.palette.primary.main,
    padding: '4px',
    border: `4px solid ${theme.palette.primary.main}`,
    transition: 'all 0.2s',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  disabledHistoryButton: {
    border: `4px solid transparent !important`,
  },
  itemAction: {
    color: '#666666',
    fontSize: '14px',
    fontWeight: 700,
    lineHeight: '18px',
  },
  itemActionDescription: {
    color: '#666666',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '18px',
    wordBreak: 'break-word',
  },
  unorderedList: {
    paddingLeft: '24px',
    listStyleType: 'disc',
    '& li::marker': {
      fontSize: '75%',
    },
  },
  messageIconContainer: {
    textAlign: 'end',
    marginRight: 8,
  },
  messageIcon: {
    color: '#031657',
    '& svg': {
      fontSize: 13,
      marginTop: 3,
    },
  },
  actionsRightGrid: {
    paddingLeft: theme.utils.fromPx(16),
  },
  extraTopPadding: {
    marginTop: theme.utils.fromPx(16),
  },
  hideElement: {
    display: 'none',
  },
}));

const FEATURE_FLAGS = {
  INTERACTION_HISTORY: 'feature.interaction.summary.history.card',
};

const InteractionSummary = () => {
  const classes = useStyles();
  const [isFocused, setIsFocused] = useState(false);
  const { setModal, modal } = useContext(ModalContext);
  const interactionHistoryFeatureFlag = !useFeature(FEATURE_FLAGS.INTERACTION_HISTORY);
  const isInteractionHistoryShown = modal === MODAL.INTERACTIONHISTORYCONTAINER;
  const { data: lastInteraction } = useInteractionSummary();
  let appeasements = useShippingAppeasements(lastInteraction?.appeasements || []);

  const { getKeys } = useAthena();
  const agentInteractionTypes = new Set(getKeys('feature.explorer.agentInteractionTypes'));

  const {
    incidentId: incidentNumber,
    contactReason,
    contactChannel,
    createdAt: incidentDate,
    agentName: agentContact,
    disposition,
    specialNote,
    switchToUser,
  } = lastInteraction || {};

  const handleClickOpenInteractionHistory = () => {
    setModal(!isInteractionHistoryShown ? MODAL.INTERACTIONHISTORYCONTAINER : null);
  };

  const orderIds = useMemo(() => {
    return appeasements
      ?.filter((appeasement) => !agentInteractionTypes.has(appeasement?.type))
      ?.filter((appeasement) => appeasement?.appeasementId)
      ?.map((a) => a.appeasementId)
      ?.filter((value, index, self) => self.indexOf(value) === index);
  }, [appeasements]);

  if (!lastInteraction) return null;

  return (
    <ChewyCard
      onMouseOver={() => setIsFocused(true)}
      onFocus={() => setIsFocused(true)}
      onMouseOut={() => setIsFocused(false)}
      onBlur={() => setIsFocused(false)}
      className={classnames(classes.chewyCard, { [classes.chewyCardIsFocused]: true })}
    >
      <div className={classnames(classes.rootContainer)}>
        <div className={classes.interactionTypeLeft}>
          <IconButton
            disableRipple
            aria-label="close"
            className={classnames(
              classes.iconButton,
              isFocused ? classes.focusedInteractionIcon : classes.interactionIcon,
              {
                iconButtonIsFocused: isFocused,
              },
            )}
          >
            {getContactChannelIcon(contactChannel)}
          </IconButton>
        </div>
        <div className={classes.incidentSubjectMiddle}>
          {isValid(new Date(incidentDate)) && (
            <div className={classes.incidentNumber}>
              Last Customer Contact on {getDayDateTimeTimezone(incidentDate)} |
              <div className={classes.agentContact}> {agentContact}</div>
            </div>
          )}
          <InteractionSummaryData
            id={incidentNumber}
            contactReason={contactReason}
            appeasements={appeasements}
            agentInteractionTypes={agentInteractionTypes}
            switchToUser={switchToUser}
          />
        </div>
        <div className={classes.incidentRightColumn}>
          <SummaryPopperButton
            icon={<ContentPasteIcon />}
            classes={{ iconButton: classes.iconButtonSpacing }}
            keys="comment"
          >
            <PopoverComment
              specialNote={specialNote}
              disposition={disposition}
              incidentNumber={incidentNumber}
              initialContactReason={contactReason}
              appeasements={appeasements}
              orderIds={orderIds}
            />
          </SummaryPopperButton>
          <SummaryPopperButton
            tempDisabled={false}
            icon={<InfoOutlinedIcon />}
            classes={{ iconButton: classes.iconButtonSpacing }}
            keys="report"
          >
            <PopoverReport appeasements={appeasements} />
          </SummaryPopperButton>
          <IconButton
            className={classnames(
              interactionHistoryFeatureFlag ? classes.disabledHistoryButton : null,
              classes.historyIconButton,
            )}
            data-testid="interaction-history-icon"
            variant="outlined"
            disabled={interactionHistoryFeatureFlag}
            onClick={handleClickOpenInteractionHistory}
          >
            <HistoryIcon />
          </IconButton>
        </div>
      </div>
    </ChewyCard>
  );
};

InteractionSummary.propTypes = {};

/*
interactionType : string, // leftmost icon selection - call/chat/etc
incidentNumber: string,
incidentDate: ISODateString,
agentContact: string,
contactReason: string, //"Damaged shipment" in example
subtitle: string //product description in example
fixActions: arrayOf(string) //refunded/replacement sent from example
disposition: string,
specialNote: string,
issueType: //"Damaged Item in Shipment" within popover on page 8 of pdf
totalRefund: number,
concessionAmount: number,
refundAmount: number,
refundMethodText: string //9013 in example
refundMethodType: string //Mastercard in example
 */

export default InteractionSummary;
