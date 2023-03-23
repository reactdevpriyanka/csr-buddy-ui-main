import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@components/Button';
import FedExLogo from '@components/Icons/fedex-logo.svg';
import ChewyLogo from '@components/Icons/chewy-logo.svg';
import cn from 'classnames';
import ConditionalWrapper from '@/utils/conditionalWrapper';
import TooltipPrimary from '../TooltipPrimary';

const testingName = 'shipping-flow';
const Steps = {
  PENDING: { text: 'Pending', value: 0 },
  ORDER_PLACED: { text: 'Order Placed', value: 0 },
  PACKING_ITEMS: { text: 'Packing Items', value: 1 },
  IN_TRANSIT: { text: 'In Transit', value: 2 },
  OUT_FOR_DELIVERY: { text: 'Out for Delivery', value: 3 },
  DELIVERED: { text: 'Delivered', value: 4 },
  [undefined]: { text: 'Pending', value: 0 },
};

const Logos = {
  FDXHD: FedExLogo,
  CHEWY: ChewyLogo,
  [undefined]: 'div',
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  img: {
    ...theme.utils.nospace,
    ...theme.utils.figure,
    maxWidth: theme.utils.fromPx(60),
    marginBottom: theme.utils.fromPx(4),
    '& > img': {
      width: '100%',
      height: 'auto',
    },
  },
  header: {
    display: 'grid',
    gridTemplateColumns: `1fr`,
    gridTemplateRows: 'auto auto',
    gridRowGap: theme.utils.fromPx(20),
    background: '#F5F5F5',
    borderRadius: theme.utils.fromPx(4),
    padding: theme.utils.fromPx(16),
    margin: `${theme.utils.fromPx(24)} 0`,
  },
  isShipping: {
    gridTemplateColumns: `${theme.utils.fromPx(60)} 1fr`,
    gridColumnGap: theme.utils.fromPx(20),
  },
  address: {
    ...theme.fonts.h4,
    textAlign: 'right',
  },
  statusCode: {
    ...theme.fonts.textSmall,
    fontWeight: '500',
    color: theme.palette.green.medium,
    textTransform: 'uppercase',
  },
  statusText: {
    ...theme.fonts.textSmall,
    textAlign: 'right',
  },
  shippingDetails: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  lines: {
    background: '#f9f9f9',
    boxSizing: 'border-box',
    display: 'inline-grid',
    gridColumn: '1/3',
    gridTemplateColumns: `repeat(5, 1fr)`,
    gridColumnGap: theme.utils.fromPx(2),
    width: '100%',
  },
  line: {
    width: '100%',
    height: theme.utils.fromPx(4),
    borderRadius: theme.utils.fromPx(4),
  },
  actionButton: {
    gridColumn: '1/3',
  },
  complete: {
    background: theme.palette.green.medium,
  },
  noShip: {
    background: '#555555' /** @TODO : grayscale theme [100,200...] */,
  },
  notShipped: {
    color: '#555555' /** @TODO : grayscale theme [100,200...] */,
  },
  incomplete: {
    background: '#CCCCCC' /** @TODO : grayscale theme [100,200...] */,
  },
  delay: {
    background: theme.palette.yellow.amber,
  },
  delayed: {
    color: theme.palette.red.medium,
  },
  onTime: {
    color: theme.palette.green.medium,
  },
  disabledTrackingToolTip: {
    fontSize: theme.utils.fromPx(12),
    lineHeight: theme.utils.fromPx(16),
    maxWidth: theme.utils.fromPx(180),
  },
}));

