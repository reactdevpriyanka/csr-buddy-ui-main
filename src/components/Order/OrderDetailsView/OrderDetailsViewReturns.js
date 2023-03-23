import PropTypes from 'prop-types';
import cn from 'classnames';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import TooltipPrimary from '@/components/TooltipPrimary';
import { getDayDateTimeTimezone } from '@/utils';
import Link from 'next/link';
import { currencyFormatter, snakeCaseToTitleCase } from '@/utils/string';
import { useRouter } from 'next/router';
import useAthena from '@/hooks/useAthena';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '25px',

    '& ul': {
      listStyle: 'disc',
    },
  },
  status: {
    width: '42px',
    height: '18px',
    background: '#FFC80C',
    borderRadius: '4px',
    textAlign: 'center',
    padding: '0px 16px',

    fontFamily: 'Roboto, bold',
    fontWeight: '700',
    fontSize: '14px',
    lineHeight: '18px',
    color: '#121212',

    whiteSpace: 'nowrap',
  },
  statusPanel: {
    textAlign: 'right',
  },
  mainPanel: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '3px',
  },
  headerPanel: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: '4px',
    marginTop: '25px',
    padding: '15px',
    display: 'grid',
    gridTemplateColumns: '50% 50%',
    height: '60px',
  },
  headerRightPanel: {
    display: 'grid',
    gridTemplateColumns: '230px 100px 100px 130px',
    justifyContent: 'right',
    height: '60px',
  },
  bodyPanel: {
    width: '100%',
    height: 'fit-content',
    backgroundColor: '#FFFFFF',
    borderRadius: '4px',
    padding: '15px',
  },
  rowPanel: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: '5px',
  },
  columnPanel: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '10px',
  },
  columnPanelRight: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: '10px',
    justifySelf: 'right',
  },
  headerColumnPanel: {
    display: 'flex',
    flexDirection: 'column',
    height: '60px',
  },
  returnItemPanel: {
    display: 'grid',
    gridTemplateColumns: '70% 30%',
    // gridColumnGap: '30px',
  },
  leftReturnItemPanel: {
    display: 'flex',
    flexDirection: 'column',
  },
  rightReturnItemPanel: {
    display: 'grid',
    gridTemplateColumns: '120px 120px 120px',
    justifyContent: 'right',
  },
  title: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontStyle: 'bold',
    fontSize: '20px',
    lineHeight: '25px',
    color: '#031657',
  },
  returnTitle: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: '16px',
    lineHeight: '20px',
    color: '#031657',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  label: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: '12px',
    lineHeight: '15px',
    color: '#666666',
  },
  headerText: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '21px',
    color: '#000000',
  },
  text: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '18px',
    color: '#121212',
  },
  returnDescriptionPanel: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  returnReasonPanel: {},
  returnItemText: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: '14px',
    lineHeight: '21px',
    color: '#666666',
    cursor: 'pointer',
  },
  withUnderline: {
    '&:focus, &:hover': {
      textDecoration: 'underline',
    },
  },
  boldReturnItemText: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: '14px',
    lineHeight: '21px',
    color: '#666666',
  },
  descriptionUl: {
    paddingLeft: '15px',
  },
  noReturnRow: {
    height: '70px !important',
    marginTop: '15px',
    backgroundColor: '#FFFFFF',
  },
  noReturnHeading: {
    marginLeft: theme.utils.fromPx(24),
    color: '#121212',
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: theme.utils.fromPx(22),
    fontSize: theme.utils.fromPx(16),
    paddingTop: theme.utils.fromPx(24),
  },
}));

