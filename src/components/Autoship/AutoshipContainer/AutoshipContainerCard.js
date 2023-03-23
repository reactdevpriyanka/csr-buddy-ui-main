import PropTypes from 'prop-types';
import NextLink from 'next/link';
import { getMonthDateTimeTimezone } from '@/utils';
import { makeStyles } from '@material-ui/core/styles';
import { Card, Link } from '@material-ui/core';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SummaryPopperButton from '@/components/InteractionSummary/SummaryPopperButton';
import AutoshipOrderItems from '@components/Autoship/AutoshipContainer/AutoshipOrderItems';
import PopoverOrderItem from './PopoverOrderItem';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: '8px',
    paddingRight: '8px',
    fontSize: '12px',
  },
  chewyCard: {
    position: 'relative',
    marginBottom: '0.5rem',
    minHeight: '112px',
    padding: '16px',
  },
  heading: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  orderNum: {
    lineHeight: '28px',
    fontSize: '18px',
    fontWeight: 500,
    color: theme.palette.primary.main,
    letterSpacing: '0.25px',
    textDecoration: 'none',
    '&:hover': {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  },
  autoshipItems: {
    color: theme.palette.gray.light,
    fontWeight: 500,
    lineHeight: '18px',
    marginRight: '50px',
  },
}));

const AutoshipContainerCard = ({
  orderId,
  timePlaced,
  frequency,
  total,
  status,
  customerId,
  lineItems = [],
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Card className={classes.chewyCard}>
        <div className={classes.heading}>
          <div>
            <div>Placed on {getMonthDateTimeTimezone(timePlaced)}</div>
            <div>
              <NextLink href={`/customers/${customerId}/orders/${orderId}`}>
                <Link
                  className={classes.orderNum}
                  data-testid={`autoshipHistory:id:viewdetails:link:${orderId}`}
                >
                  {`Order #${orderId}`}
                </Link>
              </NextLink>
            </div>
          </div>
          <div>
            <SummaryPopperButton
              keys={orderId}
              tempDisabled={false}
              icon={<InfoOutlinedIcon />}
              classes={{ iconButton: classes.iconButtonSpacing }}
            >
              <PopoverOrderItem
                orderId={orderId}
                orderTotal={total}
                frequency={frequency}
                status={status}
              />
            </SummaryPopperButton>
          </div>
        </div>
        <div className={classes.autoshipItems}>
          <AutoshipOrderItems items={lineItems} />
        </div>
      </Card>
    </div>
  );
};

AutoshipContainerCard.propTypes = {
  orderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  timePlaced: PropTypes.string,
  frequency: PropTypes.string,
  total: PropTypes.string,
  status: PropTypes.string,
  customerId: PropTypes.string,
  lineItems: PropTypes.array,
};

export default AutoshipContainerCard;
