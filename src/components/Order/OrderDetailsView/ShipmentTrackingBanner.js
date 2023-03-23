import PropTypes from 'prop-types';
import cn from 'classnames';
import { Paper, Typography } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';
import useAthena from '@/hooks/useAthena';
import useContextualMessaging from '@/hooks/useContextualMessaging';
import trackingEventShape from '@/components/ShipmentTracker/shapes/trackingEvent';
import Link from '@mui/material/Link';

const useStyles = makeStyles((theme) => ({
  flex: {
    display: 'flex',
  },
  banner: {
    height: '40px',
    justifyContent: 'space-between',
    padding: '10px 16px',
  },
  icon: {
    fontSize: '20px !important',
    paddingTop: '2px',
  },
  message: {
    fontSize: '18px',
    fontWeight: 400,
    lineHeight: '21px',
    marginLeft: '8px',
    paddingLeft: '5px',
  },
}));

export default function ShipmentTrackingBanner({ trackingEvent, onTrackPackage }) {
  const { getLang } = useAthena();

  const { alertFontColor, alertBackgroundColor, AlertIcon, title } = useContextualMessaging(
    trackingEvent,
  );

  const classes = useStyles({ alertFontColor, alertBackgroundColor });

  if (!trackingEvent?.internalMessage?.message) return null;

  return (
    <Paper
      className={cn(classes.flex, classes.banner)}
      data-testid="shipment-tracking-banner"
      elevation={0}
      square
      sx={{
        color: alertFontColor,
        backgroundColor: alertBackgroundColor,
      }}
    >
      <div className={classes.flex}>
        <AlertIcon className={classes.icon} />
        <Typography className={classes.message}>{title}</Typography>
      </div>
      <Link
        sx={{
          display: 'flex',
          transition: 'all 0.2s',
          textTransform: 'none',
          alignItems: 'center',
          fontSize: '14px',
          fontWeight: 500,
          lineHeight: '16px',
          border: 'none',
          textDecoration: 'underline',
          color: alertFontColor,
          cursor: 'pointer',
        }}
        onClick={onTrackPackage}
      >
        {getLang('trackPackageLabel', { fallback: 'Track Package' })}
      </Link>
    </Paper>
  );
}

ShipmentTrackingBanner.propTypes = {
  trackingEvent: PropTypes.shape(trackingEventShape),
  onTrackPackage: PropTypes.func.isRequired,
};
