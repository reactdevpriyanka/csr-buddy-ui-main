import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { currencyFormatter, capitalize, snakeCaseToTitleCase } from '@/utils/string';
import { useState } from 'react';
import cn from 'classnames';
import { getDayDateYearTimeTimezone } from '@/utils';

import {
  AccordionDetails,
  AccordionSummary,
  Accordion,
} from '@/components/Autoship/AutoshipViewDetailsDialog/AutoshipViewDetailsDialogHelper';
import useAthena from '@/hooks/useAthena';

const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontSize: theme.utils.fromPx(18),
    lineHeight: theme.utils.fromPx(24),
    marginBottom: '1.75rem',
    color: '#031657',
  },
  top: {
    marginTop: '20px',
  },
  paymentRow: {
    display: 'grid',
    gridTemplateColumns: '3fr 1fr 1fr 1fr',
    columnGap: '10px',
    backgroundColor: '#EEEEEE',
    height: '50px !important',
    marginTop: '15px',
    padding: `0rem ${theme.utils.fromPx(16)}`,
  },
  paymentHeading: {
    marginTop: '16px',
    color: '#000000',
    fontFamily: 'Roboto',
    fontWeight: '700',
    lineHeight: theme.utils.fromPx(16),
    fontSize: '12px',
  },
  paymentStatusHeading: {
    marginTop: '16px',
    color: '#000000',
    fontFamily: 'Roboto',
    fontWeight: '700',
    lineHeight: theme.utils.fromPx(16),
    fontSize: '12px',
    justifySelf: 'start',
  },
  accordionComponent: {
    '& .MuiPaper-root.MuiAccordion-root': {
      border: 'none',
    },
    '& .MuiAccordionSummary-expandIconWrapper': {
      marginTop: '16px',
      marginRight: theme.utils.fromPx(4),
    },
    '& .MuiAccordionSummary-root': {
      display: 'flex',
      borderTop: '1px solid #999999',
      borderBottom: '1px solid #999999',
    },
    '& .MuiAccordionDetails-root': {
      padding: `${theme.utils.fromPx(8)} ${theme.utils.fromPx(16)}`,
      backgroundColor: '#FFFFFF',
    },
    '& .MuiAccordion-region': {
      backgroundColor: '#F5F5F5',
    },
    '& .MuiAccordionSummary-content': {
      display: 'grid',
      gridTemplateColumns: '3fr 1fr 1fr 1fr',
      columnGap: '10px',
    },
  },
  paymentPanel: {
    display: 'grid',
    gridTemplateColumns: '4fr 1fr 1fr 1fr 1fr',
    columnGap: '10px',
  },
  paymentLabel: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontStyle: 'regular',
    fontSize: theme.utils.fromPx(12),
    lineHeight: theme.utils.fromPx(15),
    color: '#666666',
  },
  paymentValue: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontStyle: 'regular',
    fontSize: theme.utils.fromPx(14),
    lineHeight: theme.utils.fromPx(18),
    color: '#121212',
    paddingTop: theme.utils.fromPx(4),
  },
  paymentLabelValuePanel: {
    display: 'flex',
    flexDirection: 'column',
  },
  status: {
    alignSelf: 'center',
    textAlign: 'start',
  },
  alignSelfEnd: {
    alignSelf: 'end',
  },
}));

