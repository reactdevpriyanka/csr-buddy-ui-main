import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Card, CardContent, Box, Link } from '@mui/material';
import { useState } from 'react';
import { getDayDateYearTimeTimezone } from '@utils/dates';
import TooltipPrimary from '@components/TooltipPrimary';
import useAgentAlert from '@/hooks/useAgentAlert';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import useAthena from '@/hooks/useAthena';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
  },
  contentTitle: {
    fontSize: '12px',
    lineHeight: '16px',
    position: 'static',
  },
  content: {
    fontSize: theme.utils.fromPx(12),
    lineHeight: '21px',
    position: 'static',
  },
  readContent: {
    fontSize: '12px',
    position: 'static',
    textAlign: 'end',
    fontFamily: 'Roboto',
    fontWeight: '500',
    paddingRight: theme.utils.fromPx(12),
    paddingBottom: theme.utils.fromPx(8),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
  },
  markAsReadContent: {
    position: 'absolute',
    right: '0px',
    margin: '5px 0px 0px 0px !important',
    fontSize: '12px',
    fontWeight: 700,
    fontFamily: 'Work Sans',
    letterSpacing: '-0.03em',
    color: `${theme.palette.primary.alternate} !important`,
    cursor: 'pointer',
  },
  readIcon: {
    marginRight: theme.utils.fromPx(4),
  },
}));

const MarkAsRead = ({ alertData, onMarkAsRead }) => {
  const classes = useStyles();
  const { createAgentAlert } = useAgentAlert();
  const { getLang } = useAthena();
  const [newMarkAsReadAlert, setMarkAsReadAlert] = useState(
    alertData.details.acknowledged === 'true',
  );
  const AGENT_NAME_CHARACTER_LIMIT = 14;
  const handleMarkAsRead = () => {
    // updating acknowledged: 'true' via api
    setMarkAsReadAlert(true);
    createAgentAlert({
      data: {
        id: alertData.id,
        recordTimestamp: alertData.recordTimestamp,
        createdDate: alertData.createdDate,
        customerId: alertData.customerId,
        type: 'NEXT_AGENT_NOTE',
        details: {
          agentName: alertData.details.agentName,
          interactionId: alertData.details.interactionId,
          agentId: alertData.details.agentId, //added agent ID
          issueType: alertData.details.issueType,
          nextAgentNote: alertData.details.nextAgentNote,
          acknowledged: 'true',
        },
      },
    }).then(() => {
      onMarkAsRead();
    });
  };

  return newMarkAsReadAlert === false ? (
    <div className={classes.root}>
      <Card
        elevation={0}
        key={alertData.id}
        sx={{
          variant: 'outlined',
          borderRadius: '4px',
          border: '2px solid #1C49C2',
          background: '#DBEBF9',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            overflow: 'hidden',
            flexDirection: 'column',
            padding: '1px',
          }}
        >
          <CardContent>
            <Typography
              data-testid="agent-alert:date"
              component="div"
              className={classes.contentTitle}
            >
              <b>{getDayDateYearTimeTimezone(alertData.createdDate)}</b> |{' '}
              {String(alertData.details.agentName).length <= AGENT_NAME_CHARACTER_LIMIT ? (
                `${alertData.details.agentName || (!alertData.details.agentName && '')}`
              ) : (
                <TooltipPrimary
                  title={alertData.details.agentName}
                  aria-label="add"
                  placement="top"
                  arrow
                >
                  <span>{alertData.details.agentName.slice(0, AGENT_NAME_CHARACTER_LIMIT)}...</span>
                </TooltipPrimary>
              )}
            </Typography>
            <Typography
              className={classes.content}
              style={{ wordWrap: 'break-word' }}
              component="div"
              data-testid="agent-alert:note"
            >
              {alertData.details.nextAgentNote}
            </Typography>
          </CardContent>
        </Box>
      </Card>
      <Link
        className={classes.markAsReadContent}
        data-testid={`mark-as-read-${alertData.id}`}
        onClick={handleMarkAsRead}
        underline="hover"
      >
        {getLang('agentMarkAsReadText', { fallback: 'Mark as read' })}
      </Link>
    </div>
  ) : (
    <Card
      key={alertData.id}
      sx={{
        variant: 'filled',
        borderRadius: '4px',
        background: '#F5F5F5',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          overflow: 'hidden',
          flexDirection: 'column',
          padding: '1px',
        }}
      >
        <CardContent>
          <Typography
            data-testid="agent-alert:date"
            component="div"
            className={classes.contentTitle}
          >
            <b>{getDayDateYearTimeTimezone(alertData.createdDate)}</b> |{' '}
            {String(alertData.details.agentName).length <= AGENT_NAME_CHARACTER_LIMIT ? (
              `${alertData.details.agentName || (!alertData.details.agentName && '')}`
            ) : (
              <TooltipPrimary
                title={alertData.details.agentName}
                aria-label="add"
                placement="top"
                arrow
              >
                <span>{alertData.details.agentName.slice(0, AGENT_NAME_CHARACTER_LIMIT)}...</span>
              </TooltipPrimary>
            )}
          </Typography>
          <Typography
            className={classes.content}
            style={{ wordWrap: 'break-word' }}
            component="div"
            data-testid="agent-alert:note"
          >
            {alertData.details.nextAgentNote}
          </Typography>
        </CardContent>
      </Box>
      <Typography data-testid={`read-${alertData.id}`} className={classes.readContent}>
        <CheckCircleOutlineOutlinedIcon
          sx={{ height: '14px', width: '14px' }}
          className={classes.readIcon}
        />{' '}
        <span>{getLang('agentReadText', { fallback: 'Read' })}</span>
      </Typography>
    </Card>
  );
};

MarkAsRead.propTypes = {
  alertData: PropTypes.object,
  onMarkAsRead: PropTypes.func,
};

export default MarkAsRead;
