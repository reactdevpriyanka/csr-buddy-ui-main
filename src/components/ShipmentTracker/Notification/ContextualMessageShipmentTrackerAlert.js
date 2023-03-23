import PropTypes from 'prop-types';
import { Alert, Grow, Typography } from '@mui/material';
import { snakeCaseToTitleCase } from '@/utils/string';
import useContextualMessaging from '@/hooks/useContextualMessaging';
import trackingEventShape from '../shapes/trackingEvent';

const ContextualMessageShipmentTrackerAlert = ({ trackingEvent }) => {
  const { alertFontColor, alertBackgroundColor, AlertIcon, title } = useContextualMessaging(
    trackingEvent,
  );

  if (!trackingEvent?.internalMessage?.message) return null;

  return (
    <Grow in={true} timeout={550}>
      <Alert
        severity="warning"
        data-testid="contextual-message-shipping-tracker:alert"
        icon={
          <div>
            <AlertIcon />
          </div>
        }
        sx={{
          color: alertFontColor,
          backgroundColor: alertBackgroundColor,
          marginBottom: '0.75rem',
          '& .MuiAlert-icon': {
            color: alertFontColor,
            marginTop: '0',
            paddingBottom: '0',
          },
          '& .MuiAlert-message': {
            alignSelf: 'center',
          },
        }}
      >
        <Typography
          color="black"
          sx={{ fontSize: '1rem', lineHeight: '1.1875rem', color: alertFontColor }}
        >
          {snakeCaseToTitleCase(title)}
        </Typography>
      </Alert>
    </Grow>
  );
};

ContextualMessageShipmentTrackerAlert.propTypes = {
  trackingEvent: PropTypes.shape(trackingEventShape).isRequired,
};

export default ContextualMessageShipmentTrackerAlert;