const OrderDetailsViewReturns = ({ returns = [], itemMap = {} }) => {
  const classes = useStyles();
  const router = useRouter();
  const { id: customerId, orderId } = router.query;
  const { getLang } = useAthena(); // athena config

  return (
    <div data-testid="orderDetailsViewReturnsContainer" className={classes.root}>
      <span className={classes.title}>Returns</span>
      {returns?.map((curReturn) => {
        const timeUpdated = curReturn.timeUpdated;
        const timeCreated = curReturn.timeCreated;
        const state = curReturn.state;

        const isReplacement = curReturn.type === 'REPLACEMENT';
        const isRefund = curReturn.type === 'REFUND';
        const isConcession = !['REPLACEMENT', 'REFUND'].includes(curReturn.type);
        const rootTestId = `return:${curReturn.type}:${curReturn.id}`;

        return (
          <div key={rootTestId} data-testid={rootTestId} className={classes.mainPanel}>
            <div className={classes.headerPanel}>
              <div className={classes.headerColumnPanel}>
                <Link
                  href={`/customers/${customerId}/orders/${orderId}/order-returns-details/${curReturn.id}`}
                >
                  <span data-testid={`${rootTestId}:title`} className={classes.returnTitle}>
                    {`${_.capitalize(curReturn.type)}(${curReturn.id})`}
                  </span>
                </Link>
                <div className={classes.rowPanel}>
                  <span data-testid={`${rootTestId}:timecreated:label`} className={classes.label}>
                    {getLang('orderReturnCreated', { fallback: 'Created:' })}{' '}
                  </span>
                  <span data-testid={`${rootTestId}:timecreated`} className={classes.text}>
                    {getDayDateTimeTimezone(timeCreated)}
                  </span>
                </div>
              </div>

              <div className={classes.headerRightPanel}>
                <div className={classes.columnPanel}>
                  <span data-testid={`${rootTestId}:timeupdated:label`} className={classes.label}>
                    {getLang('orderReturnUpdated', { fallback: 'Updated' })}
                  </span>
                  <span data-testid={`${rootTestId}:timeupdated`} className={classes.text}>
                    {getDayDateTimeTimezone(timeUpdated)}
                  </span>
                </div>

                {isConcession ? (
                  // eslint-disable-next-line react/self-closing-comp
                  <div className={classes.columnPanel}></div>
                ) : (
                  <div className={classes.columnPanel}>
                    <span data-testid={`${rootTestId}:numofitems:label`} className={classes.label}>
                      {getLang('orderReturnItems', { fallback: '# of items' })}
                    </span>
                    <span data-testid={`${rootTestId}:numofitems`} className={classes.text}>
                      {curReturn.items.length}
                    </span>
                  </div>
                )}

                <div className={classes.columnPanel}>
                  {!isReplacement && (
                    <span data-testid={`${rootTestId}:totalcredit:label`} className={classes.label}>
                      {getLang('orderReturnCredit', { fallback: 'Credit' })}
                    </span>
                  )}
                  {!isReplacement && (
                    <span data-testid={`${rootTestId}:totalcredit`} className={classes.text}>
                      {currencyFormatter(curReturn.totalCredit)}
                    </span>
                  )}
                </div>

                <div className={classes.statusPanel}>
                  <span data-testid={`${rootTestId}:status`} className={classes.status}>
                    {snakeCaseToTitleCase(state)}
                  </span>
                </div>
              </div>
            </div>
            <div className={classes.bodyPanel}>
              {curReturn?.items?.map((item) => {
                const lineItem = itemMap[item.lineItemId];

                const rootReturnItemTestId = `${rootTestId}:item:${item.lineItemId}`;

                return (
                  <div
                    key={rootReturnItemTestId}
                    data-testid={`${rootReturnItemTestId}:returnItemPanel`}
                    className={classes.returnItemPanel}
                  >
                    <div className={classes.leftReturnItemPanel}>
                      {!isConcession && (
                        <div
                          data-testid={`${rootReturnItemTestId}:returnDescriptionPanel`}
                          className={classes.returnDescriptionPanel}
                        >
                          <ul className={classes.descriptionUl}>
                            <li>
                              <TooltipPrimary
                                className={classes.toolTip}
                                title={lineItem?.product?.name}
                              >
                                <span
                                  data-testid={`${rootReturnItemTestId}:productname`}
                                  className={cn(classes.returnItemText, classes.withUnderline)}
                                >
                                  Item #{lineItem?.product?.partNumber} {lineItem?.product?.name}
                                </span>
                              </TooltipPrimary>
                            </li>
                          </ul>
                        </div>
                      )}

                      <div className={classes.returnReasonPanel}>
                        <ul>
                          <li>
                            <span
                              data-testid={`${rootReturnItemTestId}:reason:label`}
                              className={classes.boldReturnItemText}
                            >
                              {getLang('orderReturnReason', { fallback: 'Reason:  ' })}
                            </span>
                            <span
                              data-testid={`${rootReturnItemTestId}:reason`}
                              className={classes.returnItemText}
                            >
                              {item?.reason?.primary}
                              {item?.comment && item?.comment !== 'null' && ` - "${item?.comment}"`}
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {!isConcession && (
                      <div
                        data-testid={`${rootReturnItemTestId}:rightReturnItemPanel`}
                        className={classes.rightReturnItemPanel}
                      >
                        <div className={classes.columnPanelRight}>
                          <span
                            data-testid={`${rootReturnItemTestId}:qty:label`}
                            className={classes.label}
                          >
                            {getLang('orderReturnQty', { fallback: 'Qty' })}
                          </span>
                          <span
                            data-testid={`${rootReturnItemTestId}:qty`}
                            className={classes.text}
                          >
                            {item?.quantity}
                          </span>
                        </div>

                        <div className={classes.columnPanelRight}>
                          <span
                            data-testid={`${rootReturnItemTestId}:sendback:label`}
                            className={classes.label}
                          >
                            {getLang('orderReturnSendBack', { fallback: 'Send Back' })}
                          </span>
                          <span
                            data-testid={`${rootReturnItemTestId}:sendback`}
                            className={classes.text}
                          >
                            {item?.sendBack ? 'Y' : 'N'}
                          </span>
                        </div>

                        {isRefund && (
                          <div className={classes.columnPanelRight}>
                            <span
                              data-testid={`${rootReturnItemTestId}:shelterdonation:label`}
                              className={classes.label}
                            >{`Shelter Donation`}</span>
                            <span
                              data-testid={`${rootReturnItemTestId}:shelterdonation`}
                              className={classes.text}
                            >
                              {item?.shelterDonation ? 'Y' : 'N'}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      {returns.length === 0 && (
        <div className={classes.noReturnRow}>
          <div className={classes.noReturnHeading}>
            {getLang('orderReturnNoReturns', { fallback: 'No Returns' })}
          </div>
        </div>
      )}
    </div>
  );
};

OrderDetailsViewReturns.propTypes = {
  returns: PropTypes.arrayOf(PropTypes.object),
  itemMap: PropTypes.object,
};

export default OrderDetailsViewReturns;
