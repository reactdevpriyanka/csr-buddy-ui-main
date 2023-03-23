import { makeStyles } from '@material-ui/core/styles';
import { getDayDateYearTimeTimezone } from '@/utils';
import cn from 'classnames';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { getOrderStatusIndicator } from '@/constants/OrderStatus';
import useAthena from '@/hooks/useAthena';

const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: theme.utils.fromPx(18),
    lineHeight: theme.utils.fromPx(24),
    marginBottom: '0.75rem',
    color: theme.palette.blue.dark,
    marginTop: theme.utils.fromPx(20),
  },
  replacementRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr auto',
    backgroundColor: '#EEEEEE',
    height: '50px !important',
    marginTop: '15px',
  },
  replacementPanel: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr auto',
    backgroundColor: '#FFFFFF',
  },
  replacementHeading: {
    marginTop: theme.utils.fromPx(16),
    marginLeft: theme.utils.fromPx(16),
    color: '#000000',
    fontFamily: 'Roboto',
    fontWeight: '700',
    lineHeight: theme.utils.fromPx(16),
    fontSize: theme.utils.fromPx(12),
  },
  replacementSatusHeading: {
    marginTop: '15px',
    color: '#000000',
    fontFamily: 'Roboto',
    fontWeight: '700',
    lineHeight: theme.utils.fromPx(16),
    fontSize: theme.utils.fromPx(12),
    marginLeft: theme.utils.fromPx(16),
    marginRight: theme.utils.fromPx(16),
  },
  replacementUpdatedDateHeading: {
    marginTop: theme.utils.fromPx(16),
    marginLeft: theme.utils.fromPx(16),
    color: '#000000',
    fontFamily: 'Roboto',
    fontWeight: '700',
    lineHeight: theme.utils.fromPx(16),
    fontSize: theme.utils.fromPx(12),
    paddingRight: theme.utils.fromPx(16),
  },
  replacementValue: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontStyle: 'normal',
    fontSize: theme.utils.fromPx(14),
    lineHeight: theme.utils.fromPx(20),
    paddingLeft: theme.utils.fromPx(16),
    paddingTop: theme.utils.fromPx(16),
    alignSelf: 'end',
    paddingRight: theme.utils.fromPx(16),
  },
  replacementLabelValuePanel: {
    display: 'flex',
  },
  replacementOrderStatus: {
    display: 'flex',
    justifyContent: 'end',
  },
}));
const ReplacementOrderDetails = ({ returnData }) => {
  const classes = useStyles();
  const router = useRouter();
  const { getLang } = useAthena(); // athena config
  const { id: customerId } = router.query;
  /* eslint-disable jsx-a11y/anchor-is-valid */
  return (
    <div data-testid="replacementOrders">
      <div>
        <div className={classes.title}>
          {getLang('returnReplacementOrder', { fallback: 'Replacement Order' })}
        </div>
        <div className={classes.replacementRow}>
          <div className={classes.replacementHeading}>
            {getLang('returnCreditOrder', { fallback: 'Order #' })}
          </div>
          <div className={classes.replacementHeading}>
            {getLang('returnConcessionCreated', { fallback: 'Created' })}
          </div>
          <div className={classes.replacementUpdatedDateHeading}>
            {getLang('returnCreditLastUpdated', { fallback: 'Last Updated' })}
          </div>
          <div className={classes.replacementSatusHeading}>
            <div className={classes.replacementOrderStatus}>
              {getLang('returnConcessionStatus', { fallback: 'Status' })}
            </div>
          </div>
        </div>
      </div>
      {returnData?.replacementOrders?.length > 0 &&
        returnData?.replacementOrders.map((replacementOrder) => {
          const rootTestId = `return:${replacementOrder?.orderId}`;
          return (
            <div key={rootTestId} data-testid="replacement:order:details">
              <div className={classes.replacementPanel}>
                <div className={classes.replacementLabelValuePanel}>
                  <Link href={`/customers/${customerId}/orders/${replacementOrder?.orderId}`}>
                    <a
                      className={classes.btnViewDetails}
                      data-testid={`order:return:${replacementOrder?.orderId}:link`}
                    >
                      <span
                        data-testid={`order:return:${replacementOrder?.orderId}:link:text`}
                        className={classes.replacementValue}
                      >
                        {replacementOrder?.orderId}
                      </span>
                    </a>
                  </Link>
                </div>
                <div className={classes.replacementLabelValuePanel}>
                  <span className={classes.replacementValue}>
                    {getDayDateYearTimeTimezone(replacementOrder?.timeCreated)}
                  </span>
                </div>
                <div className={cn(classes.replacementLabelValuePanel)}>
                  <span className={classes.replacementValue}>
                    {getDayDateYearTimeTimezone(replacementOrder?.timeUpdated)}
                  </span>
                </div>
                <div
                  className={cn(classes.replacementLabelValuePanel, classes.replacementOrderStatus)}
                >
                  <span className={classes.replacementValue}>
                    {replacementOrder?.status && (
                      <Box
                        sx={{
                          display: 'flex',
                          backgroundColor: '#FFC80C',
                          justifyContent: 'center',
                          flexDirection: 'column',
                          height: '18px',
                          textAlign: 'center',
                          fontWeight: '700',
                          fontSize: '14px',
                          lineHeight: '18px',
                          borderRadius: '4px',
                          fontFamily: 'Roboto',
                          padding: '0.5rem 1rem',
                        }}
                      >
                        {getOrderStatusIndicator(replacementOrder.status)}
                      </Box>
                    )}
                  </span>
                </div>
                <br />
              </div>
            </div>
          );
        })}
    </div>
  );
};

ReplacementOrderDetails.propTypes = {
  returnData: PropTypes.object,
};

export default ReplacementOrderDetails;
