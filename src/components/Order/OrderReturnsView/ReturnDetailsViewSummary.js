/* eslint-disable jsx-a11y/anchor-is-valid */
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@mui/material';
import { capitalize } from '@/utils/string';
import { useRouter } from 'next/router';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { getDayDateYearTimeTimezone } from '@/utils';
import cn from 'classnames';
import useAthena from '@/hooks/useAthena';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.utils.fromPx(2),
    backgroundColor: '#FFFFFF',
  },
  leftPanel: {
    display: 'grid',
    gridTemplateColumns: '35% 25% 20% auto',
    padding: theme.utils.fromPx(16),
  },
  divColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  divColumnStatus: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'end',
  },
  color: {
    color: '#666666',
    marginRight: theme.utils.fromPx(55),
  },
  btnViewDetails: {
    color: '#1C49C2',
  },
  links: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '18px',
    color: '#1C49C2',
    textTransform: 'none',
    cursor: 'pointer',
    marginTop: '15px',
    '&:focus, &:hover': {
      textDecoration: 'underline',
    },
  },
}));

const ReturnDetailsViewSummary = ({ returnData }) => {
  const classes = useStyles();
  const router = useRouter();
  const { id: customerId } = router.query;
  const { getLang } = useAthena(); // athena config

  return (
    <div data-testid="returnDetailsViewSummaryContainer" className={classes.root}>
      <div className={classes.leftPanel}>
        <div className={classes.divColumn}>
          <span className={classes.color}>
            {getLang('returnCreditOrder', { fallback: 'Order #' })}
          </span>
          <Link
            href={`/customers/${customerId}/orders/${returnData?.orderId}`}
            className={cn(classes.links, classes.btnViewDetails)}
          >
            <span
              className={classes.links}
              data-testid={`order:return:${returnData?.orderId}:link:text`}
            >
              {returnData?.orderId}
            </span>
          </Link>
        </div>
        <div className={classes.divColumn}>
          <span className={classes.color}>
            {getLang('orderReturnUpdated', { fallback: 'Updated' })}
          </span>
          <span>{getDayDateYearTimeTimezone(returnData?.timeUpdated)}</span>
        </div>

        <div className={classes.divColumn}>
          <span className={classes.color}>
            {getLang('returnTotalItems', { fallback: 'total # items' })}
          </span>
          <span>{returnData?.items?.length}</span>
        </div>
        <div className={classes.divColumnStatus}>
          <span className={classes.color}>
            {getLang('returnConcessionStatus', { fallback: 'Status' })}
          </span>
          <span>
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
                fontFamily: 'Roboto',
                borderRadius: '4px',
                padding: '0.5rem 1rem',
              }}
            >
              {capitalize(returnData?.state)}
            </Box>
          </span>
        </div>
      </div>
    </div>
  );
};

ReturnDetailsViewSummary.propTypes = {
  returnData: PropTypes.object,
};

export default ReturnDetailsViewSummary;
