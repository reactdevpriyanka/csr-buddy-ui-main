import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import cn from 'classnames';
import { useState } from 'react';
import useAthena from '@/hooks/useAthena';
import { AccordionDetails, AccordionSummary, Accordion } from './AccordionHelper';
import TrackerTitleBar from './TrackerTitleBar';

const useStyles = makeStyles((theme) => ({
  accordionComponent: {
    '& .MuiAccordion-root': {
      border: 'none',
      '& .Mui-disabled': {
        backgroundColor: 'unset',
        opacity: 'unset',
      },
    },
    '& .MuiAccordion-root.Mui-disabled': {
      backgroundColor: 'unset',

      '& .MuiAccordionSummary-expandIconWrapper': {
        color: '#cccccc',
      },
    },
    '& .MuiAccordionSummary-root': {
      paddingLeft: 0,
      paddingRight: 0,
      minHeight: theme.utils.fromPx(5),
      height: 'auto',
      marginTop: '0',
      marginBottom: theme.utils.fromPx(5),
      width: '100%',
      background: 'white',
    },
    '& .MuiAccordionDetails-root': {
      border: 'none',
      paddingTop: 0,
      paddingLeft: 0,
    },
    '& .MuiAccordionSummary-expandIconWrapper': {
      color: '#031657',
    },
    '& .MuiAccordionSummary-content': {
      marginLeft: 0,
      marginTop: theme.utils.fromPx(0),
    },
  },
  destinationEventAccordionComponent: {
    '& .MuiAccordionDetails-root': {
      paddingBottom: 0,
    },
  },
  promotionPanel: {
    backgroundColor: '#DDF0FF',
    display: 'grid',
    gridTemplateColumns: '40% 40% 20%',
    width: '100%',
    borderBottomColor: 'white',
    borderBottomStyle: 'solid',
    borderBottomWidth: '5px',
    paddingLeft: '10px',
    paddingTop: '5px',
    paddingBottom: '5px',
    paddingRight: '10px',
  },
  promotionLabel: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontStyle: 'regular',
    fontSize: theme.utils.fromPx(12),
    lineHeight: theme.utils.fromPx(16),
    color: '#666666',
  },
  promotionValue: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontStyle: 'regular',
    fontSize: theme.utils.fromPx(14),
    lineHeight: theme.utils.fromPx(21),
    color: '#121212',
  },
  promotionLabelValuePanel: {
    display: 'flex',
    flexDirection: 'column',
  },
  promotionValueColumn: {
    textAlign: 'end',
  },
  nameValue: {
    display: 'grid',
    gridTemplateColumns: '50% 50%',
    width: '100%',
    marginTop: theme.utils.fromPx(4),
  },
  displayName: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontStyle: 'medium',
    fontSize: theme.utils.fromPx(14),
    lineHeight: theme.utils.fromPx(18),
    color: '#666666',
  },
  displayValue: {
    textAlign: 'end',
    marginRight: theme.utils.fromPx(15),
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontStyle: 'bold',
    fontSize: theme.utils.fromPx(16),
    lineHeight: theme.utils.fromPx(19),
    color: '#333333',
  },
  adjustmentName: {
    color: '#031657',
  },
  contextMessage: {
    display: 'block',
    marginTop: '0',
  },
  internalMessage: {
    display: 'block',
    marginTop: '10px',
  },
  messageTitle: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: theme.utils.fromPx(14),
    lineHeight: theme.utils.fromPx(20),
    color: '#121212',
  },
  messageBody: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: theme.utils.fromPx(14),
    lineHeight: theme.utils.fromPx(20),
    color: '#121212',
  },
  contextMessageContainer: {
    paddingTop: theme.utils.fromPx(0),
  },
  destinationContextMessage: {
    marginTop: theme.utils.fromPx(0),
  },
}));

const ContextMessageDetails = ({
  expand = false,
  data = {},
  icon = null,
  title = '',
  subtitle = '',
  isFinalEvent = false,
  isDestinationEvent = false,
}) => {
  const classes = useStyles();
  const { getLang } = useAthena();
  const contextCustomerMessage = getLang('feature.explorer.contextCustomerMessage', {
    fallback: 'Customer Message:',
  });
  const contextCSRGuidance = getLang('feature.explorer.contextCSRGuidance', {
    fallback: 'CSR Guidance:',
  });

  const [panelExpanded, setPanelExpanded] = useState(expand);
  const handleChange = () => {
    setPanelExpanded(!panelExpanded);
  };

  return (
    <div
      className={cn(
        classes.accordionComponent,
        isDestinationEvent && classes.destinationEventAccordionComponent,
      )}
    >
      <Accordion
        data-testid="general:accordion"
        disableGutters
        disabled={false}
        expanded={panelExpanded}
        onChange={handleChange}
      >
        <AccordionSummary
          data-testid={`general:accordion:summary:${data.eventCode}${data.subEventCode}`}
          aria-controls="panel1d-content"
          id="panel1d-header"
        >
          <TrackerTitleBar
            title={title}
            subtitle={subtitle}
            isContextEvent={true}
            isFinalEvent={isFinalEvent}
            isDestinationEvent={isDestinationEvent}
          />
        </AccordionSummary>
        <AccordionDetails>
          <div
            className={isDestinationEvent ? classes.contextMessageContainer : ''}
            data-testid={`general:accordion:details:${data.eventCode}${data.subEventCode}`}
          >
            <div
              data-testid="general:accordion:details:contextMessage"
              className={cn(
                classes.contextMessage,
                isDestinationEvent && classes.destinationContextMessage,
              )}
            >
              <span
                data-testid="general:accordion:details:contextMessage:title"
                className={classes.messageTitle}
              >
                {`${contextCustomerMessage} `}
              </span>
              <span
                data-testid="general:accordion:details:contextMessage:body"
                className={classes.messageBody}
              >
                {data?.contextualMessage ? data?.contextualMessage?.message : `None`}
              </span>
            </div>
            <div
              data-testid="general:accordion:details:internalMessage"
              className={classes.internalMessage}
            >
              <span
                data-testid="general:accordion:details:internalMessage:title"
                className={classes.messageTitle}
              >
                {`${contextCSRGuidance} `}
              </span>
              <span
                data-testid="general:accordion:details:internalMessage:Body"
                className={classes.messageBody}
              >
                {data?.internalMessage?.message}
              </span>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

ContextMessageDetails.propTypes = {
  expand: PropTypes.bool,
  data: PropTypes.object,
  icon: PropTypes.element,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  isFinalEvent: PropTypes.bool,
  isDestinationEvent: PropTypes.bool,
};

export default ContextMessageDetails;
