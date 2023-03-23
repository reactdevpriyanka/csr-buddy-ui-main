import { makeStyles } from '@material-ui/core/styles';
import cn from 'classnames';
import { currencyFormatter } from '@/utils/string';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';
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
    gridTemplateColumns: '60% 10% 10% 10% auto',
    backgroundColor: '#EEEEEE',
    marginTop: '16px',
  },
  returnPanel: {
    display: 'grid',
    gridTemplateColumns: '60% 10% 10% 10% auto',
    backgroundColor: '#FFFFFF',
  },
  returnHeading: {
    padding: '16px 24px 8px 16px',
    color: '#000000',
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: '12px',
    lineHeight: theme.utils.fromPx(16),
  },
  returnStatusHeading: {
    color: '#000000',
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: '12px',
    lineHeight: theme.utils.fromPx(16),
    justifySelf: 'end',
    paddingTop: theme.utils.fromPx(16),
    paddingRight: theme.utils.fromPx(16),
  },
  returnStatusLabelValuePanel: {
    display: 'flex',
    flexDirection: 'column',
    justifySelf: 'end',
    paddingRight: theme.utils.fromPx(16),
  },
  returnValue: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: theme.utils.fromPx(14),
    lineHeight: theme.utils.fromPx(21),
    paddingLeft: theme.utils.fromPx(16),
    paddingTop: theme.utils.fromPx(16),
    color: '#666666',
  },
  returnReasonValue: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    display: 'list-item',
    fontSize: theme.utils.fromPx(14),
    lineHeight: theme.utils.fromPx(20),
    color: '#666666',
    marginLeft: theme.utils.fromPx(30),
  },
  boldReturnItemText: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: theme.utils.fromPx(14),
    lineHeight: theme.utils.fromPx(20),
    color: '#666666',
  },
  returnLabelValuePanel: {
    display: 'flex',
    flexDirection: 'column',
  },
  image: {
    width: '36px',
    height: '37.13px',
    marginTop: theme.utils.fromPx(16),
    marginLeft: theme.utils.fromPx(16),
  },
}));
const ReturnDetailsItems = ({ returnData }) => {
  const classes = useStyles();
  const { getLang } = useAthena(); // athena config
  const isRefund = returnData.type === 'REFUND';

  return (
    <div data-testid="returnDetailsItems">
      <div>
        <div className={classes.title}>{getLang('returnItems', { fallback: 'Items' })}</div>
        <div className={classes.returnRow}>
          <div className={classes.returnHeading}>
            {getLang('returnDescriptionReason', { fallback: 'Description & Reason' })}
          </div>
          <div className={classes.returnHeading}>
            {getLang('returnItemQty', { fallback: 'Qty' })}
          </div>
          <div className={classes.returnHeading}>
            {getLang('returnItemSendback', { fallback: 'Send back' })}
          </div>
          {isRefund && (
            <div className={classes.returnHeading}>
              {getLang('returnShelterDonation', { fallback: 'Shelter Donation' })}
            </div>
          )}
          <div className={classes.returnStatusHeading}>
            {getLang('returnItemCredit', { fallback: 'Credit' })}
          </div>
        </div>
      </div>
      {returnData?.items?.length > 0 &&
        returnData.items.map((item) => {
          return (
            <div key={item.lineItemId} data-testid="return:items:details">
              <div className={classes.returnPanel}>
                <div className={classes.returnLabelValuePanel}>
                  <Grid container wrap="nowrap">
                    <Grid item>
                      <span
                        data-testid={`${item.lineItemId}:${item?.partNumber}:item`}
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
                        data-testid={`${item.lineItemId}:${item?.productName}:item`}
                        className={classes.returnValue}
                      >
                        Item #{item?.partNumber} {item?.productName}
                        <span className={classes.returnReasonValue}>
                          <span
                            data-testid={`${item.lineItemId}:reason:label`}
                            className={classes.boldReturnItemText}
                          >
                            {`Reason:  `}
                          </span>
                          {item?.reason?.primary}
                          {item?.comment && item?.comment !== 'null' && ` - "${item?.comment}"`}
                        </span>
                      </div>
                    </Grid>
                  </Grid>
                </div>
                <div className={classes.returnLabelValuePanel}>
                  <span className={classes.returnValue}>{item?.quantity}</span>
                </div>
                <div className={cn(classes.returnLabelValuePanel)}>
                  <span className={classes.returnValue}>
                    {item?.sendBack === true ? 'YES' : 'NO'}
                  </span>
                </div>
                {isRefund && (
                  <div className={cn(classes.returnLabelValuePanel)}>
                    <span className={classes.returnValue}>{item?.shelterDonationReason}</span>
                  </div>
                )}
                <div className={cn(classes.returnStatusLabelValuePanel)}>
                  <span
                    className={classes.returnValue}
                    data-testid={`returnItem:${item.lineItemId}:totalCredit`}
                  >
                    {currencyFormatter(item?.totalCredit > 0 ? item?.totalCredit : '0.00')}
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

ReturnDetailsItems.propTypes = {
  returnData: PropTypes.object,
};

export default ReturnDetailsItems;
