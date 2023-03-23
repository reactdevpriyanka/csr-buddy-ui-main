import PropTypes from 'prop-types';
import NextLink from 'next/link';
import { Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { getDayDateYearTimeTimezone } from '@/utils';
import { currencyFormatter } from '@/utils/string';
import { convertOrderStatus, getOrderStatusIndicator } from '@/constants/OrderStatus';
import Badge from '@/components/Badge/Badge';
import { useState } from 'react';
import EventHistoryDialog from '@/components/EventHistory/EventHistoryDialog';
import useAthena from '@/hooks/useAthena';
import useSanitizedRouter from '@/hooks/useSanitizedRouter';

const useStyles = makeStyles((theme) => ({
  root: {
    background: '#FFFFFF',
    display: 'grid',
    gridTemplateColumns: '50% 50%',
    padding: '15px',
    borderTopLeftRadius: theme.utils.fromPx(4),
    borderTopRightRadius: theme.utils.fromPx(4),
  },
  divColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  leftPanel: {
    display: 'grid',
    gridTemplateColumns: '240px 240px 240px auto',
  },
  rightPanel: {
    display: 'grid',
    gridTemplateColumns: '150px 100px 125px',
    justifyContent: 'right',
  },
  alignRight: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'right',
  },
  status: {
    width: '42px',
    height: '18px',
    background: '#FFC80C',
    borderRadius: '4px',
    textAlign: 'center',
    display: 'table-cell',
    wordWrap: 'break-word',
    verticalAlign: 'middle',

    fontFamily: 'Roboto, bold',
    fontWeight: '700',
    fontSize: '14px',
    lineHeight: '10px',
    color: '#121212',
  },
  orderNum: {
    lineHeight: '1.43rem',
    fontSize: '1rem',
    fontWeight: 500,
    color: theme.palette.primary.main,
    letterSpacing: theme.utils.fromPx(0.25),
    '& .MuiTypography-root': {
      textDecoration: 'none',
      color: theme.palette.primary.main,
    },
    textDecoration: 'none',
    '&:hover': {
      cursor: 'pointer',
      textDecoration: 'underline',
    },
  },
}));

const OrderDetailsViewSummary = ({
  orderNumber,
  packageCount,
  orderTotal = 0,
  totalItems = 0,
  timeUpdated,
  parentOrderId,
  status,
}) => {
  const classes = useStyles();

  const { getLang } = useAthena(); // athena config

  const { id: customerId } = useSanitizedRouter();

  const [eventHistoryDialogOpen, setEventHistoryDialogOpen] = useState(false);

  return (
    <div data-testid="orderDetailsViewSummaryContainer" className={classes.root}>
      <div className={classes.leftPanel}>
        <div>
          <div>{getLang('orderSummaryUpdated', { fallback: 'Updated' })}</div>
          <div>{getDayDateYearTimeTimezone(timeUpdated)}</div>
        </div>

        <div>
          <div>{getLang('orderSummaryASParent', { fallback: 'AS Parent' })}</div>
          <div>
            <NextLink href={`/customers/${customerId}/autoship?autoshipId=${parentOrderId}`}>
              <Link data-testid="autoshiporder:id:link" className={classes.orderNum}>
                {parentOrderId}
              </Link>
            </NextLink>
          </div>
        </div>
        <div>
          <div>{getLang('orderSummaryStatus', { fallback: 'Status' })}</div>
          <div>
            <Badge
              className={classes.status}
              title={getOrderStatusIndicator(status)}
              onBadgeClick={() => setEventHistoryDialogOpen(true)}
            />
          </div>
        </div>
      </div>
      <div className={classes.rightPanel}>
        <div>
          <div>{getLang('orderSummaryTotalPackages', { fallback: 'Total Packages' })}</div>
          <div>{packageCount}</div>
        </div>

        <div>
          <div>{getLang('orderSummaryTotalItems', { fallback: 'Total # Items' })}</div>
          <div>{totalItems}</div>
        </div>

        <div className={classes.alignRight}>
          <span>{getLang('orderSummaryOrderTotal', { fallback: 'Order Total' })}</span>
          <span>{currencyFormatter(orderTotal)}</span>
        </div>
      </div>
      {eventHistoryDialogOpen && (
        <EventHistoryDialog
          open={eventHistoryDialogOpen}
          onClose={() => setEventHistoryDialogOpen(false)}
          status={convertOrderStatus(status)}
          orderNumber={orderNumber}
          data-testid={`event-history-dialog:${orderNumber}`}
        />
      )}
    </div>
  );
};

OrderDetailsViewSummary.propTypes = {
  orderNumber: PropTypes.string.isRequired,
  status: PropTypes.string,
  timeUpdated: PropTypes.string,
  orderTotal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  totalItems: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  packageCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  parentOrderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default OrderDetailsViewSummary;
