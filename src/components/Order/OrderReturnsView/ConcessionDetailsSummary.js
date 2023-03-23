/* eslint-disable jsx-a11y/anchor-is-valid */
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { currencyFormatter, capitalize } from '@/utils/string';
import { Grid, Typography } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import useAthena from '@/hooks/useAthena';

const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: theme.utils.fromPx(18),
    lineHeight: theme.utils.fromPx(24),
    marginBottom: '0.75rem',
    color: '#031657',
    marginTop: '20px',
  },
  returnRow: {
    display: 'grid',
    gridTemplateColumns: '50% 50%',
    backgroundColor: '#FFFFFF',
    marginBottom: '2px',
  },
  backgroundColor: {
    backgroundColor: '#FFFFFF',
    marginBottom: '2px',
  },
  returnHeading: {
    padding: '16px 16px 8px 16px',
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: '16px',
    lineHeight: theme.utils.fromPx(24),
    color: '#031657',
  },
  concessionAmount: {
    padding: '16px 16px 8px 16px',
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: '12px',
    color: '#666666',
    lineHeight: theme.utils.fromPx(15),
  },
  returnValue: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontStyle: 'regular',
    fontSize: theme.utils.fromPx(14),
    lineHeight: theme.utils.fromPx(20),
    paddingLeft: theme.utils.fromPx(16),
    display: 'flex',
    flexDirection: 'column',
  },
  partNumber: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontStyle: 'regular',
    fontSize: theme.utils.fromPx(12),
    lineHeight: theme.utils.fromPx(15),
    paddingLeft: theme.utils.fromPx(16),
    paddingTop: theme.utils.fromPx(16),
    color: '#666666',
  },
  productName: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontStyle: 'regular',
    fontSize: theme.utils.fromPx(14),
    lineHeight: theme.utils.fromPx(22),
    paddingLeft: theme.utils.fromPx(16),
    paddingBottom: theme.utils.fromPx(16),
  },
  shipping: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontStyle: 'regular',
    display: 'flex',
    flexDirection: 'column',
    fontSize: theme.utils.fromPx(14),
    lineHeight: theme.utils.fromPx(22),
    paddingBottom: theme.utils.fromPx(16),
    marginLeft: theme.utils.fromPx(16),
  },

  concessionReason: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    color: '#4D4D4D',
    fontStyle: 'regular',
    fontSize: theme.utils.fromPx(14),
    lineHeight: theme.utils.fromPx(20),
    paddingLeft: theme.utils.fromPx(16),
    display: 'flex',
    flexDirection: 'column',
  },
  returnLabelValuePanel: {
    display: 'flex',
    flexDirection: 'column',
  },
  returnLabelShippingValuePanel: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: theme.utils.fromPx(16),
  },
  amountAlignment: {
    justifySelf: 'end',
    paddingRight: theme.utils.fromPx(16),
  },
  image: {
    width: '36px',
    height: '37.13px',
    marginTop: theme.utils.fromPx(16),
  },
  lineCredit: {
    float: 'right',
    marginRight: '6.5000rem',
    paddingTop: theme.utils.fromPx(16),
  },
  shippingIcon: {
    '& .MuiSvgIcon-root': {
      float: 'left',
      marginRight: '10px',
      width: '36px',
      height: '37px',
      marginLeft: theme.utils.fromPx(20),
    },
  },
}));
const ConcessionDetailsSummary = ({ returnData }) => {
  const classes = useStyles();
  const { getLang } = useAthena(); // athena config
  const rootTestId = `concession:${returnData?.type}:${returnData?.id}`;

  return (
    <div data-testid="concessionDetails">
      <div>
        <div className={classes.title}>{'Concession'}</div>
        <div className={classes.returnRow}>
          <div>
            <div data-testid={`${rootTestId}:title`} className={classes.returnHeading}>
              {getLang('returnConcessionReason', { fallback: 'Reason:' })}{' '}
              {capitalize(
                returnData?.items?.length > 0 ? returnData?.items[0]?.reason?.primary : null,
              )}
            </div>
            <div
              data-testid={`${rootTestId}:concessionReason`}
              className={classes.concessionReason}
            >
              {returnData?.items?.length > 0 ? returnData?.items[0]?.comment : ''}
            </div>
          </div>
          <div className={classes.amountAlignment}>
            <div
              data-testid={`${rootTestId}:concessionAmount`}
              className={classes.concessionAmount}
            >
              {' '}
              {getLang('returnConcessionAmount', { fallback: 'Concession Amount' })}
            </div>
            <div data-testid={`${rootTestId}:amount`} className={classes.returnValue}>
              {currencyFormatter(returnData?.totalCredit)}
            </div>
          </div>
        </div>
      </div>
      {returnData?.items?.length > 0 &&
        returnData?.items.map((item) => {
          return (
            <div key={item.id} data-testid="return:item:details">
              <div className={classes.backgroundColor}>
                <div className={classes.returnLabelValuePanel}>
                  <Grid container wrap="nowrap">
                    <Grid item>
                      <span
                        data-testid={`${rootTestId}:${item?.partNumber}:item`}
                        className={classes.partNumber}
                      >
                        <img
                          className={classes.image}
                          src={`//img.chewy.com/is/image/catalog/${item?.partNumber}_MAIN._SS50_.jpg`}
                          alt=""
                        />
                      </span>
                    </Grid>
                    <Grid item xs>
                      <div
                        data-testid={`${rootTestId}:${item?.partNumber}:item`}
                        className={classes.partNumber}
                      >
                        {getLang('returnConcessionItem', { fallback: 'ITEM #' })}
                        {item?.partNumber}
                      </div>
                      <div
                        data-testid={`${rootTestId}:${item?.productName}:item`}
                        className={classes.productName}
                      >
                        <Typography>{item?.productName}</Typography>
                      </div>
                    </Grid>
                    <Grid item xs>
                      <div
                        data-testid={`${rootTestId}:${item?.productName}:item`}
                        className={classes.lineCredit}
                      >
                        {currencyFormatter(item?.totalCredit)}
                      </div>
                    </Grid>
                  </Grid>
                </div>
              </div>
            </div>
          );
        })}
      {returnData?.items?.length > 0 &&
        returnData?.items.map((item) => {
          return item?.type === 'SHIPPING_CONCESSION' ? (
            <div key={item.id} data-testid="return:item:details">
              <div className={classes.backgroundColor}>
                <div className={classes.returnLabelShippingValuePanel}>
                  <Grid container wrap="nowrap">
                    <Grid item className={classes.shippingIcon}>
                      <LocalShippingIcon />
                    </Grid>
                    <Grid item xs>
                      <span
                        data-testid={`${rootTestId}:${item?.productName}:item`}
                        className={classes.shipping}
                      >
                        {getLang('returnConcessionShipping', { fallback: 'Shipping' })}
                      </span>
                    </Grid>
                    <Grid item xs>
                      <div
                        data-testid={`${rootTestId}:${item?.productName}:item`}
                        className={classes.lineCredit}
                      >
                        {currencyFormatter(item?.totalCredit)}
                      </div>
                    </Grid>
                  </Grid>
                </div>
              </div>
            </div>
          ) : null;
        })}
    </div>
  );
};

ConcessionDetailsSummary.propTypes = {
  returnData: PropTypes.object,
};

export default ConcessionDetailsSummary;
