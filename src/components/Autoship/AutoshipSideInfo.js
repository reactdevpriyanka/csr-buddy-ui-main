import PropTypes from 'prop-types';
import cn from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { ProfileInfo } from '@components/Card';
import { Button, Link } from '@material-ui/core';
import { formatDateWithTime } from '@/utils';
import { useState } from 'react';
import FeatureFlag from '@/features/FeatureFlag';
import { currencyFormatter } from '@/utils/string';
import { useRouter } from 'next/router';
import AddressLabel from '../Base/AddressLabel';
import { AutoshipViewDetailsDialog } from './AutoshipViewDetailsDialog';

const useStyles = makeStyles((theme) => ({
  root: {},
  profileInfo: {
    display: 'grid',
    gridRowGap: '10px',
    gridTemplateColumns: 'auto',
    borderRadius: '4px',
    padding: '16px',
    background: '#F5F5F5',
    border: '2px solid #F5F5F5',
    transition: 'background-color 0.2s linear',
    '&:hover': {
      border: '2px solid #1C49C2',
      boxShadow: '0px 0px 4px 2px rgb(28, 73, 194, 0.6)',
      transition: 'box-shadow 0.2s linear',
      backgroundColor: '#DDF0FF80',
      cursor: 'default',
    },
    '& div:nth-child(2)': {
      marginTop: '10px',
      // marginBottom: '10px',
    },
  },
  profileInfoIsFocused: {
    backgroundColor: theme.palette.primary.white,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
    marginBottom: theme.spacing(2),
  },

  headerAction: {
    padding: theme.spacing(2),
    margin: `-${theme.spacing(2)}`,
  },

  subscriptionDetails: {
    marginBottom: '15px',
  },
  subscriptionDetailsTitle: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontStyle: 'normal',
    fontSize: '16px',
    lineHeight: '22px',
    color: '#333333',
  },
  subscriptionDetailsText: {
    fontFamily: 'Roboto',
    fontWeight: '500',
    fontStyle: 'normal',
    fontSize: '14px',
    lineHeight: '18px',
    color: '#666666',
  },
  shippingInfo: {
    '& div:first-child': {
      marginBottom: '0px',
    },
  },
  autoshipHistoryBtn: {
    background: '#FFFFFF',
    border: '2px solid #1C49C2',
    boxSizing: 'border-box',
    borderRadius: '4px',
    pointerEvents: 'all',
    opacity: '1',
    '&:hover': {
      // backgroundColor: '#DDF0FF80',
      background: '#B8D7F3',
      // boxShadow: '0px 0px 4px 2px rgb(28, 73, 194, 0.6)',
      // transition: 'box-shadow 0.2s linear',
    },
  },
  autoshipHistoryBtnTxt: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontStyle: 'normal',
    fontSize: '16px',
    lineHeight: '20px',
    color: '#1C49C2',
  },
  cancelled: {
    opacity: '0.4',
  },
  paymentDetails: {
    display: 'grid',
    gridTemplateColumns: 'auto 30px',
    marginRight: '5px',
  },
  btnViewDetails: {
    color: '#146BBE',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  paymentDetailsProfile: {
    marginRight: '0',
  },
  orderTotal: {
    marginTop: '5px',
  },
}));

const AutoshipSideInfo = ({
  subscriptionData,
  paymentDetails,
  onSeeHistory,
  startDate,
  isCancelled,
  name,
  nextFulfillmentDate,
  lastShipmentDate,
  cancelDate,
  products = [],
  isUpcoming,
  lastOrderStatus,
  status,
  frequency,
  autoshipTotals,
  orderFees,
}) => {
  const classes = useStyles();
  const router = useRouter();

  const [openAutoshipViewDetailsDialog, setOpenAutoshipViewDetailsDialog] = useState(false);

  const handleClick = () => {
    onSeeHistory(subscriptionData?.name);
  };

  const handleOnClickViewDetailsBtn = () => {
    setOpenAutoshipViewDetailsDialog(true);
  };

  const content = (
    <>
      <div className={cn(classes.subscriptionDetails, isCancelled ? classes.cancelled : '')}>
        <div className={classes.subscriptionDetailsTitle}>Subscription details</div>
        <div className={classes.subscriptionDetailsText}>Autoship ID {subscriptionData?.id}</div>
        <div className={classes.subscriptionDetailsText}>
          Autoship Created on {formatDateWithTime(subscriptionData?.timePlaced)}
        </div>
      </div>

      <div className={classes.profileInfo}>
        <div className={isCancelled ? classes.cancelled : ''}>
          {subscriptionData?.shippingAddress && (
            <div className={classes.shippingInfo}>
              <AddressLabel title="Shipping to:" value={{ ...subscriptionData.shippingAddress }} />
            </div>
          )}
          <div className={classes.paymentDetails}>
            <ProfileInfo header="Payment" className={classes.paymentDetailsProfile}>
              {paymentDetails}
            </ProfileInfo>

            <FeatureFlag flag="feature.explorer.autoshipViewPaymentDetailsEnabled">
              <Link
                data-testid={`autoship:payment:viewdetails:link:${subscriptionData?.id}`}
                className={classes.btnViewDetails}
                underline="always"
                onClick={handleOnClickViewDetailsBtn}
              >
                <span
                  data-testid={`autoship:payment:viewdetails:link:label:${subscriptionData?.id}`}
                  className={classes.viewDetails}
                >
                  View
                </span>
              </Link>
            </FeatureFlag>
            <span className={classes.orderTotal}>
              Total: {currencyFormatter(subscriptionData?.total?.value)}
            </span>
          </div>
        </div>

        {router.pathname.endsWith('/autoship') && (
          <Button
            variant="outlined"
            data-testid={`autoship-history-${subscriptionData?.id}`}
            className={classes.autoshipHistoryBtn}
            disableRipple
            aria-label="See Autoship History"
            onClick={handleClick}
          >
            <span className={classes.autoshipHistoryBtnTxt}>{'See Autoship History'}</span>
          </Button>
        )}

        {openAutoshipViewDetailsDialog && (
          <AutoshipViewDetailsDialog
            isOpen={openAutoshipViewDetailsDialog}
            openDialog={setOpenAutoshipViewDetailsDialog}
            subscriptionData={subscriptionData}
            paymentDetails={paymentDetails}
            startDate={startDate}
            products={products}
            name={name}
            nextFulfillmentDate={nextFulfillmentDate}
            lastShipmentDate={lastShipmentDate}
            isUpcoming={isUpcoming}
            cancelDate={cancelDate}
            lastOrderStatus={lastOrderStatus}
            status={status}
            frequency={frequency}
            autoshipTotals={autoshipTotals}
            orderFees={orderFees}
          />
        )}
      </div>
    </>
  );

  return <div className={classes.root}>{content}</div>;
};

AutoshipSideInfo.propTypes = {
  subscriptionData: PropTypes.object,
  paymentDetails: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onSeeHistory: PropTypes.func.isRequired,
  startDate: PropTypes.string,
  isCancelled: PropTypes.bool,
  cancelDate: PropTypes.string,
  products: PropTypes.array.isRequired,
  name: PropTypes.string,
  nextFulfillmentDate: PropTypes.string,
  lastShipmentDate: PropTypes.string,
  isUpcoming: PropTypes.bool,
  lastOrderStatus: PropTypes.string,
  status: PropTypes.string,
  frequency: PropTypes.string,
  autoshipTotals: PropTypes.object,
  orderFees: PropTypes.arrayOf(PropTypes.object),
};

export default AutoshipSideInfo;
