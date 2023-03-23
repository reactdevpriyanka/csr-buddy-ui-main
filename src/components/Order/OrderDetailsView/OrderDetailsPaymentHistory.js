import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { currencyFormatter, capitalize } from '@/utils/string';
import { useState } from 'react';
import cn from 'classnames';
import { getDayDateTimeTimezone } from '@/utils';

import {
  AccordionDetails,
  AccordionSummary,
  Accordion,
} from '@/components/Autoship/AutoshipViewDetailsDialog/AutoshipViewDetailsDialogHelper';
import useAthena from '@/hooks/useAthena';

const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: 'Roboto',
    fontWeight: '600',
    fontSize: '1rem',
    marginBottom: '1.75rem',
    color: theme.palette.blue.dark,
  },
  paymentRow: {
    display: 'grid',
    gridTemplateColumns: '45% 25% 15% 15%',
    backgroundColor: '#F5F5F5',
    height: '50px !important',
    marginTop: '15px',
    maxWidth: '1090px',
    columnGap: theme.utils.fromPx(20),
  },
  paymentHeading: {
    marginTop: '15px',
    marginLeft: '15px',
    color: '#000000',
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: '16px',
  },
  accordionComponent: {
    '& .MuiAccordion-root': {
      border: 'none',
    },
    '& .MuiAccordionSummary-expandIconWrapper': {
      marginTop: '16px',
      marginRight: theme.utils.fromPx(4),
    },
    '& .MuiAccordionSummary-root': {
      display: 'flex',
      border: '1px solid #999999',
      maxWidth: '1090px',
    },
    '& .MuiAccordionDetails-root': {
      paddingTop: '4px',
      paddingLeft: '4px',
      paddingBottom: '8px',
      maxWidth: '1090px',
    },
    '& .MuiAccordion-region': {
      backgroundColor: '#F5F5F5',
      maxWidth: '1090px',
    },
    '& .MuiAccordionSummary-content': {
      justifyContent: 'space-between',
      marginRight: theme.utils.fromPx(16),
      ' & .one': {
        flex: '2 1 0',
      },

      '& .two': {
        flex: '1 1 0',
      },

      '& .three': {
        flex: '1 1 0',
      },
    },
  },
  paymentPanel: {
    backgroundColor: '#F5F5F5',
    display: 'grid',
    gridTemplateColumns: '30% 20% 20% 15% auto',
    maxWidth: '1090px',
    columnGap: '10px',
  },
  transactionPanel: {
    backgroundColor: '#F5F5F5',
    display: 'grid',
    gridTemplateColumns: '22% 20% 18% 14% 14% 12%',
    maxWidth: '1090px',
  },
  paymentLabel: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontStyle: 'regular',
    fontSize: theme.utils.fromPx(12),
    lineHeight: theme.utils.fromPx(15),
    color: '#666666',
    marginLeft: theme.utils.fromPx(16),
  },
  paymentListLabel: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontStyle: 'regular',
    display: 'list-item',
    fontSize: theme.utils.fromPx(12),
    lineHeight: theme.utils.fromPx(15),
    color: '#666666',
    marginLeft: theme.utils.fromPx(16),
  },
  transactionLabel: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontStyle: 'regular',
    fontSize: theme.utils.fromPx(12),
    lineHeight: theme.utils.fromPx(16),
    color: '#666666',
    marginTop: theme.utils.fromPx(5),
    marginLeft: theme.utils.fromPx(16),
  },
  paymentValue: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontStyle: 'regular',
    fontSize: theme.utils.fromPx(14),
    lineHeight: theme.utils.fromPx(18),
    color: '#121212',
    paddingLeft: theme.utils.fromPx(16),
    paddingTop: theme.utils.fromPx(16),
  },
  paymentLabelValuePanel: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#F5F5F5',
    marginLeft: theme.utils.fromPx(16),
  },
}));

