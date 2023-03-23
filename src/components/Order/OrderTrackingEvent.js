import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import useAthena from '@/hooks/useAthena';
import QuestionMarkIcon from '@icons/question-mark.svg';
import TooltipPrimary from '../TooltipPrimary';

const useStyles = makeStyles((theme) => ({
  shipmentSubHeader: {
    ...theme.utils.nospace,
    color: theme.palette.gray.light,
    ...theme.fonts.h4,
  },
  edd: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '700',
    fontSize: '14px',
    lineHeight: '20px',
    color: '#121212',
  },
  pendingSection: {
    alignItems: 'center',
    display: 'flex',
  },
  questionMarkIcon: {
    display: 'inline-block',
    marginLeft: theme.utils.fromPx(4),
    fill: '#000000',
  },
  style: {
    display: 'flex',
    textAlign: 'right',
  },
  dow: {
    fontSize: theme.utils.fromPx(14),
    color: '#121212',
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: '20px',
  },
  dom: {
    ...theme.fonts.body.heavy,
    fontSize: theme.utils.fromPx(40),
    lineHeight: theme.utils.fromPx(36),
    color: '#121212',
    paddingLeft: theme.utils.fromPx(5),
  },
  year: {
    color: '#767676',
    fontSize: theme.utils.fromPx(12),
    fontWeight: theme.utils.fromPx(400),
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    lineHeight: '16px',
  },
}));

const OrderTrackingEvent = ({ status, total, edd }) => {
  const classes = useStyles();
  const { getLang } = useAthena();

  return (
    status !== 'CANCELED' &&
    (total > 0 ? (
      edd && edd.dayOfWeek && edd.dayOfMonth && edd.month && edd.year ? (
        <div className={classes.style}>
          <div>
            <div className={classes.dow}>
              {edd?.dayOfWeek}, {edd?.month}
            </div>
            <div className={classes.year}>{edd?.year}</div>
          </div>
          <div className={classes.dom}>{edd?.dayOfMonth}</div>
        </div>
      ) : (
        <TooltipPrimary
          arrow
          title={getLang('pendingShipmentText', {
            fallback:
              'Estimated delivery date will be provided when the item ships. Most orders arrive within 1-3 days. Pharmacy orders ship in 3-5 days after approval. Fresh/frozen and dropship orders can take longer, and delivery times vary.',
          })}
          placement="bottom"
          className={classes.tooltip}
        >
          <div className={classes.pendingSection}>
            <span data-testid="order:tracking-pending" className={classes.edd}>
              {getLang('pendingLabel', { fallback: 'Pending' })}
            </span>
            <QuestionMarkIcon className={classes.questionMarkIcon} />
          </div>
        </TooltipPrimary>
      )
    ) : (
      <TooltipPrimary
        arrow
        title={getLang('pendingShipmentText', {
          fallback:
            'Estimated delivery date will be provided when the item ships. Most orders arrive within 1-3 days. Pharmacy orders ship in 3-5 days after approval. Fresh/frozen and dropship orders can take longer, and delivery times vary.',
        })}
        placement="bottom"
        className={classes.tooltip}
      >
        <div className={classes.pendingSection}>
          <span data-testid="order:tracking-pending" className={classes.edd}>
            {getLang('pendingLabel', { fallback: 'Pending' })}
          </span>
          <QuestionMarkIcon className={classes.questionMarkIcon} />
        </div>
      </TooltipPrimary>
    ))
  );
};

OrderTrackingEvent.propTypes = {
  status: PropTypes.string,
  total: PropTypes.number,
  edd: PropTypes.object,
};

export default OrderTrackingEvent;