const ShippingFlow = ({
  children,
  step,
  statusText,
  shipper,
  orderCanceled,
  header,
  onTrackPackage = () => null,
}) => {
  let stepValue = Steps[step].value || 0;
  let stepText = Steps[step].text;
  const classes = useStyles();
  const ShipperLogo = shipper && Logos[shipper] ? Logos[shipper] : Logos['CHEWY'];
  const labels = ['Order Placed', 'Packing Items', 'In-Transit', 'Out for Delivery', 'Delivered'];
  const statuses = { ON_TIME: 'ON TIME', DELAYED: 'DELAYED', NONE: '', UNKNOWN: '' };
  const steps = [];
  const isDelayed = statusText === 'DELAYED';
  const isShipping = step !== 'ORDER_PLACED' && step !== 'PACKING_ITEMS' && step !== 'PENDING';
  const statusSlot = isShipping ? statuses[statusText] : stepText;

  /** Determines color of step text */
  const getStepTextClass = () => {
    if (step === 'ORDER_PLACED' || step === 'PACKING_ITEMS' || step === 'PENDING') {
      return classes.notShipped;
    } else {
      return isDelayed ? classes.delayed : classes.onTime;
    }
  };
  /** Determines color of step bars (complete/incomplete) */
  const getStepBarClass = (complete) => {
    if (step === 'ORDER_PLACED' || step === 'PACKING_ITEMS') {
      return complete ? classes.noShip : classes.incomplete;
    }
    if (isDelayed) {
      return complete ? classes.delay : classes.incomplete;
    } else {
      return complete ? classes.complete : classes.incomplete;
    }
  };

  /** Build Step Progress Bars */
  for (let i = 1; i <= 5; i += 1) {
    const classNames = [classes.line];
    const label = labels[i - 1];
    const key = `line-${i}`;
    const complete = i - 1 <= stepValue;
    classNames.push(getStepBarClass(complete));
    if (isDelayed) {
      classNames.push('delayed');
    }
    steps.push(
      <div
        data-testid="shipping-flow-step"
        aria-label={label}
        aria-checked={complete}
        key={key}
        className={classNames.join(' ')}
      />,
    );
  }

  const tooltipWrapper = (children) => (
    <TooltipPrimary
      className={classes.disabledTrackingToolTip}
      title="Can't track package until order is in Shipping Status. Order is being packed"
    >
      {children}
    </TooltipPrimary>
  );

  return (
    <div className={classes.root} data-testid={`${testingName}`}>
      {header}
      {!orderCanceled && (
        <div className={cn(classes.header, isShipping && classes.isShipping)}>
          <div data-testid={`${testingName}-logo`}>
            <figure
              data-testid={isShipping ? `${testingName}-shipper-logo` : `${testingName}-chewy-logo`}
              className={classes.img}
            >
              {isShipping ? <ShipperLogo /> : <ChewyLogo />}
            </figure>
            <div
              className={[classes.statusCode, getStepTextClass()].join(' ')}
              data-testid={`${testingName}-status-code`}
            >
              {statusSlot}
            </div>
          </div>
          {isShipping && (
            <div className={classes.shippingDetails}>
              <div className={classes.address} data-testid={`${testingName}-address`}>
                {children}
              </div>
              <div className={classes.statusText} data-testid={`${testingName}-status`}>
                {stepText}
              </div>
            </div>
          )}
          <div className={classes.lines} data-testid={`${testingName}-indicator`}>
            {steps}
          </div>
          <ConditionalWrapper condition={!isShipping} wrapper={tooltipWrapper}>
            <div className={classes.actionButton}>
              <Button
                full
                solid
                data-testid={`${testingName}-track-package`}
                aria-disabled={!isShipping}
                disabled={!isShipping}
                onClick={onTrackPackage}
              >
                {'Track Package'}
              </Button>
            </div>
          </ConditionalWrapper>
        </div>
      )}
    </div>
  );
};

ShippingFlow.propTypes = {
  children: PropTypes.node,
  step: PropTypes.string.isRequired,
  shipper: PropTypes.string,
  statusText: PropTypes.string.isRequired,
  orderCanceled: PropTypes.bool,
  onTrackPackage: PropTypes.func,
  header: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

export default ShippingFlow;
