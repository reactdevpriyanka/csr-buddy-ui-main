import PropTypes from 'prop-types';
import { Alert, Grow, Typography } from '@mui/material';
import { snakeCaseToTitleCase } from '@/utils/string';
import useContextualMessaging from '@/hooks/useContextualMessaging';

const ContextualMessageAlert = ({ trackingEvent }) => {
  const { alertBackgroundColor, alertFontColor, AlertIcon, title } = useContextualMessaging(
    trackingEvent,
  );

  if (!trackingEvent?.internalMessage?.message) return null;

  return (
    <Grow in={true} timeout={550}>
      <Alert
        severity="warning"
        data-testid="contextual-message:alert"
        icon={<AlertIcon />}
        sx={{
          color: alertFontColor,
          backgroundColor: alertBackgroundColor,
          marginBottom: '0.75rem',
          '& .MuiAlert-icon': {
            color: alertFontColor,
            marginTop: '0.25rem',
          },
        }}
      >
        <Typography color="black" sx={{ fontSize: '1.125rem', color: alertFontColor }}>
          {snakeCaseToTitleCase(title)}
        </Typography>
        <div>
          <span>
            <b>Customer Message: </b>
          </span>
          <span data-testid="contextual-message:customer-message">
            {trackingEvent?.contextualMessage?.message ?? 'None'}
          </span>
        </div>
        <div>
          <span>
            <b>CSR Guidance: </b>
          </span>
          <span data-testid="contextual-message:internal-message">
            {trackingEvent.internalMessage.message ?? 'None'}
          </span>
        </div>
      </Alert>
    </Grow>
  );
};

ContextualMessageAlert.propTypes = {
  trackingEvent: PropTypes.object.isRequired,
};

export default ContextualMessageAlert;
