import useAthena from '@/hooks/useAthena';
import { makeStyles } from '@material-ui/core/styles';
import edd from './shapes/edd';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'grid',
    gridTemplateColumns: `50% 50%`,
    fontFamily: 'Roboto',
    fontStyle: 'normal',
  },
  header: {
    fontSize: theme.utils.fromPx(12),
    fontWeight: '400',
    color: '#767676',
    textAlign: 'left',
    paddingTop: theme.utils.fromPx(14),
    lineHeight: theme.utils.fromPx(16),
  },
  dow: {
    ...theme.fonts.body.heavy,
    fontSize: theme.utils.fromPx(14),
    fontWeight: '700',
    lineHeight: theme.utils.fromPx(20),
    color: '#121212',
    paddingRight: theme.utils.fromPx(6),
  },
  dom: {
    ...theme.fonts.body.heavy,
    fontSize: theme.utils.fromPx(40),
    fontWeight: '700',
    lineHeight: theme.utils.fromPx(36),
    color: '#121212',
  },
  year: {
    ...theme.fonts.body.normal,
    color: '#767676',
    lineHeight: theme.utils.fromPx(14),
    fontSize: theme.utils.fromPx(12),
    fontWeight: theme.utils.fromPx(400),
    paddingRight: theme.utils.fromPx(6),
  },
  block: {
    display: 'block',
  },
  info: {
    textAlign: 'right',
  },
  style: {
    display: 'flex',
    textAlign: 'right',
    justifyContent: 'end',
    paddingTop: theme.utils.fromPx(30),
  },
  package: {
    fontSize: theme.utils.fromPx(16),
    fontWeight: '700',
    lineHeight: theme.utils.fromPx(22),
  },
}));

const NewTrackerStatus = ({
  isDelivered = false,
  dayOfWeek = 'Unknown',
  dayOfMonth = '',
  month = '',
  year = '',
  ordinal = '',
  total = '',
}) => {
  const classes = useStyles();
  const { getLang } = useAthena();
  const title = isDelivered
    ? getLang('deliveredOnCTMText', { fallback: 'Delivered on:' })
    : getLang('estimatedDeliveryCTMText', { fallback: 'Estimated Delivery:' });

  return (
    <div className={classes.root}>
      <div className={classes.package} data-testid="tracker-edd-package">
        {`Package ${ordinal} of ${total}`}
        <div className={classes.header} data-testid={`tracker-edd-package:${title}`}>
          {title}
        </div>
      </div>
      {dayOfWeek && dayOfMonth && month && year ? (
        <div className={classes.style}>
          <div>
            <div className={classes.dow} data-testid={`tracker-edd-week:${dayOfWeek}:${month}`}>
              {dayOfWeek}, {month}
            </div>
            <div className={classes.year} data-testid={`tracker-edd-week:${year}`}>
              {year}
            </div>
          </div>
          <div className={classes.dom} data-testid={`tracker-edd-week:${dayOfMonth}`}>
            {dayOfMonth}
          </div>
        </div>
      ) : (
        <span className={classes.block}>Unknown</span>
      )}
    </div>
  );
};

NewTrackerStatus.propTypes = edd;

export default NewTrackerStatus;