const ReturnRefundDetails = ({ expand = false, disableAdjustments = false, returnData }) => {
  const classes = useStyles();
  const { getLang } = useAthena(); // athena config

  const [panelExpanded, setPanelExpanded] = useState(expand);
  const handleChange = (panel) => (event, newExpanded) => {
    setPanelExpanded(!panelExpanded);
  };

  const isRefund = returnData?.type === 'REFUND';

  return (
    <div className={classes.top} data-testid="returnRefundDetails">
      {isRefund ? (
        <span className={classes.title}>
          {getLang('returnRefundslabel', { fallback: 'Refunds' })}
        </span>
      ) : (
        <span className={classes.title}>
          {getLang('returnRefundsConcessionPayment', { fallback: 'Concession Payment' })}
        </span>
      )}
      <div className={classes.paymentRow}>
        <div className={classes.paymentHeading}>
          {getLang('returnRefundsInstructionID', { fallback: 'Instruction ID' })}
        </div>
        <div className={classes.paymentStatusHeading}>
          {getLang('returnConcessionCreated', { fallback: 'Created' })}
        </div>
        <div className={classes.paymentStatusHeading}>
          {getLang('returnRefundsPaymentMethod', { fallback: 'Payment method' })}
        </div>
        <div className={classes.paymentStatusHeading}>
          {getLang('returnConcessionStatus', { fallback: 'Status' })}
        </div>
      </div>
      {returnData?.paymentDetails?.length > 0 &&
        returnData?.paymentDetails
          .filter((paymentDetail) => !!paymentDetail.payments)
          .map((paymentDetail) => {
            return (
              <Accordion
                data-testid="order:return:accordion"
                disableGutters
                disabled={disableAdjustments}
                expanded={panelExpanded}
                onChange={handleChange()}
                className={classes.accordionComponent}
                key={paymentDetail?.id}
              >
                <AccordionSummary
                  data-testid="order:return:accordion:summary"
                  aria-controls="panel1d-content"
                  id="panel1d-header"
                >
                  <div>{paymentDetail?.payments?.[0]?.paymentReferenceId}</div>
                  <div className={classes.status}>
                    {getDayDateYearTimeTimezone(paymentDetail?.payments?.[0]?.timeCreated)}
                  </div>
                  <div className={classes.status}>
                    {paymentDetail?.paymentMethod?.type === 'CREDIT_CARD'
                      ? snakeCaseToTitleCase(paymentDetail?.paymentMethod?.creditCard?.cardType)
                      : paymentDetail?.paymentMethod?.type === 'GIFT_CARD'
                      ? snakeCaseToTitleCase(paymentDetail?.paymentMethod?.type)
                      : snakeCaseToTitleCase(paymentDetail?.paymentMethod?.service?.type)}
                  </div>
                  <div className={classes.status}>
                    {capitalize(paymentDetail?.payments?.[0]?.paymentStatus)}
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  {paymentDetail?.payments?.length > 0 &&
                    paymentDetail?.payments.map((payment) => (
                      <div key={payment?.id} data-testid="order:return:accordion:details">
                        <div className={classes.paymentPanel}>
                          <div className={classes.paymentLabelValuePanel}>
                            {isRefund && (
                              <span className={classes.paymentLabel}>
                                {' '}
                                {paymentDetail?.paymentMethod?.type === 'CREDIT_CARD'
                                  ? paymentDetail?.paymentMethod?.creditCard?.cardType
                                  : paymentDetail?.paymentMethod?.type === 'GIFT_CARD'
                                  ? paymentDetail?.paymentMethod?.type === 'SERVICE'
                                  : snakeCaseToTitleCase(
                                      paymentDetail?.paymentMethod?.service?.type,
                                    )}{' '}
                                #
                              </span>
                            )}
                            {isRefund && (
                              <span className={classes.paymentValue}>
                                {' '}
                                {paymentDetail?.paymentMethod?.type === 'CREDIT_CARD'
                                  ? paymentDetail?.paymentMethod?.creditCard?.cardNumber
                                  : paymentDetail?.paymentMethod?.type === 'GIFT_CARD'
                                  ? paymentDetail?.paymentMethod?.giftCard?.cardNumber
                                  : paymentDetail?.paymentMethod?.type === 'APPLE_PAY'
                                  ? paymentDetail?.paymentMethod?.service?.accountNumber
                                  : paymentDetail?.paymentMethod?.service?.type === 'PAYPAL'
                                  ? paymentDetail?.paymentMethod?.service?.email
                                  : snakeCaseToTitleCase(
                                      paymentDetail?.paymentMethod?.service?.type,
                                    )}
                              </span>
                            )}
                          </div>
                          <div className={classes.paymentLabelValuePanel}>
                            <div className={classes.alignSelfEnd}>
                              <div className={classes.paymentLabel}>
                                {getLang('returnConcessionRequested', { fallback: 'Requested' })}
                              </div>
                              <div className={classes.paymentValue}>
                                {currencyFormatter(payment?.paymentAmount?.requested)}
                              </div>
                            </div>
                          </div>
                          <div className={cn(classes.paymentLabelValuePanel)}>
                            <div className={classes.alignSelfEnd}>
                              <div className={classes.paymentLabel}>
                                {getLang('returnConcessionApproved', { fallback: 'Approved' })}
                              </div>
                              <div className={classes.paymentValue}>
                                {currencyFormatter(payment?.paymentAmount?.approved)}
                              </div>
                            </div>
                          </div>
                          <div className={cn(classes.paymentLabelValuePanel)}>
                            <div className={classes.alignSelfEnd}>
                              <div className={classes.paymentLabel}>
                                {getLang('returnConcessionDeposited', { fallback: 'Deposited' })}
                              </div>
                              <div className={classes.paymentValue}>
                                {currencyFormatter(payment?.paymentAmount?.deposited)}
                              </div>
                            </div>
                          </div>
                          <div className={cn(classes.paymentLabelValuePanel)}>
                            <div className={classes.alignSelfEnd}>
                              <div className={classes.paymentLabel}>
                                {getLang('returnConcessionCredited', { fallback: 'Credited' })}
                              </div>
                              <div className={classes.paymentValue}>
                                {currencyFormatter(payment?.paymentAmount?.credited)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </AccordionDetails>
              </Accordion>
            );
          })}
    </div>
  );
};

ReturnRefundDetails.propTypes = {
  disableAdjustments: PropTypes.bool,
  expand: PropTypes.bool,
  returnData: PropTypes.object.isRequired,
};

export default ReturnRefundDetails;
