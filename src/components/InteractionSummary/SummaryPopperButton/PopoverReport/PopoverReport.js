import { cloneElement, useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import paymentIcons from '@components/PaymentIcons';
import classNames from 'classnames';
import { capitalize } from '@/utils/string';
import ConcessionAndRefund from './ConcessionAndRefund';

const useStyles = makeStyles((theme) => ({
  root: {
    fontSize: 12,
    minWidth: theme.utils.fromPx(125),
    minHeight: theme.utils.fromPx(150),
  },
  contactReason: {
    fontSize: '14px',
    fontWeight: 500,
  },
  refundMethod: {
    marginTop: '8px',
  },
  refundMethodContainer: {
    display: 'inline-flex',
    alignItems: 'center',
  },
  merchantLogo: {
    height: '28px',
    marginLeft: '5px',
  },
  amountContainer: {
    display: 'inline-flex',
  },
  concessionContainer: {
    marginLeft: '12px',
  },
  description: {
    fontWeight: 500,
    fontSize: '12px',
    paddingTop: theme.utils.fromPx(4),
  },
  label: {
    color: theme.palette.white,
    fontSize: '12px',
    fontWeight: 400,
  },
  bold: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  row: {
    marginTop: '12px',
  },
  hide: {
    display: 'none',
  },
  none: {
    fontStyle: 'italic',
    color: theme.palette.gray[350],
    textAlign: 'center',
    margin: 0,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
}));

const PopoverReport = ({ appeasements }) => {
  const classes = useStyles();

  let renderShippingConcession = false;

  if (appeasements?.length === 1 && appeasements[0].description === 'shipping') {
    renderShippingConcession = true;
  }

  const appeasementsToRender = useMemo(
    () =>
      appeasements
        ?.filter(({ actions }) => {
          return actions?.some((action) => action?.type !== 'REPLACEMENT');
        })
        ?.filter(({ description }) =>
          renderShippingConcession ? true : description !== 'shipping',
        ),
    [appeasements],
  );

  return (
    <div className={classes.root} data-testid="popover-report:body">
      <div className={classes.contactReason}>Refund & Concession Information</div>
      {(!appeasements || appeasementsToRender?.length === 0) && (
        <span className={classes.none}>None</span>
      )}
      {appeasementsToRender?.map((appeasement) => {
        return (
          <>
            <div className={classNames(classes.description, classes.row)}>
              {capitalize(appeasement?.description)}
            </div>
            <ConcessionAndRefund
              details={appeasement?.details}
              includesShippingConcession={appeasement?.description === 'shipping'}
            />
            {appeasement?.details?.accountNumber && appeasement?.details?.cardType && (
              <div>
                <div className={classNames(classes.refundMethod, classes.label)}>Refund Method</div>
                <div className={classes.refundMethodContainer}>
                  <span className={classes.contactReason}>
                    {appeasement?.details?.accountNumber?.slice(-4)}
                  </span>
                  {paymentIcons.hasOwnProperty(appeasement?.details?.cardType)
                    ? cloneElement(paymentIcons[appeasement?.details?.cardType], {
                        className: classes.merchantLogo,
                      })
                    : 'Not Found'}
                </div>
              </div>
            )}
          </>
        );
      })}
    </div>
  );
};

PopoverReport.propTypes = {
  appeasements: PropTypes.array,
};

export default PopoverReport;
