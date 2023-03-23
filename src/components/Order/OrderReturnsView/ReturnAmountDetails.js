/* eslint-disable jsx-a11y/anchor-is-valid */
import useAthena from '@/hooks/useAthena';
import { makeStyles } from '@material-ui/core/styles';
import { Box } from '@mui/material';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { useMemo } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    justifySelf: 'end',
  },
  label: {
    display: 'inline-block',
    color: '#666666',
  },
  hr: {
    flexGrow: '0',
    border: '1px solid #CCCCCC',
    width: '16rem',
    marginLeft: theme.spacing(0),
  },
  box: {
    display: 'flex',
    height: theme.utils.fromPx(94),
    maxWidth: theme.utils.fromPx(293.67),
    backgroundColor: '#F5F5F5',
  },
  returnAmountContent: {
    paddingLeft: theme.utils.fromPx(16),
    paddingRight: theme.utils.fromPx(16),
    paddingTop: theme.utils.fromPx(16),
    paddingBottom: theme.utils.fromPx(16),
  },
  detail: {
    marginTop: theme.spacing(0),
    paddingRight: theme.spacing(2),
    marginBottom: theme.spacing(0),
  },
  value: {
    display: 'inline-flex',
    height: theme.utils.fromPx(20),
    color: '#333333',
    fontWeight: '700',
    float: 'right',
  },
  valueExpected: {
    display: 'inline-flex',
    height: theme.utils.fromPx(20),
    color: '#333333',
    fontWeight: '700',
    float: 'right',
    justifySelf: 'end',
  },
}));

const ReturnAmountDetails = ({ returnData }) => {
  const classes = useStyles();
  const { getLang } = useAthena(); // athena config
  const expectedTotal = useMemo(() => {
    return returnData?.payments?.reduce(
      (total, payment) => Number.parseFloat(payment?.amount ?? 0) + total,
      0,
    );
  }, [returnData]);

  const creditedTotal = useMemo(() => {
    return returnData?.payments?.reduce(
      (total, payment) => Number.parseFloat(payment?.amount ?? 0) + total,
      0,
    );
  }, [returnData]);

  return (
    <div data-testid="returnAmountContainer" className={classes.root}>
      <Box className={classes.box}>
        <div className={classes.returnAmountContent}>
          <div className={cn(classes.detail)}>
            <span className={cn(classes.label)} data-testid="payment-balance-label">
              {getLang('returnConcessionExpected', { fallback: 'Expected' })}
            </span>
            <span className={cn(classes.valueExpected)} data-testid="payment-balance-value">
              {returnData?.payments?.length > 0 && <span>${expectedTotal}</span>}
            </span>
          </div>
          <hr className={classes.hr} />
          <div className={cn(classes.detail)}>
            <span className={cn(classes.label)} data-testid="payment-credited-label">
              {getLang('returnConcessionCredited', { fallback: 'Credited' })}
            </span>
            <span className={cn(classes.valueExpected)} data-testid="payment-credited-value">
              {returnData?.payments?.length > 0 && <span>${creditedTotal}</span>}
            </span>
          </div>
        </div>
      </Box>
    </div>
  );
};

ReturnAmountDetails.propTypes = {
  returnData: PropTypes.object.isRequired,
};

export default ReturnAmountDetails;
