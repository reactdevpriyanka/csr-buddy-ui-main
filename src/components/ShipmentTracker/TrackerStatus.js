import cn from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import FedExLogo from '@icons/fedex-logo.svg';
import edd from './shapes/edd';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'grid',
    gridTemplateAreas: `
      "header header"
      "info shipper"
    `,
    gridTemplateColumns: `auto ${theme.utils.fromPx(63)}`,
  },
  block: {
    display: 'block',
  },
  header: {
    gridArea: 'header',
  },
  info: {
    gridArea: 'info',
  },
  shipper: {
    gridArea: 'shipper',
    display: 'inline-grid',
    alignContent: 'end',
  },
  figure: {
    ...theme.utils.nospace,
    display: 'inline-block',
    width: '100%',
    height: 'auto',
    '& > svg': {
      display: 'inline-block',
      width: '100%',
      height: 'auto',
    },
  },
  dow: {
    ...theme.fonts.body.heavy,
    color: theme.palette.gray.light,
    fontSize: theme.utils.fromPx(11),
    lineHeight: theme.utils.fromPx(13),
    textTransform: 'uppercase',
  },
  dom: {
    ...theme.fonts.body.heavy,
    fontSize: theme.utils.fromPx(38),
    lineHeight: theme.utils.fromPx(45),
    color: '#121212',
  },
  month: {
    ...theme.fonts.body.normal,
    color: theme.palette.gray['medium-light'],
    textTransform: 'uppercase',
  },
}));

const TrackerStatus = ({
  isDelivered = false,
  dayOfWeek = 'Unknown',
  dayOfMonth = '',
  fedExLink = '',
  month = '',
}) => {
  const classes = useStyles();

  const title = isDelivered ? 'Delivered On' : 'Expected Delivery';

  return (
    <div className={classes.root}>
      <strong className={classes.header}>{title}</strong>
      <div className={classes.info}>
        {dayOfWeek && dayOfMonth && month ? (
          <>
            <span className={cn([classes.dow, classes.block])}>{dayOfWeek}</span>
            <span className={cn([classes.dom, classes.block])}>{dayOfMonth}</span>
            <span className={cn([classes.month, classes.block])}>{month}</span>
          </>
        ) : (
          <span className={classes.block}>Unknown</span>
        )}
      </div>
      {fedExLink && (
        <div className={classes.shipper}>
          <a href={fedExLink} className={classes.figure} target="_blank" rel="noreferrer">
            <FedExLogo />
          </a>
        </div>
      )}
    </div>
  );
};

TrackerStatus.propTypes = edd;

export default TrackerStatus;