const OrderDetailsPaymentHistory = ({
  paymentDetail,
  disableAdjustments = false,
  expand = false,
}) => {
  const classes = useStyles();

  const { getLang } = useAthena(); // athena config

  const [panelExpanded, setPanelExpanded] = useState(expand);
  const handleChange = (panel) => (event, newExpanded) => {
    setPanelExpanded(!panelExpanded);
  };

  return (
    <div data-testid="orderDetailsPaymentHistory">
      <span className={classes.title}>
        {getLang('paymentHistory', { fallback: 'Payment History' })}
      </span>
      <div className={classes.paymentRow}>
        <div className={classes.paymentHeading}>
          {getLang('paymentHistory', { fallback: 'Payment History' })}
        </div>
        <div className={classes.paymentHeading}>
          {getLang('orderCredited', { fallback: 'Created' })}
        </div>
        <div className={classes.paymentHeading}>
          {getLang('orderExpires', { fallback: 'Expires' })}
        </div>
        <div className={classes.paymentHeading}>
          {getLang('orderStatus', { fallback: 'Status' })}
        </div>
      </div>
      {paymentDetail?.payments.length > 0 &&
        paymentDetail?.payments?.map((payment) => {
          return (
            <Accordion
              data-testid="order:payment:history:accordion"
              disableGutters
              disabled={disableAdjustments}
              expanded={panelExpanded}
              onChange={handleChange()}
              className={classes.accordionComponent}
              key={payment?.id}
            >
              <AccordionSummary
                data-testid="order:payment:history:accordion:summary"
                aria-controls="panel1d-content"
                id="panel1d-header"
              >
                <div className={classes.one}>{payment?.paymentId}</div>
                <div className={classes.two}>{getDayDateTimeTimezone(payment?.timeCreated)}</div>
                <div className={classes.two}>{getDayDateTimeTimezone(payment?.timeExpired)}</div>
                <div className={classes.three}>{capitalize(payment?.paymentStatus)}</div>
              </AccordionSummary>
              <AccordionDetails>
                <div data-testid="order:payment:history:accordion:details">
                  <div key={payment?.id} className={classes.paymentPanel}>
                    <div className={classes.paymentLabelValuePanel}>
                      <span className={classes.paymentLabel}>
                        {getLang('orderAvsResponse', { fallback: 'AVS Response' })}
                      </span>
                      <span className={classes.paymentValue}>{payment?.avsCode}</span>
                    </div>
                    <div className={classes.paymentLabelValuePanel}>
                      <span className={classes.paymentLabel}>
                        {getLang('orderRequested', { fallback: 'Requested' })}
                      </span>
                      <span className={classes.paymentValue}>
                        {currencyFormatter(payment?.paymentAmount?.requested)}
                      </span>
                    </div>
                    <div className={cn(classes.paymentLabelValuePanel)}>
                      <span className={classes.paymentLabel}>
                        {getLang('orderApproved', { fallback: 'Approved' })}
                      </span>
                      <span className={classes.paymentValue}>
                        {currencyFormatter(payment?.paymentAmount?.approved)}
                      </span>
                    </div>
                    <div className={cn(classes.paymentLabelValuePanel)}>
                      <span className={classes.paymentLabel}>
                        {getLang('orderDeposited', { fallback: 'Deposited' })}
                      </span>
                      <span className={classes.paymentValue}>
                        {currencyFormatter(payment?.paymentAmount?.deposited)}
                      </span>
                    </div>
                    <div className={cn(classes.paymentLabelValuePanel)}>
                      <span className={classes.paymentLabel}>
                        {getLang('orderCredited', { fallback: 'Credited' })}
                      </span>
                      <span className={classes.paymentValue}>
                        {currencyFormatter(payment?.paymentAmount?.credited)}
                      </span>
                    </div>
                    <br />
                  </div>
                  {payment?.transactions.length > 0 &&
                    payment?.transactions?.map((transaction) => (
                      <AccordionDetails key={transaction.id}>
                        <span className={classes.transactionLabel}>
                          {getLang('orderTransactions', { fallback: 'Transactions' })}
                        </span>
                        <div data-testid="order:payment:transaction:history:accordion:details">
                          <div className={classes.transactionPanel}>
                            <div className={classes.paymentLabelValuePanel}>
                              <span className={classes.paymentListLabel}>
                                {getLang('orderTransactionsID', { fallback: 'Trasaction ID' })}
                              </span>
                              <span className={classes.paymentValue}>{transaction?.id}</span>
                            </div>
                            <div className={classes.paymentLabelValuePanel}>
                              <span className={classes.paymentLabel}>
                                {getLang('orderDateCreated', { fallback: 'Date Created' })}
                              </span>
                              <span className={classes.paymentValue}>
                                {getDayDateTimeTimezone(transaction?.timeCreated)}
                              </span>
                            </div>
                            <div className={cn(classes.paymentLabelValuePanel)}>
                              <span className={classes.paymentLabel}>
                                {getLang('orderType', { fallback: 'Type' })}
                              </span>
                              <span className={classes.paymentValue}>{transaction?.status}</span>
                            </div>
                            <div className={cn(classes.paymentLabelValuePanel)}>
                              <span className={classes.paymentLabel}>
                                {getLang('orderResponse', { fallback: 'Response' })}
                              </span>
                              <span className={classes.paymentValue}>
                                {transaction?.responseStatus} {' - '} {transaction?.responseMessage}
                              </span>
                            </div>
                            <div className={cn(classes.paymentLabelValuePanel)}>
                              <span className={classes.paymentLabel}>
                                {getLang('orderAmount', { fallback: 'Amount' })}
                              </span>
                              <span className={classes.paymentValue}>
                                {currencyFormatter(transaction?.amount)}
                              </span>
                            </div>
                            <div className={cn(classes.paymentLabelValuePanel)}>
                              <span className={classes.paymentLabel}>
                                {getLang('orderStatus', { fallback: 'Status' })}
                              </span>
                              <span className={classes.paymentValue}>
                                {capitalize(transaction?.status)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </AccordionDetails>
                    ))}
                </div>
              </AccordionDetails>
            </Accordion>
          );
        })}
    </div>
  );
};

OrderDetailsPaymentHistory.propTypes = {
  paymentDetail: PropTypes.object,
  disableAdjustments: PropTypes.bool,
  expand: PropTypes.bool,
};

export default OrderDetailsPaymentHistory;
